const DashboardService = require('../services/DashboardService');
const ApiResponse = require('../views/ApiResponse');

class DashboardController {
  // Get impact overview data
  static async getImpactOverview(req, res) {
    try {
      const userId = req.user.userId;
      const data = await DashboardService.getImpactOverview(userId);
      
      return ApiResponse.success(res, { data }, 'Impact overview retrieved successfully');
    } catch (error) {
      console.error('Error getting impact overview:', error);
      return ApiResponse.error(res, 'Failed to retrieve impact overview', 500);
    }
  }

  // Get recent activity data
  static async getRecentActivity(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 10;
      const data = await DashboardService.getRecentActivity(userId, limit);
      
      return ApiResponse.success(res, { data }, 'Recent activity retrieved successfully');
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return ApiResponse.error(res, 'Failed to retrieve recent activity', 500);
    }
  }

  // Get charity suggestions
  static async getCharitySuggestions(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 5;
      const data = await DashboardService.getCharitySuggestions(userId, limit);
      
      return ApiResponse.success(res, { data }, 'Charity suggestions retrieved successfully');
    } catch (error) {
      console.error('Error getting charity suggestions:', error);
      return ApiResponse.error(res, 'Failed to retrieve charity suggestions', 500);
    }
  }

  // Get goals progress
  static async getGoalsProgress(req, res) {
    try {
      const userId = req.user.userId;
      const data = await DashboardService.getGoalsProgress(userId);
      
      return ApiResponse.success(res, { data }, 'Goals progress retrieved successfully');
    } catch (error) {
      console.error('Error getting goals progress:', error);
      return ApiResponse.error(res, 'Failed to retrieve goals progress', 500);
    }
  }

  // Get charity updates
  static async getCharityUpdates(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 5;
      const data = await DashboardService.getCharityUpdates(userId, limit);
      
      return ApiResponse.success(res, { data }, 'Charity updates retrieved successfully');
    } catch (error) {
      console.error('Error getting charity updates:', error);
      return ApiResponse.error(res, 'Failed to retrieve charity updates', 500);
    }
  }

  // Get all dashboard data at once
  static async getAllDashboardData(req, res) {
    try {
      const userId = req.user.userId;
      
      const [
        impactOverview,
        recentActivity,
        charitySuggestions,
        goalsProgress,
        charityUpdates
      ] = await Promise.all([
        DashboardService.getImpactOverview(userId),
        DashboardService.getRecentActivity(userId, 10),
        DashboardService.getCharitySuggestions(userId, 5),
        DashboardService.getGoalsProgress(userId),
        DashboardService.getCharityUpdates(userId, 5)
      ]);

      const data = {
        impactOverview,
        recentActivity,
        charitySuggestions,
        goalsProgress,
        charityUpdates
      };
      
      return ApiResponse.success(res, { data }, 'Dashboard data retrieved successfully');
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return ApiResponse.error(res, 'Failed to retrieve dashboard data', 500);
    }
  }
}

module.exports = DashboardController;
