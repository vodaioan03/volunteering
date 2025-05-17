'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { LoginDto, ValidationError } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';
import { useError } from '@/context/ErrorContext';
import TwoFactorVerify from '@/components/twoFactorVerify/TwoFactorVerify';

export default function LoginPage() {
    const router = useRouter();
    const { setUser, setIsAuthenticated } = useAuth();
    const { showError } = useError();
    const [formData, setFormData] = useState<LoginDto>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [temporaryToken, settemporaryToken] = useState('');

    const validateForm = (): boolean => {
        const newErrors: ValidationError[] = [];

        if (!formData.email) {
            newErrors.push({ field: 'email', message: 'Email is required' });
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.push({ field: 'email', message: 'Invalid email format' });
        }

        if (!formData.password) {
            newErrors.push({ field: 'password', message: 'Password is required' });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.login(formData);
            
            if (response.requires2FA) {
                settemporaryToken(response.temporaryToken || '');
                setShowTwoFactor(true);
            } else {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                }
                router.push('/'); // Redirect to home page after successful login
            }
        } catch (error) {
            showError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTwoFactorSuccess = () => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
        }
        router.push('/');
    };

    const handleTwoFactorCancel = () => {
        setShowTwoFactor(false);
        settemporaryToken('');
        authService.logout();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                {errors.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm">
                        {error.message}
                    </p>
                ))}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.find(error => error.field === 'email') ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    errors.find(error => error.field === 'password') ? 'border-red-300' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={(e) => {
                        e.preventDefault();
                        router.push('/register');
                    }}>
                        Don't have an account? Register
                    </Link>
                </div>
            </div>

            {showTwoFactor && (
                <TwoFactorVerify
                    temporaryToken={temporaryToken}
                    onSuccess={handleTwoFactorSuccess}
                    onCancel={handleTwoFactorCancel}
                />
            )}
        </div>
    );
} 