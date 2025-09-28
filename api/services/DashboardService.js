const db = require('./DatabaseService');

class DashboardService {
  // Get user's impact overview data
  static async getImpactOverview(userId) {
    try {
      // Get user balance and donation stats
      const [balanceResult] = await db.execute(
        'SELECT current_balance, total_accumulated, total_donated FROM user_balances WHERE user_id = ?',
        [userId]
      );

      // Get monthly donation stats
      const [monthlyStats] = await db.execute(`
        SELECT 
          DATE_FORMAT(completed_at, '%Y-%m') as month,
          COUNT(*) as donation_count,
          SUM(amount) as total_donated
        FROM donations 
        WHERE user_id = ? AND status = 'completed' AND completed_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(completed_at, '%Y-%m')
        ORDER BY month DESC
      `, [userId]);

      // Get top organizations by donation amount
      const [topOrgs] = await db.execute(`
        SELECT 
          o.name,
          o.logo_url,
          o.category,
          SUM(d.amount) as total_donated,
          COUNT(d.id) as donation_count
        FROM donations d
        JOIN organizations o ON d.organization_id = o.id
        WHERE d.user_id = ? AND d.status = 'completed'
        GROUP BY o.id, o.name, o.logo_url, o.category
        ORDER BY total_donated DESC
        LIMIT 5
      `, [userId]);

      // Get impact metrics for user's organizations
      const [impactMetrics] = await db.execute(`
        SELECT 
          o.name as organization_name,
          im.metric_name,
          im.metric_value,
          im.unit,
          im.description
        FROM impact_metrics im
        JOIN organizations o ON im.organization_id = o.id
        WHERE o.id IN (
          SELECT DISTINCT organization_id 
          FROM donations 
          WHERE user_id = ? AND status = 'completed'
        )
        ORDER BY o.name, im.metric_name
      `, [userId]);

      return {
        balance: balanceResult[0] || { current_balance: 0, total_accumulated: 0, total_donated: 0 },
        monthlyStats: monthlyStats,
        topOrganizations: topOrgs,
        impactMetrics: impactMetrics
      };
    } catch (error) {
      console.error('Error getting impact overview:', error);
      throw error;
    }
  }

  // Get recent activity data
  static async getRecentActivity(userId, limit = 10) {
    try {
      // Get recent donations
      const [recentDonations] = await db.execute(`
        SELECT 
          d.id,
          d.amount,
          d.status,
          d.created_at,
          d.completed_at,
          o.name as organization_name,
          o.logo_url,
          o.category
        FROM donations d
        JOIN organizations o ON d.organization_id = o.id
        WHERE d.user_id = ?
        ORDER BY d.created_at DESC
        LIMIT 10
      `, [userId]);

      // Get recent transactions with roundup
      const [recentTransactions] = await db.execute(`
        SELECT 
          id,
          amount,
          roundup_amount,
          merchant_name,
          category,
          transaction_date,
          processed_at
        FROM transactions
        WHERE user_id = ? AND roundup_amount > 0
        ORDER BY processed_at DESC
        LIMIT 10
      `, [userId]);

      return {
        donations: recentDonations,
        transactions: recentTransactions
      };
    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw error;
    }
  }

  // Get charity suggestions based on user preferences
  static async getCharitySuggestions(userId, limit = 5) {
    try {
      // Get organizations user hasn't donated to yet
      const [suggestions] = await db.execute(`
        SELECT 
          o.id,
          o.name,
          o.description,
          o.logo_url,
          o.category,
          o.verified,
          COALESCE(SUM(d.amount), 0) as total_received
        FROM organizations o
        LEFT JOIN donations d ON o.id = d.organization_id AND d.user_id = ?
        WHERE o.id NOT IN (
          SELECT DISTINCT organization_id 
          FROM donations 
          WHERE user_id = ?
        )
        GROUP BY o.id, o.name, o.description, o.logo_url, o.category, o.verified
        ORDER BY o.verified DESC, total_received DESC
        LIMIT ?
      `, [userId, userId, limit]);

      return suggestions;
    } catch (error) {
      console.error('Error getting charity suggestions:', error);
      throw error;
    }
  }

  // Get goals progress data
  static async getGoalsProgress(userId) {
    try {
      // Get user settings for goals
      const [settings] = await db.execute(
        'SELECT auto_donate_threshold, max_daily_roundup FROM user_settings WHERE user_id = ?',
        [userId]
      );

      // Get current month progress
      const [monthlyProgress] = await db.execute(`
        SELECT 
          SUM(amount) as monthly_donated,
          COUNT(*) as monthly_donations
        FROM donations 
        WHERE user_id = ? AND status = 'completed' 
        AND MONTH(completed_at) = MONTH(NOW()) 
        AND YEAR(completed_at) = YEAR(NOW())
      `, [userId]);

      // Get daily roundup for current month
      const [dailyRoundup] = await db.execute(`
        SELECT 
          DATE(transaction_date) as date,
          SUM(roundup_amount) as daily_roundup
        FROM transactions 
        WHERE user_id = ? 
        AND MONTH(transaction_date) = MONTH(NOW()) 
        AND YEAR(transaction_date) = YEAR(NOW())
        GROUP BY DATE(transaction_date)
        ORDER BY date DESC
      `, [userId]);

      return {
        settings: settings[0] || { auto_donate_threshold: 5.00, max_daily_roundup: 10.00 },
        monthlyProgress: monthlyProgress[0] || { monthly_donated: 0, monthly_donations: 0 },
        dailyRoundup: dailyRoundup
      };
    } catch (error) {
      console.error('Error getting goals progress:', error);
      throw error;
    }
  }

  // Get charity updates (news/updates from organizations)
  static async getCharityUpdates(userId, limit = 5) {
    try {
      // Get updates from organizations user has donated to
      const [updates] = await db.execute(`
        SELECT 
          o.name as organization_name,
          o.logo_url,
          o.category,
          'Thank you for your recent donation!' as update_title,
          CONCAT('Your recent donation of $', FORMAT(SUM(d.amount), 2), ' is helping us make a difference in the community.') as update_content,
          MAX(d.completed_at) as update_date
        FROM donations d
        JOIN organizations o ON d.organization_id = o.id
        WHERE d.user_id = ? AND d.status = 'completed'
        GROUP BY o.id, o.name, o.logo_url, o.category
        ORDER BY update_date DESC
        LIMIT ?
      `, [userId, limit]);

      return updates;
    } catch (error) {
      console.error('Error getting charity updates:', error);
      throw error;
    }
  }
}

module.exports = DashboardService;
