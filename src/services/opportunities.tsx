// lib/api/opportunityService.ts
import { Opportunity, OpportunityCreate, OpportunityUpdate } from "@/types/opportunity";
import { networkService } from "../services/network";
import { offlineQueue } from "./offlineQueue";
import { authService } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const LOCAL_STORAGE_KEY = 'offline_opportunities_data';

// Helper function to check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Define custom error types
interface ApplicationError {
  id: string;
  opportunityId: string;
  applicantId: string;
  applicationDate: string;
  status: string;
  isOffline?: boolean;
}

type Application = ApplicationError;

class OpportunityService {
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return 'Please log in to access this feature';
      }
      if (error.message === 'OFFLINE_MODE') {
        return 'You are currently offline. Some features may be limited.';
      }
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // Helper function with proper async/await handling
  private async makeRequest<T>(endpoint: string, method: string = 'GET', body?: object): Promise<T> {
    const { isOnline } = networkService.getStatus();
    
    if (!isOnline) {
      throw new Error('OFFLINE_MODE');
    }

    try {
      const token = authService.getToken();
      const options: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'same-origin',
        mode: 'cors'
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}/api/opportunities${endpoint}`, options);
      
      if (response.status === 429) {
        // Handle rate limiting - wait and retry
        const retryAfter = parseInt(response.headers.get('Retry-After') || "5");
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return this.makeRequest(endpoint, method, body);
      }

      if (!response.ok) {
        if (response.status === 404 || response.status === 503) {
          throw new Error('OFFLINE_MODE');
        }
        if (response.status === 403 || response.status === 401) {
          throw new Error('UNAUTHORIZED');
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      const text = await response.text();
      return text ? JSON.parse(text) as T : undefined as unknown as T;
    } catch (error: unknown) {
      console.error('Request error:', error);
      if (error instanceof Error) {
        if (error.message === 'UNAUTHORIZED') {
          throw error; // Re-throw authentication errors
        }
        if (error.message === 'Failed to fetch' || 
            error.message.includes('NetworkError') ||
            error.message.includes('CORS')) {
          throw new Error('OFFLINE_MODE');
        }
      }
      throw error;
    }
  }

  // Get paginated data with proper async handling
  public async getPaginated(page: number = 1, pageSize: number = 10): Promise<{ 
    data: Opportunity[], 
    total: number 
  }> {
    try {
      const response = await this.makeRequest<{ data: Opportunity[], total: number }>(
        `/paginated?page=${page}&pageSize=${pageSize}`
      );
      
      // Make sure we're working with the data array
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected data array');
      }
      
      this.cachePage(page, response.data);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return {
          data: [],
          total: 0
        };
      }
      console.error('Failed to get paginated data:', error);
      const allCached = this.getCachedData();
      return {
        data: allCached.slice((page - 1) * pageSize, page * pageSize),
        total: allCached.length
      };
    }
  }
  

  // Cache individual pages
  private cachePage(page: number, data: Opportunity[]) {
    if (!isBrowser()) return;
    
    const cacheKey = `${LOCAL_STORAGE_KEY}_page_${page}`;
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      const cachedPages = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_KEY}_pages`) || '[]');
      if (!cachedPages.includes(page)) {
        localStorage.setItem(
          `${LOCAL_STORAGE_KEY}_pages`, 
          JSON.stringify([...cachedPages, page])
        );
      }
    } catch (error: unknown) {
      console.error('Failed to cache page:', error);
    }
  }

  // Get cached data with proper error handling
  public getCachedData(): Opportunity[] {
    if (!isBrowser()) return [];
    
    try {
      const cachedPagesString = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pages`);
      const cachedPages: number[] = cachedPagesString ? JSON.parse(cachedPagesString) : [];
      
      let allData: Opportunity[] = [];
      
      cachedPages.forEach((page: number) => {
        const pageData = localStorage.getItem(`${LOCAL_STORAGE_KEY}_page_${page}`);
        if (pageData) {
          try {
            const parsedData: Opportunity[] = JSON.parse(pageData);
            allData = [...allData, ...parsedData];
          } catch (e) {
            console.error(`Failed to parse cached page ${page}`, e);
          }
        }
      });
      
      return allData;
    } catch (error: unknown) {
      console.error('Failed to get cached data:', error);
      return [];
    }
  }

  // Get featured opportunities with proper async handling
  public async getFeaturedOpportunities(): Promise<Opportunity[]> {
    try {
      const { isOnline } = networkService.getStatus();
      
      if (isOnline) {
        const featured = await this.makeRequest<Opportunity[]>('/featured');
        // Cache featured opportunities separately for quick access
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_featured`, JSON.stringify(featured));
        return featured;
      } else {
        // Try to get from cache
        const cachedFeatured = localStorage.getItem(`${LOCAL_STORAGE_KEY}_featured`);
        if (cachedFeatured) {
          return JSON.parse(cachedFeatured);
        }
        // Fallback to first 2 from full cache
        return this.getCachedData().slice(0, 2);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return [];
      }
      console.error('Failed to get featured opportunities:', error);
      // Fallback strategies
      const cachedFeatured = localStorage.getItem(`${LOCAL_STORAGE_KEY}_featured`);
      if (cachedFeatured) {
        return JSON.parse(cachedFeatured);
      }
      return this.getCachedData().slice(0, 2);
    }
  }

  // Process offline queue with proper async handling
  public async syncOfflineOperations(): Promise<Opportunity[]> {
    try {
      await offlineQueue.processQueue();
      // Clear cached data and refresh
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return this.getPaginated(1, 10).then(result => result.data);
    } catch (error) {
      console.error('Failed to sync offline operations:', error);
      throw error;
    }
  }

  // Cache data in localStorage
  private cacheData(data: any) {
    if (!isBrowser()) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }


  public async createWithOfflineSupport(data: OpportunityCreate): Promise<Opportunity> {
    const { isOnline } = networkService.getStatus();
    
    if (isOnline) {
      try {
        return await this.create(data);
      } catch (error) {
        // If online creation fails, fall back to offline mode
        return this.handleOfflineCreate(data);
      }
    } else {
      return this.handleOfflineCreate(data);
    }
  }
  
  private handleOfflineCreate(data: OpportunityCreate): Opportunity {
    const tempId = `offline-${Date.now()}`;
    const offlineOpportunity = {
      ...data,
      id: tempId,
      views: "0",
      isOffline: true
    };
    
    offlineQueue.addToQueue({
      type: 'CREATE',
      data: offlineOpportunity
    });
  
    // Update local cache for immediate UI update
    const cached = this.getCachedData();
    this.cacheData([...cached, offlineOpportunity]);
    
    return offlineOpportunity;
  }
  
  public getPendingOperationsCount(): number {
    return offlineQueue.getQueue().length;
  }
  

