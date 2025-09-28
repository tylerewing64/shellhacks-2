import MockOrganizationService from './mockOrganizationService';

const API_BASE_URL = 'http://localhost:3001/api';

class OrganizationService {
  // Search organizations using Every.org API
  static async searchOrganizations(query, options = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: options.limit || 20,
        ...(options.causes && { causes: options.causes })
      });

      const response = await fetch(`${API_BASE_URL}/organizations/every-org/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search organizations error:', error);
      console.log('Falling back to mock data...');
      return await MockOrganizationService.searchOrganizations(query, options);
    }
  }

  // Browse organizations by cause
  static async browseOrganizations(cause, options = {}) {
    try {
      const params = new URLSearchParams({
        cause: cause,
        limit: options.limit || 20,
        page: options.page || 1
      });

      const response = await fetch(`${API_BASE_URL}/organizations/every-org/browse?${params}`);
      
      if (!response.ok) {
        throw new Error(`Browse failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Browse organizations error:', error);
      console.log('Falling back to mock data...');
      return await MockOrganizationService.browseOrganizations(cause, options);
    }
  }

  // Get available causes
  static async getCauses() {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/every-org/causes`);
      
      if (!response.ok) {
        throw new Error(`Get causes failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get causes error:', error);
      console.log('Falling back to mock data...');
      return await MockOrganizationService.getCauses();
    }
  }

  // Get organization details
  static async getOrganizationDetails(identifier) {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/every-org/${identifier}`);
      
      if (!response.ok) {
        throw new Error(`Get organization failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get organization details error:', error);
      throw error;
    }
  }

  // Sync organization to local database
  static async syncOrganization(identifier, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/every-org/${identifier}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Sync organization error:', error);
      throw error;
    }
  }
}

export default OrganizationService;
