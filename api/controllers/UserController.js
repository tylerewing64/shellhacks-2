const AuthService = require('../services/AuthService');
const ApiResponse = require('../views/ApiResponse');

class UserController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      
      const user = await AuthService.findUserById(userId);
      
      if (!user) {
        return ApiResponse.error(res, 'User not found', 404);
      }
      
      return ApiResponse.success(res, {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          isActive: user.is_active,
          currentBalance: user.current_balance,
          totalAccumulated: user.total_accumulated,
          totalDonated: user.total_donated,
          autoDonateThreshold: user.auto_donate_threshold,
          roundUpEnabled: user.round_up_enabled
        }
      });
      
    } catch (error) {
      console.error('Get profile error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }
}

module.exports = UserController;
