// lib/api/opportunityService.ts
import { Opportunity, OpportunityCreate, OpportunityUpdate } from "@/types/opportunity";
import { networkService } from "../services/network";
import { offlineQueue } from "./offlineQueue";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.150:8080/api/opportunities';
const LOCAL_STORAGE_KEY = 'offline_opportunities_data';

class OpportunityService {
  // Helper function with offline fallback
  private async makeRequest<T>(
    endpoint: string,
    method: string = 'GET',
    body?: object
  ): Promise<T> {
    const { isOnline, isServerAvailable } = networkService.getStatus();

    if (!isOnline || !isServerAvailable) {
      throw new Error('OFFLINE_MODE');
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Cache data in localStorage
  private cacheData(data: any) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }

  // Get cached data
  public getCachedData(): Opportunity[] {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  }

  // Process offline queue when back online
  public async syncOfflineOperations() {
    await offlineQueue.processQueue();
    return this.getAll(); // Refresh data after sync
  }


  public async createWithOfflineSupport(data: OpportunityCreate): Promise<Opportunity> {
    const { isOnline, isServerAvailable } = networkService.getStatus();
    
    if (isOnline && isServerAvailable) {
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
  
  // Also add this method to check network status:
  public async checkNetworkStatus() {
    const isOnline = navigator.onLine;
    let isServerAvailable = false;
    
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'HEAD',
          cache: 'no-store'
        });
        isServerAvailable = response.ok;
      } catch {
        isServerAvailable = false;
      }
    }
    
    return {
      isOnline,
      isServerAvailable
    };
  }

  // Service methods with offline support
  public async getAll(): Promise<Opportunity[]> {
    try {
      const data = await this.makeRequest<Opportunity[]>('');
      this.cacheData(data);
      return data;
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        return this.getCachedData();
      }
      throw error;
    }
  }



  public async getAscending(): Promise<Opportunity[]> {
    try {
      const data = await this.makeRequest<Opportunity[]>('/get-ascending-order');
      this.cacheData(data);
      return data;
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        return this.getCachedData().sort((a, b) => 
          new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        );
      }
      throw error;
    }
  }

  public async getDescending(): Promise<Opportunity[]> {
    try {
      const data = await this.makeRequest<Opportunity[]>('/get-descending-order');
      this.cacheData(data);
      return data;
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        return this.getCachedData().sort((a, b) => 
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        );
      }
      throw error;
    }
  }

  public async getByTitle(title: string): Promise<Opportunity> {
    try {
      return await this.makeRequest<Opportunity>(`/${encodeURIComponent(title)}`);
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        const found = this.getCachedData().find(o => o.title === title);
        if (!found) throw new Error('Opportunity not found in cache');
        return found;
      }
      throw error;
    }
  }

  public async create(data: OpportunityCreate): Promise<Opportunity> {
    try {
      const result = await this.makeRequest<Opportunity>('', 'POST', {
        ...data,
        views: "0"
      });
      
      // Update cache with new item
      const cached = this.getCachedData();
      this.cacheData([...cached, result]);
      
      return result;
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        // Add to offline queue
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
      throw error;
    }
  }

  public async getById(id: string): Promise<Opportunity> {
    try {
      return await this.makeRequest<Opportunity>(`/getOpportunityById/${id}`);
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        const found = this.getCachedData().find(o => o.id === id);
        if (!found) throw new Error('Opportunity not found in cache');
        return found;
      }
      throw error;
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
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        // Add to offline queue
        offlineQueue.addToQueue({
          type: 'UPDATE',
          data: { id, ...update }
        });

        // Update local cache for immediate UI update
        const cached = this.getCachedData();
        this.cacheData(cached.map(item => 
          item.id === id ? { ...item, ...update, isOffline: true } : item
        ));
        
        return { id, ...update } as Opportunity;
      }
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.makeRequest<void>(`/deleteOpportunity/${id}`, 'DELETE');
      
      // Update cache
      const cached = this.getCachedData();
      this.cacheData(cached.filter(item => item.id !== id));
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        // Add to offline queue
        offlineQueue.addToQueue({
          type: 'DELETE',
          data: { id }
        });

        // Update local cache for immediate UI update
        const cached = this.getCachedData();
        this.cacheData(cached.filter(item => item.id !== id));
        
        return;
      }
      throw error;
    }
  }

  // Attachment methods with simplified offline handling
  public async getAttachments(opportunityId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/${opportunityId}/attachments`);
      if (!response.ok) throw new Error('OFFLINE_MODE');
      return await response.json();
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        return []; // Return empty array for attachments in offline mode
      }
      throw error;
    }
  }

  public async uploadAttachment(opportunityId: string, formData: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${opportunityId}/attachments`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('OFFLINE_MODE');
      return await response.json();
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        throw new Error('Attachments cannot be uploaded in offline mode');
      }
      throw error;
    }
  }

  public async downloadAttachment(opportunityId: string, fileId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/${opportunityId}/attachments/${fileId}`);
      if (!response.ok) throw new Error('OFFLINE_MODE');
      
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileName = contentDisposition?.split('filename=')[1].replace(/"/g, '') || 'file';
      
      const blob = await response.blob();
      return { data: blob, fileName };
    } catch (error) {
      if (error.message === 'OFFLINE_MODE') {
        throw new Error('Attachments cannot be downloaded in offline mode');
      }
      throw error;
    }
  }
}

export const opportunityService = new OpportunityService();