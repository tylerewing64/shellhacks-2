const API_BASE_URL = 'http://localhost:3001/api';

class UserOrganizationService {
  // Get authentication token (you might want to get this from a context or store)
  static getAuthToken() {
    // For now, using a hardcoded token. In a real app, this would come from auth context
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8';
  }

  // Like an organization
  static async likeOrganization(organization) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-organizations/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(organization)
      });

      if (!response.ok) {
        throw new Error(`Like failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Like organization error:', error);
      throw error;
    }
  }

  // Unlike an organization
  static async unlikeOrganization(ein) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-organizations/unlike/${ein}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Unlike failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Unlike organization error:', error);
      throw error;
    }
  }

  // Get user's liked organizations
  static async getLikedOrganizations() {
    try {
      const response = await fetch(`${API_BASE_URL}/user-organizations`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Get liked organizations failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get liked organizations error:', error);
      throw error;
    }
  }

  // Check if organization is liked
  static async isOrganizationLiked(ein) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-organizations/check/${ein}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Check liked status failed: ${response.status}`);
      }

      const data = await response.json();
      return data.isLiked;
    } catch (error) {
      console.error('Check organization liked error:', error);
      return false; // Default to not liked if check fails
    }
  }
}

export default UserOrganizationService;
