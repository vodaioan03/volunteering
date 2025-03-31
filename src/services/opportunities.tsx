// lib/api/opportunityService.ts
import { Opportunity, OpportunityCreate, OpportunityUpdate } from "@/types/opportunity";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.150:8080/api/opportunities';



// Helper function with proper async declaration
const makeRequest = async function<T>(
  endpoint: string,
  method: string = 'GET',
  body?: object
): Promise<T> {
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
};

// Service methods using traditional function syntax
export const opportunityService = {
  getAll: async function(): Promise<Opportunity[]> {
    return makeRequest<Opportunity[]>('');
  },

  getAscending: async function(): Promise<Opportunity[]> {
    return makeRequest<Opportunity[]>('/get-ascending-order');
  },

  getDescending: async function(): Promise<Opportunity[]> {
    return makeRequest<Opportunity[]>('/get-descending-order');
  },
  getByTitle: async function(title: string): Promise<Opportunity> {
    return makeRequest<Opportunity>(`/${encodeURIComponent(title)}`);
  },

  create: async function(data: OpportunityCreate): Promise<Opportunity> {
    return makeRequest<Opportunity>('', 'POST', {
      ...data,
      views: "0"
    });
  },
  getById: async function(id: string): Promise<Opportunity> {
    return makeRequest<Opportunity>(`/getOpportunityById/${id}`);
  },

  update: async function(id: string, update: OpportunityUpdate): Promise<Opportunity> {
    return makeRequest<Opportunity>(`/updateOpportunity/${id}`, 'PUT', update);
  },

  delete: async function(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/deleteOpportunity/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }
  },
  getAttachments: async (opportunityId: string) => {
    const response = await fetch(`${API_BASE_URL}/${opportunityId}/attachments`);
    if (!response.ok) throw new Error('Failed to fetch attachments');
    return await response.json();
  },

  uploadAttachment: async (opportunityId: string, formData: FormData, config?: any) => {
    const response = await fetch(`${API_BASE_URL}/${opportunityId}/attachments`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header when using FormData, the browser will set it automatically
    });
    if (!response.ok) throw new Error('Failed to upload attachment');
    return await response.json();
  },

  downloadAttachment: async (opportunityId: string, fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/${opportunityId}/attachments/${fileId}`);
    if (!response.ok) throw new Error('Failed to download attachment');
    
    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const fileName = contentDisposition?.split('filename=')[1].replace(/"/g, '') || 'file';
    
    const blob = await response.blob();
    return { data: blob, fileName };
  }
};

