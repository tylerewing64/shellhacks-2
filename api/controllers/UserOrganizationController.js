const db = require('../services/DatabaseService');
const ApiResponse = require('../views/ApiResponse');

class UserOrganizationController {
  // Like an organization
  static async likeOrganization(req, res) {
    try {
      const userId = req.user.userId;
      const organization = req.body;

      // Validate required fields
      if (!organization.ein || !organization.name) {
        return ApiResponse.error(res, 'Organization EIN and name are required', 400);
      }

      // Check if already liked
      const [existing] = await db.execute(
        'SELECT id FROM user_organizations WHERE user_id = ? AND organization_ein = ?',
        [userId, organization.ein]
      );

      if (existing.length > 0) {
        return ApiResponse.error(res, 'Organization already liked', 409);
      }

      // Insert organization data
      const insertQuery = `
        INSERT INTO user_organizations (
          user_id, organization_ein, organization_name, organization_description,
          organization_website_url, organization_logo_url, organization_profile_url,
          organization_slug, organization_location, organization_ntee_code,
          organization_ntee_code_meaning, organization_is_disbursable,
          organization_tags, organization_matched_terms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId,
        organization.ein,
        organization.name,
        organization.description || null,
        organization.websiteUrl || null,
        organization.logoUrl || null,
        organization.profileUrl || null,
        organization.slug || null,
        organization.location || null,
        organization.nteeCode || null,
        organization.nteeCodeMeaning || null,
        organization.isDisbursable || null,
        organization.tags ? JSON.stringify(organization.tags) : null,
        organization.matchedTerms ? JSON.stringify(organization.matchedTerms) : null
      ];

      const [result] = await db.execute(insertQuery, values);

      return ApiResponse.success(res, {
        message: 'Organization liked successfully',
        userOrganizationId: result.insertId
      });

    } catch (error) {
      console.error('Like organization error:', error);
      return ApiResponse.error(res, 'Failed to like organization', 500);
    }
  }

  // Unlike an organization
  static async unlikeOrganization(req, res) {
    try {
      const userId = req.user.userId;
      const { ein } = req.params;

      if (!ein) {
        return ApiResponse.error(res, 'Organization EIN is required', 400);
      }

      const [result] = await db.execute(
        'DELETE FROM user_organizations WHERE user_id = ? AND organization_ein = ?',
        [userId, ein]
      );

      if (result.affectedRows === 0) {
        return ApiResponse.error(res, 'Organization not found in favorites', 404);
      }

      return ApiResponse.success(res, {
        message: 'Organization removed from favorites'
      });

    } catch (error) {
      console.error('Unlike organization error:', error);
      return ApiResponse.error(res, 'Failed to unlike organization', 500);
    }
  }

  // Get user's liked organizations
  static async getLikedOrganizations(req, res) {
    try {
      const userId = req.user.userId;

      const [organizations] = await db.execute(`
        SELECT 
          id,
          organization_ein as ein,
          organization_name as name,
          organization_description as description,
          organization_website_url as websiteUrl,
          organization_logo_url as logoUrl,
          organization_profile_url as profileUrl,
          organization_slug as slug,
          organization_location as location,
          organization_ntee_code as nteeCode,
          organization_ntee_code_meaning as nteeCodeMeaning,
          organization_is_disbursable as isDisbursable,
          organization_tags as tags,
          organization_matched_terms as matchedTerms,
          liked_at,
          created_at,
          updated_at
        FROM user_organizations 
        WHERE user_id = ? 
        ORDER BY liked_at DESC
      `, [userId]);

      // Parse JSON fields
      const parsedOrganizations = organizations.map(org => {
        try {
          return {
            ...org,
            tags: org.tags ? JSON.parse(org.tags) : null,
            matchedTerms: org.matchedTerms ? JSON.parse(org.matchedTerms) : null
          };
        } catch (error) {
          console.error('Error parsing JSON fields for org:', org.id, error);
          return {
            ...org,
            tags: null,
            matchedTerms: null
          };
        }
      });

      return ApiResponse.success(res, {
        organizations: parsedOrganizations,
        total: parsedOrganizations.length
      });

    } catch (error) {
      console.error('Get liked organizations error:', error);
      return ApiResponse.error(res, 'Failed to get liked organizations', 500);
    }
  }

  // Check if organization is liked
  static async isOrganizationLiked(req, res) {
    try {
      const userId = req.user.userId;
      const { ein } = req.params;

      if (!ein) {
        return ApiResponse.error(res, 'Organization EIN is required', 400);
      }

      const [result] = await db.execute(
        'SELECT id FROM user_organizations WHERE user_id = ? AND organization_ein = ?',
        [userId, ein]
      );

      return ApiResponse.success(res, {
        isLiked: result.length > 0
      });

    } catch (error) {
      console.error('Check organization liked error:', error);
      return ApiResponse.error(res, 'Failed to check organization status', 500);
    }
  }
}

module.exports = UserOrganizationController;
