// Dashboard service for frontend - connects to real API
const API_BASE_URL = 'http://localhost:3001/api';

class DashboardService {
  // Get impact overview data from API
  static async getImpactOverview() {
    const response = await fetch(`${API_BASE_URL}/dashboard/impact-overview`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data; // Extract data from API response
  }

  // Get recent activity data from API
  static async getRecentActivity() {
    const response = await fetch(`${API_BASE_URL}/dashboard/recent-activity`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Get charity suggestions from API
  static async getCharitySuggestions() {
    const response = await fetch(`${API_BASE_URL}/dashboard/charity-suggestions`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Get goals progress from API
  static async getGoalsProgress() {
    const response = await fetch(`${API_BASE_URL}/dashboard/goals-progress`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Get charity updates from API
  static async getCharityUpdates() {
    const response = await fetch(`${API_BASE_URL}/dashboard/charity-updates`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Get all dashboard data
  static async getAllDashboardData() {
    const [
      impactOverview,
      recentActivity,
      charitySuggestions,
      goalsProgress,
      charityUpdates
    ] = await Promise.all([
      this.getImpactOverview(),
      this.getRecentActivity(),
      this.getCharitySuggestions(),
      this.getGoalsProgress(),
      this.getCharityUpdates()
    ]);

    return {
      impactOverview,
      recentActivity,
      charitySuggestions,
      goalsProgress,
      charityUpdates
    };
  }
}

export default DashboardService;