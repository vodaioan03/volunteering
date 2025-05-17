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
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
} 