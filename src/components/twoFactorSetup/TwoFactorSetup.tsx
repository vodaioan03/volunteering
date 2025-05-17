import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './TwoFactorSetup.module.css';
import { twoFactorService } from '@/services/twoFactorService';
import { useError } from '@/context/ErrorContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';

interface TwoFactorSetupProps {
    onClose: () => void;
    onSuccess: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onClose, onSuccess }) => {
    const [step, setStep] = useState<'initial' | 'verify'>('initial');
    const [qrCodeImage, setQrCodeImage] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const { showError } = useError();

    const handleSetup = async () => {
        try {
            setIsLoading(true);
            const response = await twoFactorService.setupTwoFactor();
            console.log('2FA Setup Response:', response);
            setQrCodeImage(response.qrCodeImage);
            setSecret(response.secret);
            setStep('verify');
        } catch (error) {
            console.error('2FA Setup Error:', error);
            showError(error instanceof Error ? error.message : 'Failed to setup 2FA');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode) {
            showError('Please enter the verification code');
            return;
        }

        if (!secret) {
            console.error('No secret available for verification');
            showError('Setup data not found. Please try setting up 2FA again.');
            return;
        }

        try {
            setIsLoading(true);
            await twoFactorService.verifyAndEnable({
                code: verificationCode,
                secret: secret
            });
            
            onSuccess();
        } catch (error) {
            showError(error instanceof Error ? error.message : 'Failed to verify 2FA code');
        } finally {
            setIsLoading(false);
        }
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            localStorage.removeItem('2fa_secret');
        };
    }, []);

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                
                {step === 'initial' ? (
                    <div className={styles.initialStep}>
                        <h2>Enable Two-Factor Authentication</h2>
                        <p>Two-factor authentication adds an extra layer of security to your account.</p>
                        
                        <div className={styles.authenticatorInfo}>
                            <h3>First, install an authenticator app:</h3>
                            <div className={styles.appOptions}>
                                <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className={styles.appLink}>
                                    <FontAwesomeIcon icon={faGoogle} />
                                    Google Authenticator (Android)
                                </a>
                                <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className={styles.appLink}>
                                    <FontAwesomeIcon icon={faApple} />
                                    Google Authenticator (iOS)
                                </a>
                            </div>
                        </div>

                        <button 
                            className={styles.setupButton}
                            onClick={handleSetup}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Setting up...' : 'Continue Setup'}
                        </button>
                    </div>
                ) : (
                    <div className={styles.verifyStep}>
                        <h2>Scan QR Code</h2>
                        <p>Open your authenticator app and scan this QR code:</p>
                        
                        <div className={styles.qrContainer}>
                            {qrCodeImage && (
                                <div className={styles.qrWrapper}>
                                    <img
                                        src={qrCodeImage}
                                        alt="2FA QR Code"
                                        width={200}
                                        height={200}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles.manualEntry}>
                            <p>Can't scan the QR code? Manually enter this code in your authenticator app:</p>
                            <code className={styles.secretCode}>{secret}</code>
                        </div>

                        <div className={styles.verificationSection}>
                            <p>Enter the 6-digit code from your authenticator app:</p>
                            <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="000000"
                                className={styles.codeInput}
                            />
                            <button
                                className={styles.verifyButton}
                                onClick={handleVerify}
                                disabled={isLoading || verificationCode.length !== 6}
                            >
                                {isLoading ? 'Verifying...' : 'Verify and Enable 2FA'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwoFactorSetup; 