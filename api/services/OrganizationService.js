const db = require('./DatabaseService');
const EveryOrgService = require('./EveryOrgService');

class OrganizationService {
  static async getAllOrganizations(filters = {}) {
    try {
      let query = 'SELECT * FROM organizations WHERE verified = TRUE';
      let params = [];
      
      if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
      }
      
      query += ' ORDER BY name';
      
      const [organizations] = await db.execute(query, params);
      return organizations;
    } catch (error) {
      throw error;
    }
  }

  static async getOrganizationById(id) {
    try {
      const [organizations] = await db.execute(
        'SELECT * FROM organizations WHERE id = ?',
        [id]
      );
      
      if (organizations.length === 0) {
        return null;
      }
      
      return organizations[0];
    } catch (error) {
      throw error;
    }
  }

  static async createOrganization(organizationData) {
    try {
      const { name, description, category, ein, website, logoUrl } = organizationData;
      
      const [result] = await db.execute(
        'INSERT INTO organizations (name, description, category, ein, website, logo_url) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, category, ein, website, logoUrl]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateOrganization(id, updateData) {
    try {
      const { name, description, category, ein, website, logoUrl, verified } = updateData;
      const fields = [];
      const values = [];
      
      if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
      }
      
      if (description !== undefined) {
        fields.push('description = ?');
        values.push(description);
      }
      
      if (category !== undefined) {
        fields.push('category = ?');
        values.push(category);
      }
      
      if (ein !== undefined) {
        fields.push('ein = ?');
        values.push(ein);
      }
      
      if (website !== undefined) {
        fields.push('website = ?');
        values.push(website);
      }
      
      if (logoUrl !== undefined) {
        fields.push('logo_url = ?');
        values.push(logoUrl);
      }
      
      if (verified !== undefined) {
        fields.push('verified = ?');
        values.push(verified);
      }
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(id);
      
      const [result] = await db.execute(
        `UPDATE organizations SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async addDonation(organizationId, amount) {
    try {
      await db.execute(
        'UPDATE organizations SET total_received = total_received + ? WHERE id = ?',
        [amount, organizationId]
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async getStats() {
    try {
      const [stats] = await db.execute(`
        SELECT 
          COUNT(*) as total_organizations,
          SUM(total_received) as total_donations,
          AVG(total_received) as average_donations
        FROM organizations 
        WHERE verified = TRUE
      `);
      
      return stats[0];
    } catch (error) {
      throw error;
    }
  }

  static getCategories() {
    return [
      { value: 'education', label: 'Education' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'community', label: 'Community' },
      { value: 'environment', label: 'Environment' },
      { value: 'other', label: 'Other' }
    ];
  }

  // Every.org API integration methods
  
  static async searchEveryOrgNonprofits(searchTerm, options = {}) {
    try {
      return await EveryOrgService.searchNonprofits(searchTerm, options);
    } catch (error) {
      throw error;
    }
  }

  static async browseEveryOrgNonprofits(cause, options = {}) {
    try {
      return await EveryOrgService.browseNonprofits(cause, options);
    } catch (error) {
      throw error;
    }
  }

  static async getEveryOrgNonprofit(identifier) {
    try {
      return await EveryOrgService.getNonprofitByIdentifier(identifier);
    } catch (error) {
      throw error;
    }
  }

  static getEveryOrgCauses() {
    return EveryOrgService.getAvailableCauses().map(cause => ({
      value: cause,
      label: cause.charAt(0).toUpperCase() + cause.slice(1)
    }));
  }

  // Sync Every.org nonprofit to local database
  static async syncNonprofitFromEveryOrg(everyOrgData) {
    try {
      // Check if nonprofit already exists
      const [existing] = await db.execute(
        'SELECT id FROM organizations WHERE ein = ? OR name = ?',
        [everyOrgData.ein, everyOrgData.name]
      );

      if (existing.length > 0) {
        return existing[0].id;
      }

      // Map Every.org data to our database schema
      const category = this.mapEveryOrgCategory(everyOrgData.tags);
      
      const [result] = await db.execute(
        'INSERT INTO organizations (name, description, category, ein, website, logo_url, verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          everyOrgData.name,
          everyOrgData.description,
          category,
          everyOrgData.ein,
          everyOrgData.websiteUrl,
          everyOrgData.logoUrl,
          true // Every.org nonprofits are verified
        ]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static mapEveryOrgCategory(tags) {
    if (!tags || tags.length === 0) return 'other';
    
    const tagNames = tags.map(tag => tag.name || tag).map(name => name.toLowerCase());
    
    if (tagNames.includes('education')) return 'education';
    if (tagNames.includes('health') || tagNames.includes('healthcare')) return 'healthcare';
    if (tagNames.includes('environment')) return 'environment';
    if (tagNames.includes('animals') || tagNames.includes('humans') || tagNames.includes('community')) return 'community';
    
    return 'other';
  }
}

module.exports = OrganizationService;
