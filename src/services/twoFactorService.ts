import { TwoFactorSetupResponse, TwoFactorVerifyDto, TwoFactorLoginDto } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class TwoFactorService {
    private static instance: TwoFactorService;

    private constructor() {}

    public static getInstance(): TwoFactorService {
        if (!TwoFactorService.instance) {
            TwoFactorService.instance = new TwoFactorService();
        }
        return TwoFactorService.instance;
    }

    private async makeRequest<T>(endpoint: string, method: string = 'GET', body?: object, temporaryToken?: string): Promise<T> {
        const token = temporaryToken || localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                mode: 'cors'
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_URL}/api/auth/2fa${endpoint}`, options);
            
            if (response.status === 401) {
                throw new Error('Unauthorized - Please log in again');
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to process 2FA request');
            }

            return await response.json();
        } catch (error) {
            console.error('2FA Request Error:', error);
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred');
        }
    }

    public async setupTwoFactor(): Promise<TwoFactorSetupResponse> {
        try {
            const setupResponse = await this.makeRequest<TwoFactorSetupResponse>('/setup', 'POST');
            
            console.log('Setup response:', {
                hasQrCode: !!setupResponse.qrCodeImage,
                hasSecret: !!setupResponse.secret
            });

            return setupResponse;
        } catch (error) {
            console.error('Setup 2FA Error:', error);
            throw error;
        }
    }

    public async verifyAndEnable(data: TwoFactorVerifyDto): Promise<void> {
        try {
            console.log('Verifying 2FA code with data:', { 
                code: data.code, 
                hasSecret: !!data.secret
            });
            
            if (!data.secret) {
                throw new Error('No secret provided for 2FA verification');
            }

            // Verify and enable 2FA in one step
            const verified = await this.makeRequest<boolean>('/verify', 'POST', {
                code: data.code,
                secret: data.secret
            });
            
            console.log('2FA verification response:', verified);

            if (!verified) {
                throw new Error('Invalid verification code');
            }

            // After successful verification, we should refresh the user's profile
            const token = localStorage.getItem('token');
            console.log('Current token after 2FA verification:', token ? 'Token exists' : 'No token');
        } catch (error) {
            console.error('Verify 2FA Error:', error);
            throw error;
        }
    }

    public async verifyLogin(data: TwoFactorLoginDto): Promise<{ token: string }> {
        try {
            return await this.makeRequest<{ token: string }>('/login', 'POST', data, data.temporaryToken);
        } catch (error) {
            console.error('2FA Login Error:', error);
            throw error;
        }
    }

    public async disable(): Promise<void> {
        try {
            await this.makeRequest('/disable', 'POST');
        } catch (error) {
            console.error('Disable 2FA Error:', error);
            throw error;
        }
    }
}

export const twoFactorService = TwoFactorService.getInstance(); 