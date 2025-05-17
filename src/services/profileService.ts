import { networkService } from "./network";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    role: 'USER' | 'ADMIN' | 'ORGANIZER';
    isMonitored: boolean;
    has2FAEnabled: boolean;
}

export interface ProfileUpdateDto {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    birthDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

class ProfileService {
    private static instance: ProfileService;
    private readonly LOCAL_STORAGE_KEY = 'user_profile';

    private constructor() {}

    public static getInstance(): ProfileService {
        if (!ProfileService.instance) {
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    private async makeRequest<T>(endpoint: string, method: string = 'GET', body?: object): Promise<T> {
        const token = localStorage.getItem('token');
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

            const response = await fetch(`${API_URL}/api/users${endpoint}`, options);
            
            if (response.status === 401) {
                throw new Error('Unauthorized - Please log in again');
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch profile data');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred');
        }
    }

    public async getProfile(): Promise<UserProfile> {
        const { isOnline, isServerAvailable } = networkService.getStatus();
        const token = localStorage.getItem('token');
        console.log('Getting profile with token:', token ? 'Token exists' : 'No token');
        
        if (!isOnline || !isServerAvailable) {
            console.log('Offline mode - using cached profile');
            const cachedProfile = this.getCachedProfile();
            if (!cachedProfile) {
                throw new Error('No cached profile data available');
            }
            return cachedProfile;
        }

        try {
            console.log('Making profile request...');
            const profile = await this.makeRequest<UserProfile>('/profile?t=' + new Date().getTime());
            console.log('Profile response:', { 
                ...profile, 
                has2FAEnabled: profile.has2FAEnabled,
                token: token ? 'Token exists' : 'No token'
            });
            
            if (profile.has2FAEnabled === undefined) {
                console.warn('Profile response missing has2FAEnabled field');
            }
            
            this.cacheProfile(profile);
            return profile;
        } catch (error) {
            console.error('Profile request error:', error);
            const cachedProfile = this.getCachedProfile();
            if (cachedProfile) {
                console.log('Using cached profile due to error');
                return cachedProfile;
            }
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Failed to fetch profile');
        }
    }

    public async updateProfile(updateData: ProfileUpdateDto): Promise<UserProfile> {
        const { isOnline, isServerAvailable } = networkService.getStatus();
        
        if (!isOnline || !isServerAvailable) {
            throw new Error('Cannot update profile while offline');
        }

        try {
            const updatedProfile = await this.makeRequest<UserProfile>('/profile', 'PUT', updateData);
            this.cacheProfile(updatedProfile);
            return updatedProfile;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Failed to update profile');
        }
    }

    private cacheProfile(profile: UserProfile): void {
        try {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(profile));
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to cache profile:', error.message);
            }
        }
    }

    private getCachedProfile(): UserProfile | null {
        try {
            const cached = localStorage.getItem(this.LOCAL_STORAGE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Failed to get cached profile:', error.message);
            }
            return null;
        }
    }

    public clearCache(): void {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
    }
}

export const profileService = ProfileService.getInstance(); 