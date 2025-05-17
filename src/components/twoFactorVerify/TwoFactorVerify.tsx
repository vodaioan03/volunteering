import React, { useState } from 'react';
import styles from './TwoFactorVerify.module.css';
import { twoFactorService } from '@/services/twoFactorService';
import { useAuth } from '@/context/AuthContext';
import { useError } from '@/context/ErrorContext';

interface TwoFactorVerifyProps {
    temporaryToken: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const TwoFactorVerify: React.FC<TwoFactorVerifyProps> = ({ temporaryToken, onSuccess, onCancel }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUser, setIsAuthenticated } = useAuth();
    const { showError } = useError();

    const handleVerify = async () => {
        if (!code) {
            showError('Please enter the verification code');
            return;
        }

        if (!temporaryToken) {
            showError('Missing temporary token for 2FA verification');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Verifying 2FA code with temp token:', { hasToken: !!temporaryToken });
            const response = await twoFactorService.verifyLogin({
                code,
                temporaryToken
            });

            if (!response.token) {
                throw new Error('No token received after 2FA verification');
            }

            console.log('2FA verification successful, storing permanent token');
            // Store the new token
            localStorage.setItem('token', response.token);
            
            // Update auth context
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            }

            onSuccess();
        } catch (error) {
            console.error('2FA verification error:', error);
            showError(error instanceof Error ? error.message : 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2>Two-Factor Authentication</h2>
                <p>Enter the 6-digit code from your authenticator app</p>

                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="000000"
                        className={styles.codeInput}
                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.verifyButton}
                        onClick={handleVerify}
                        disabled={isLoading || code.length !== 6}
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TwoFactorVerify; 