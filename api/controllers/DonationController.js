const db = require('../services/DatabaseService');
const ApiResponse = require('../views/ApiResponse');

class DonationController {
  // Create a fake donation
  static async createDonation(req, res) {
    try {
      const userId = req.user.userId;
      const { organizationId, amount, organizationName } = req.body;

      console.log('Create donation request:', { userId, organizationId, amount, organizationName });

      // Validate required fields
      if (!organizationId || !amount) {
        return ApiResponse.error(res, 'Organization ID and amount are required', 400);
      }

      // Validate amount
      const donationAmount = parseFloat(amount);
      if (isNaN(donationAmount) || donationAmount <= 0) {
        return ApiResponse.error(res, 'Amount must be a positive number', 400);
      }

      // Check if organization exists in user_organizations table
      const [orgCheck] = await db.execute(
        'SELECT id, organization_name, organization_ein FROM user_organizations WHERE user_id = ? AND organization_ein = ?',
        [userId, organizationId]
      );

      console.log('Organization check result:', orgCheck);

      if (orgCheck.length === 0) {
        return ApiResponse.error(res, 'Organization not found in your favorites', 404);
      }

      // Find or create organization in organizations table
      let organizationDbId;
      const [existingOrg] = await db.execute(
        'SELECT id FROM organizations WHERE ein = ?',
        [organizationId]
      );

      if (existingOrg.length > 0) {
        organizationDbId = existingOrg[0].id;
      } else {
        // Create organization in organizations table
        const [newOrg] = await db.execute(
          'INSERT INTO organizations (name, description, ein, verified, created_at) VALUES (?, ?, ?, 1, NOW())',
          [orgCheck[0].organization_name, 'Organization from user favorites', organizationId]
        );
        organizationDbId = newOrg.insertId;
      }

      // Create donation record
      const insertQuery = `
        INSERT INTO donations (user_id, organization_id, amount, status, created_at)
        VALUES (?, ?, ?, 'completed', NOW())
      `;

      const [result] = await db.execute(insertQuery, [
        userId,
        organizationDbId, // Use the organizations table ID
        donationAmount
      ]);

      // Update completed_at timestamp
      await db.execute(
        'UPDATE donations SET completed_at = NOW() WHERE id = ?',
        [result.insertId]
      );

      return ApiResponse.success(res, {
        message: 'Donation created successfully',
        donation: {
          id: result.insertId,
          amount: donationAmount,
          organizationId: orgCheck[0].id,
          organizationEin: orgCheck[0].organization_ein,
          organizationName: orgCheck[0].organization_name,
          status: 'completed',
          createdAt: new Date().toISOString()
        }
      }, 201);

    } catch (error) {
      console.error('Create donation error:', error);
      return ApiResponse.error(res, 'Failed to create donation', 500);
    }
  }

  // Get user's donations
  static async getUserDonations(req, res) {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      const [donations] = await db.execute(`
        SELECT 
          d.id,
          d.amount,
          d.status,
          d.created_at,
          d.completed_at,
          uo.organization_name,
          uo.organization_ein,
          uo.organization_logo_url as logo_url,
          uo.organization_website_url as website_url
        FROM donations d
        LEFT JOIN user_organizations uo ON d.organization_id = uo.id
        WHERE d.user_id = ?
        ORDER BY d.created_at DESC
        LIMIT 20 OFFSET 0
      `, [userId]);

      // Get total count
      const [countResult] = await db.execute(
        'SELECT COUNT(*) as total FROM donations WHERE user_id = ?',
        [userId]
      );

      return ApiResponse.success(res, {
        donations,
        total: countResult[0].total,
        limit: limit,
        offset: offset
      });

    } catch (error) {
      console.error('Get user donations error:', error);
      return ApiResponse.error(res, 'Failed to get donations', 500);
    }
  }

  // Get donation statistics
  static async getDonationStats(req, res) {
    try {
      const userId = req.user.userId;

      const [stats] = await db.execute(`
        SELECT 
          COUNT(*) as total_donations,
          COALESCE(SUM(amount), 0) as total_amount,
          COALESCE(AVG(amount), 0) as average_amount,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_donations,
          COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as completed_amount
        FROM donations 
        WHERE user_id = ?
      `, [parseInt(userId)]);

      // Get monthly breakdown
      const [monthlyStats] = await db.execute(`
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as month,
          COUNT(*) as donation_count,
          COALESCE(SUM(amount), 0) as total_amount
        FROM donations 
        WHERE user_id = ? AND status = 'completed'
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
        LIMIT 12
      `, [parseInt(userId)]);

      // Get top organizations
      const [topOrgs] = await db.execute(`
        SELECT 
          uo.organization_name,
          uo.organization_ein,
          uo.organization_logo_url as logo_url,
          COUNT(d.id) as donation_count,
          COALESCE(SUM(d.amount), 0) as total_donated
        FROM donations d
        INNER JOIN user_organizations uo ON d.organization_id = uo.id
        WHERE d.user_id = ? AND d.status = 'completed'
        GROUP BY uo.id, uo.organization_name, uo.organization_ein, uo.organization_logo_url
        ORDER BY total_donated DESC
        LIMIT 5
      `, [parseInt(userId)]);

      return ApiResponse.success(res, {
        stats: stats[0],
        monthlyStats,
        topOrganizations: topOrgs
      });

    } catch (error) {
      console.error('Get donation stats error:', error);
      return ApiResponse.error(res, 'Failed to get donation statistics', 500);
    }
  }

  // Get donation by ID
  static async getDonationById(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const [donations] = await db.execute(`
        SELECT 
          d.id,
          d.amount,
          d.status,
          d.created_at,
          d.completed_at,
          uo.organization_name,
          uo.organization_ein,
          uo.organization_logo_url as logo_url,
          uo.organization_website_url as website_url,
          uo.organization_description
        FROM donations d
        INNER JOIN user_organizations uo ON d.organization_id = uo.id
        WHERE d.id = ? AND d.user_id = ?
      `, [parseInt(id), parseInt(userId)]);

      if (donations.length === 0) {
        return ApiResponse.error(res, 'Donation not found', 404);
      }

      return ApiResponse.success(res, {
        donation: donations[0]
      });

    } catch (error) {
      console.error('Get donation by ID error:', error);
      return ApiResponse.error(res, 'Failed to get donation', 500);
    }
  }
}

module.exports = DonationController;
