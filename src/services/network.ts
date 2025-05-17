class NetworkService {
  private isOnline: boolean;
  private serverAvailable: boolean = true;

  constructor() {
    // Initialize with safe defaults for SSR
    this.isOnline = typeof window !== 'undefined' ? navigator.onLine : true;
    this.serverAvailable = this.isOnline;
    
    // Only add event listeners in the browser
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
    }
  }

  private handleOnline = () => {
    this.isOnline = true;
    this.serverAvailable = true;
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.serverAvailable = false;
  };

  public getStatus() {
    // Update status based on browser's online state
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.serverAvailable = this.isOnline;
    }

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