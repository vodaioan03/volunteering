// src/services/auth.service.ts
import { LoginDto, RegisterDto, AuthResponse, User } from '../types/auth';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface JwtPayload {
    sub: string;
    email: string;
    firstName: string;
    lastName: string;
    exp: number;
}

export const authService = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const result: AuthResponse = await response.json();
        console.log('Login response:', { 
            ...result, 
            token: result.token ? 'Token exists' : 'No token',
            requires2FA: result.requires2FA,
            hastemporaryToken: !!result.temporaryToken
        });
        
        // Only store token and user info if 2FA is not required
        if (!result.requires2FA) {
            if (!result.token) {
                throw new Error('No token received from server');
            }
            localStorage.setItem('token', result.token);
            console.log('Token stored in localStorage');
            
            try {
                // Decode token to get user info
                const decoded = jwtDecode<JwtPayload>(result.token);
                console.log('Decoded token payload:', { ...decoded, sub: '[REDACTED]' });
                
                const user: User = {
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName
                };
                localStorage.setItem('user', JSON.stringify(user));
                console.log('User info stored in localStorage');
            } catch (error) {
                console.error('Error decoding token:', error);
                // Even if token decoding fails, try to get user info from the response
                if (result.user) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    console.log('User info stored from response');
                }
            }
        } else {
            if (!result.temporaryToken) {
                throw new Error('No temporary token received for 2FA');
            }
            console.log('2FA is required, not storing permanent token yet');
            // Make sure we don't have any old tokens when 2FA is required
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        return result;
    },

    register: async (data: RegisterDto): Promise<void> => {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
            mode: 'cors'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const result: AuthResponse = await response.json();
        localStorage.setItem('token', result.token);
        
        // After registration, store the user data we just sent
        const user: User = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName
        };
        localStorage.setItem('user', JSON.stringify(user));
    },

    getCurrentUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
      return null;
        }
    },
    
    getUserId: (): string | null => {
        if (typeof window === 'undefined') return null;
        
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.sub;
        } catch {
            return null;
        }
    },

    logout: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    },

    isTokenValid: (): boolean => {
        if (typeof window === 'undefined') return false;
        
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }
  };