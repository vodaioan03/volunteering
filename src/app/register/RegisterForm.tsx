"use client";
import React, { useState } from "react";
import styles from "./Register.module.css";
import UserAvatar from "../../components/userAvatar/UserAvatar";
import { createPortal } from "react-dom";
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { RegisterDto, ValidationError } from '@/types/auth';
import { useAuth } from '@/context/AuthContext';

interface RegisterFormProps {
  onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const router = useRouter();
  const { setUser, setIsAuthenticated } = useAuth();
  const [formData, setFormData] = useState<RegisterDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.firstName) {
      newErrors.push({ field: 'firstName', message: 'First name is required' });
    }

    if (!formData.lastName) {
      newErrors.push({ field: 'lastName', message: 'Last name is required' });
    }

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
      await authService.register(formData);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      onClose();
      router.refresh(); // Refresh the page to update the header
    } catch (error) {
      setErrors([{ field: 'general', message: error instanceof Error ? error.message : 'Registration failed' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  // Only render on client side
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        
        <div className={styles.header}>Create Account</div>

        <div className={styles.profileSection}>
          <UserAvatar />
        </div>

        {getFieldError('general') && (
          <div className={styles.error}>
            {getFieldError('general')}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="firstName" className={styles.label}>First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
            />
            {getFieldError('firstName') && (
              <span className={styles.errorText}>{getFieldError('firstName')}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName" className={styles.label}>Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={styles.input}
              value={formData.lastName}
              onChange={handleChange}
            />
            {getFieldError('lastName') && (
              <span className={styles.errorText}>{getFieldError('lastName')}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
            {getFieldError('email') && (
              <span className={styles.errorText}>{getFieldError('email')}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
            {getFieldError('password') && (
              <span className={styles.errorText}>{getFieldError('password')}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.createButton}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RegisterForm; 