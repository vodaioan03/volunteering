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
    login: async (data: LoginDto): Promise<void> => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'same-origin',
            mode: 'cors'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const result: AuthResponse = await response.json();
        localStorage.setItem('token', result.token);
        
        // Decode token to get user info
        const decoded = jwtDecode<JwtPayload>(result.token);
        const user: User = {
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName
        };
        localStorage.setItem('user', JSON.stringify(user));
    },

    register: async (data: RegisterDto): Promise<void> => {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'same-origin',
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
        
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            // First try to get from localStorage
            const userData = localStorage.getItem('user');
            if (userData && userData !== 'undefined' && userData !== 'null') {
                try {
                    const parsedUser = JSON.parse(userData);
                    // Validate the parsed user object has required fields
                    if (parsedUser && 
                        typeof parsedUser === 'object' && 
                        'email' in parsedUser && 
                        'firstName' in parsedUser && 
                        'lastName' in parsedUser) {
                        return parsedUser;
                    }
                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                    // Continue to token decoding as fallback
                }
            }

            // If not in localStorage or invalid, try to decode from token
            const decoded = jwtDecode<JwtPayload>(token);
            const user: User = {
                email: decoded.email,
                firstName: decoded.firstName,
                lastName: decoded.lastName
            };
            // Update localStorage with valid user data
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            // Clear potentially corrupted data
            localStorage.removeItem('user');
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