public getCachedPage(page: number): Opportunity[] {
  const cacheKey = `opportunities_page_${page}`;
  const cached = localStorage.getItem(cacheKey);
  return cached ? JSON.parse(cached) : [];
}

  // Also add this method to check network status:
  public async checkNetworkStatus() {
    try {
      const isOnline = navigator.onLine;
      let isServerAvailable = false;
      
      if (isOnline) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        
        const response = await fetch(`${API_BASE_URL}/api/opportunities/health`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        isServerAvailable = response.ok;
      }
      
      return { isOnline, isServerAvailable };
    } catch {
      return { isOnline: false, isServerAvailable: false };
    }
  }

  // Service methods with offline support
  public async getAll(): Promise<Opportunity[]> {
    try {
      const data = await this.makeRequest<Opportunity[]>('');
      this.cacheData(data);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        return this.getCachedData();
      }
      throw error;
    }
  }



  public async getAscending(): Promise<Opportunity[]> {
    try {
      const response = await this.makeRequest<{ data: Opportunity[], total: number }>(
        '/get-ascending-order'
      );
      this.cacheData(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        const cached = this.getCachedData();
        return cached.sort((a, b) => 
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
      }
      throw error instanceof Error ? error : new Error('Failed to get ascending opportunities');
    }
  }
  
  public async getDescending(): Promise<Opportunity[]> {
    try {
      const response = await this.makeRequest<{ data: Opportunity[], total: number }>(
        '/get-descending-order'
      );
      this.cacheData(response.data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        const cached = this.getCachedData();
        return cached.sort((a, b) => 
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        );
      }
      throw error instanceof Error ? error : new Error('Failed to get descending opportunities');
    }
  }

  public async getByTitle(title: string): Promise<Opportunity> {
    try {
      return await this.makeRequest<Opportunity>(`/${encodeURIComponent(title)}`);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        const found = this.getCachedData().find(o => o.title === title);
        if (!found) throw new Error('Opportunity not found in cache');
        return found;
      }
      throw error instanceof Error ? error : new Error('Failed to get opportunity by title');
    }
  }

  public async create(data: OpportunityCreate): Promise<Opportunity> {
    try {
      const result = await this.makeRequest<Opportunity>('', 'POST', {
        ...data,
        views: "0"
      });
      
      const cached = this.getCachedData();
      this.cacheData([...cached, result]);
      
      return result;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        const tempId = `offline-${Date.now()}`;
        const offlineOpportunity = {
          ...data,
          id: tempId,
          views: "0",
          isOffline: true
        };
        
        offlineQueue.addToQueue({
          type: 'CREATE',
          data: offlineOpportunity
        });

        const cached = this.getCachedData();
        this.cacheData([...cached, offlineOpportunity]);
        
        return offlineOpportunity;
      }
      throw error instanceof Error ? error : new Error('Failed to create opportunity');
    }
  }

  public async getById(id: string): Promise<Opportunity> {
    try {
      return await this.makeRequest<Opportunity>(`/getOpportunityById/${id}`);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        const found = this.getCachedData().find(o => o.id === id);
        if (!found) throw new Error('Opportunity not found in cache');
        return found;
      }
      throw error instanceof Error ? error : new Error('Failed to get opportunity by ID');
    }
  }

  public async update(id: string, update: OpportunityUpdate): Promise<Opportunity> {
    try {
      const result = await this.makeRequest<Opportunity>(`/updateOpportunity/${id}`, 'PUT', update);
      
      // Update cache
      const cached = this.getCachedData();
      this.cacheData(cached.map(item => 
        item.id === id ? { ...item, ...update } : item
      ));
      
      return result;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        // Add to offline queue
        offlineQueue.addToQueue({
          type: 'UPDATE',
          data: { id, ...update }
        });

        // Update local cache for immediate UI update
        const cached = this.getCachedData();
        const updatedItem = {
          ...cached.find(item => item.id === id),
          ...update,
          isOffline: true,
          views: "0" // Ensure views is a string
        } as Opportunity;
        
        this.cacheData(cached.map(item => 
          item.id === id ? updatedItem : item
        ));
        
        return updatedItem;

      }
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      if (!this.isValidUUID(id)) {
        throw new Error('Invalid opportunity ID format');
      }
  
      const cached = this.getCachedData();
      this.cacheData(cached.filter(item => item.id !== id));
  
      await this.makeRequest<void>(`/deleteOpportunity/${id}`, 'DELETE');
  
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        offlineQueue.addToQueue({
          type: 'DELETE',
          data: { id }
        });
      } else {
        const opportunity = await this.getById(id);
        if (opportunity) {
          this.cacheData([...this.getCachedData(), opportunity]);
        }
        throw error instanceof Error ? error : new Error('Failed to delete opportunity');
      }
    }
  }
  
  private isValidUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  // Attachment methods with simplified offline handling
  public async getAttachments(opportunityId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/opportunities/${opportunityId}/attachments`);
      if (!response.ok) throw new Error('OFFLINE_MODE');
      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        return [];
      }
      throw error instanceof Error ? error : new Error('Failed to get attachments');
    }
  }

  public async uploadAttachment(opportunityId: string, formData: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/opportunities/${opportunityId}/attachments`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('OFFLINE_MODE');
      return await response.json();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        throw new Error('Attachments cannot be uploaded in offline mode');
      }
      throw error instanceof Error ? error : new Error('Failed to upload attachment');
    }
  }

  public async downloadAttachment(opportunityId: string, fileId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/opportunities/${opportunityId}/attachments/${fileId}`);
      if (!response.ok) throw new Error('OFFLINE_MODE');
      
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileName = contentDisposition?.split('filename=')[1].replace(/"/g, '') || 'file';
      
      const blob = await response.blob();
      return { data: blob, fileName };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'OFFLINE_MODE') {
        throw new Error('Attachments cannot be downloaded in offline mode');
      }
      throw error instanceof Error ? error : new Error('Failed to download attachment');
    }
  }


//Apply button

// Inside the OpportunityService class
// Enhanced application methods
public async checkCanApply(opportunityId: string, userId: string): Promise<{ canApply: boolean, reason?: string }> {
  try {
    const { isOnline } = networkService.getStatus();
    
    if (!isOnline) {
      // Check local cache for existing application
      const cachedApplications = this.getCachedApplications();
      const hasApplied = cachedApplications.some(app => 
        app.opportunityId === opportunityId && app.applicantId === userId
      );
      
      return {
        canApply: !hasApplied,
        reason: hasApplied ? 'You have already applied (offline)' : undefined
      };
    }

    const response = await this.makeRequest<{ canApply: boolean, reason?: string }>(
      `api/apply/can-apply/${opportunityId}`,
      'POST',
      { userId }
    );
    return response;
  } catch (error: unknown) {
    console.error('Error checking application status:', error);
    return {
      canApply: false,
      reason: 'Error checking application status'
    };
  }
}

public async applyForOpportunity(opportunityId: string, userId: string): Promise<Application> {
  const { isOnline } = networkService.getStatus();
  
  const applicationData = {
    opportunityId,
    applicantId: userId,
    applicationDate: new Date().toISOString(),
    status: "PENDING"
  };

  if (isOnline) {
    try {
      const result = await this.makeRequest<Application>(
        `/apply/${opportunityId}`,
        'POST',
        { userId }
      );
      
      this.cacheApplication(result);
      return result;
    } catch (error: unknown) {
      return this.handleOfflineApply(opportunityId, userId);
    }
  } else {
    return this.handleOfflineApply(opportunityId, userId);
  }
}

private cacheApplication(application: Application) {
  if (!isBrowser()) return;
  const cached = this.getCachedApplications();
  localStorage.setItem('opportunity_applications', JSON.stringify([...cached, application]));
}

private getCachedApplications(): Application[] {
  if (!isBrowser()) return [];
  const cached = localStorage.getItem('opportunity_applications');
  return cached ? JSON.parse(cached) : [];
}

private handleOfflineApply(opportunityId: string, userId: string): Application {
  const tempId = `offline-apply-${Date.now()}`;
  const offlineApplication = {
    id: tempId,
    opportunityId,
    applicantId: userId,
    applicationDate: new Date().toISOString(),
    status: "PENDING",
    isOffline: true
  };
  
  offlineQueue.addToQueue({
    type: 'CREATE',
    data: offlineApplication
  });

  return offlineApplication;
}

// Add these methods to track application status
public async getApplicationStatus(opportunityId: string, userId: string): Promise<{ status: string, isOffline?: boolean }> {
  try {
    const response = await this.makeRequest<{ status: string }>(
      `/application-status/${opportunityId}`,
      'POST',
      { userId }
    );
    return response;
  } catch (error: unknown) {
    if (error instanceof Error && 
        (error.message === 'NETWORK_OFFLINE' || error.message === 'SERVER_UNAVAILABLE')) {
      // Check offline applications
      const cachedApplications = this.getCachedApplications();
      const application = cachedApplications.find(app => 
        app.opportunityId === opportunityId && app.applicantId === userId
      );
      
      return {
        status: application?.status || 'NOT_APPLIED',
        isOffline: !!application?.isOffline
      };
    }
    throw error instanceof Error ? error : new Error('Failed to get application status');
  }
}

public async withdrawApplication(opportunityId: string, userId: string): Promise<void> {
  const { isOnline } = networkService.getStatus();
  
  if (isOnline) {
    try {
      await this.makeRequest(
        `/withdraw-application/${opportunityId}`,
        'DELETE',
        { userId }
      );
      
      const cached = this.getCachedApplications();
      localStorage.setItem('opportunity_applications', JSON.stringify(
        cached.filter(app => !(app.opportunityId === opportunityId && app.applicantId === userId))
      ));
    } catch (error: unknown) {
      throw error instanceof Error ? error : new Error('Failed to withdraw application');
    }
  } else {
    // Add to offline queue
    offlineQueue.addToQueue({
      type: 'DELETE',
      data: { opportunityId, userId }
    });
    
    // Update local cache immediately
    const cached = this.getCachedApplications();
    localStorage.setItem('opportunity_applications', JSON.stringify(
      cached.filter(app => !(app.opportunityId === opportunityId && app.applicantId === userId))
    ));
  }
}


}
export const opportunityService = new OpportunityService();
export { OpportunityService }; // Export the class for type usage