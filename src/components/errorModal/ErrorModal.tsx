"use client";

import React from 'react';
import styles from './ErrorModal.module.css';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Error</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.errorMessage}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.okButton} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal; 