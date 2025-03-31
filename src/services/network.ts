class NetworkService {
  private isOnline: boolean;
  private serverAvailable: boolean = true;

  constructor() {
      // Initialize with safe defaults for SSR
      this.isOnline = typeof window !== 'undefined' ? navigator.onLine : true;
      
      // Only add event listeners in the browser
      if (typeof window !== 'undefined') {
          window.addEventListener('online', this.handleOnline);
          window.addEventListener('offline', this.handleOffline);
      }
  }

  private handleOnline = () => {
      this.isOnline = true;
      this.checkServerStatus();
  };

  private handleOffline = () => {
      this.isOnline = false;
      this.serverAvailable = false;
  };

  public async checkServerStatus(): Promise<boolean> {
      // Skip server check if we're offline
      if (!this.isOnline) {
          this.serverAvailable = false;
          return false;
      }

      try {
          const response = await fetch('/api/health', {
              method: 'HEAD',
              cache: 'no-store'
          });
          this.serverAvailable = response.ok;
          return response.ok;
      } catch {
          this.serverAvailable = false;
          return false;
      }
  }

  public getStatus() {
      return {
          isOnline: this.isOnline,
          isServerAvailable: this.serverAvailable
      };
  }

  // Cleanup method to call when unmounting
  public destroy() {
      if (typeof window !== 'undefined') {
          window.removeEventListener('online', this.handleOnline);
          window.removeEventListener('offline', this.handleOffline);
      }
  }
}

export const networkService = new NetworkService();