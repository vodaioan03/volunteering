"use client";

import React, { createContext, useContext, useState } from 'react';
import ErrorModal from '../components/errorModal/ErrorModal';

interface ErrorContextType {
  showError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>({
  showError: () => {},
  clearError: () => {},
});

export const useError = () => useContext(ErrorContext);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = (message: string) => {
    setError(message);
    setIsVisible(true);
  };

  const clearError = () => {
    setIsVisible(false);
    setTimeout(() => setError(null), 300); // Clear after animation
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorModal
        message={error || ''}
        isVisible={isVisible}
        onClose={clearError}
      />
    </ErrorContext.Provider>
  );
} 