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

// Helper function to check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

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
        
        // Only store token and user info if 2FA is not required and we're in a browser
        if (!result.requires2FA && isBrowser()) {
            if (!result.token) {
                throw new Error('No token received from server');
            }
            localStorage.setItem('token', result.token);
            
            try {
                const decoded = jwtDecode<JwtPayload>(result.token);
                const user: User = {
                    email: decoded.email,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName
                };
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                if (result.user) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                }
            }
        } else if (isBrowser()) {
            if (!result.temporaryToken) {
                throw new Error('No temporary token received for 2FA');
            }
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
        
        if (isBrowser()) {
            localStorage.setItem('token', result.token);
            const user: User = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName
            };
            localStorage.setItem('user', JSON.stringify(user));
        }
    },

    getCurrentUser: (): User | null => {
        if (!isBrowser()) return null;
        
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },
    
    getUserId: (): string | null => {
        if (!isBrowser()) return null;
        
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
        if (!isBrowser()) return;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    },

    getToken: (): string | null => {
        if (!isBrowser()) return null;
        return localStorage.getItem('token');
    },

    isTokenValid: (): boolean => {
        if (!isBrowser()) return false;
        
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