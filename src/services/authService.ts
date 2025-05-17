// src/services/auth.service.ts
export const authService = {
    getCurrentUser: () => {
      // Check if running on client side
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
      }
      return null;
    },
    
    getUserId: () => {
      if (typeof window !== 'undefined') {
        const user = authService.getCurrentUser();
        return user?.id || null;
      }
      return null;
    },
    
    // Add other auth-related methods as needed
  };