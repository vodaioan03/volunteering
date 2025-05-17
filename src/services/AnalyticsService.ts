// services/analyticsService.ts
class AnalyticsService {
    private API_BASE = "http://localhost:8080";
  
    async getTopOrganizers(limit = 10) {
      const response = await fetch(`${this.API_BASE}/api/analytics/top-organizers?limit=${limit}`);
      return response.json();
    }
  
    async getMonthlyCounts() {
      const response = await fetch(`${this.API_BASE}/api/analytics/monthly-counts`);
      return response.json();
    }
  
    async getViewsDistribution() {
      const response = await fetch(`${this.API_BASE}/api/analytics/views-distribution`);
      return response.json();
    }
  
    async getSummaryStats() {
      const response = await fetch(`${this.API_BASE}/api/analytics/summary`);
      return response.json();
    }
  }
  
  export const analyticsService = new AnalyticsService();