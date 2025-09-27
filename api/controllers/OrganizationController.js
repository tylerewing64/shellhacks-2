const OrganizationService = require('../services/OrganizationService');
const ApiResponse = require('../views/ApiResponse');

class OrganizationController {
  static async getAllOrganizations(req, res) {
    try {
      const { category } = req.query;
      
      const filters = {};
      if (category) {
        filters.category = category;
      }
      
      const organizations = await OrganizationService.getAllOrganizations(filters);
      
      return ApiResponse.success(res, {
        organizations: organizations.map(org => ({
          id: org.id,
          name: org.name,
          description: org.description,
          category: org.category,
          website: org.website,
          logoUrl: org.logo_url,
          verified: org.verified,
          totalReceived: org.total_received
        }))
      });
      
    } catch (error) {
      console.error('Get organizations error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }

  static async getOrganizationById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return ApiResponse.error(res, 'Invalid organization ID', 400);
      }
      
      const organization = await OrganizationService.getOrganizationById(parseInt(id));
      
      if (!organization) {
        return ApiResponse.error(res, 'Organization not found', 404);
      }
      
      return ApiResponse.success(res, {
        organization: {
          id: organization.id,
          name: organization.name,
          description: organization.description,
          category: organization.category,
          website: organization.website,
          logoUrl: organization.logo_url,
          verified: organization.verified,
          totalReceived: organization.total_received
        }
      });
      
    } catch (error) {
      console.error('Get organization error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }

  static async createOrganization(req, res) {
    try {
      const { name, description, category, ein, website, logoUrl } = req.body;
      
      // Validate required fields
      if (!name || !description || !category) {
        return ApiResponse.error(res, 'Missing required fields', 400);
      }
      
      // Validate category
      const validCategories = ['education', 'healthcare', 'community', 'environment', 'other'];
      if (!validCategories.includes(category)) {
        return ApiResponse.error(res, 'Invalid category', 400);
      }
      
      const organizationId = await OrganizationService.createOrganization({
        name,
        description,
        category,
        ein,
        website,
        logoUrl
      });
      
      return ApiResponse.success(res, {
        message: 'Organization created successfully',
        organizationId
      }, 201);
      
    } catch (error) {
      console.error('Create organization error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = OrganizationService.getCategories();
      
      return ApiResponse.success(res, {
        categories
      });
      
    } catch (error) {
      console.error('Get categories error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await OrganizationService.getStats();
      
      return ApiResponse.success(res, {
        stats
      });
      
    } catch (error) {
      console.error('Get stats error:', error);
      return ApiResponse.error(res, 'Internal server error', 500);
    }
  }
}

module.exports = OrganizationController;
