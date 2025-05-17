export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    requires2FA?: boolean;
    temporaryToken?: string;  // Used during 2FA verification
    user?: User;  // Add user field
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    has2FAEnabled?: boolean;
}

export interface TwoFactorSetupResponse {
    secret: string;
    qrCodeImage: string;
}

export interface TwoFactorVerifyDto {
    code: string;
    secret: string;
}

export interface TwoFactorLoginDto {
    code: string;
    temporaryToken: string;
} 