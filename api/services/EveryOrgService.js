const fetch = require('node-fetch');

class EveryOrgService {
  constructor() {
    this.baseUrl = 'https://partners.every.org/v0.2';
    this.apiKey = process.env.EVERY_ORG_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  EVERY_ORG_API_KEY not found in environment variables');
    }
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      url.searchParams.append('apiKey', this.apiKey);
      
      // Add additional parameters
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Every.org API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Every.org API request failed:', error);
      throw error;
    }
  }

  // Get nonprofit details by identifier (slug, EIN, or ID)
  async getNonprofitByIdentifier(identifier) {
    try {
      const response = await this.makeRequest(`/nonprofit/${identifier}`);
      return this.formatNonprofitDetails(response.data.nonprofit);
    } catch (error) {
      throw error;
    }
  }

  // Search nonprofits by search term
  async searchNonprofits(searchTerm, options = {}) {
    try {
      const params = {
        take: options.limit || 20,
        ...(options.causes && { causes: options.causes })
      };

      const response = await this.makeRequest(`/search/${encodeURIComponent(searchTerm)}`, params);
      return {
        nonprofits: response.nonprofits.map(np => this.formatNonprofitSearch(np)),
        total: response.nonprofits.length
      };
    } catch (error) {
      throw error;
    }
  }

  // Browse nonprofits by cause
  async browseNonprofits(cause, options = {}) {
    try {
      const params = {
        take: options.limit || 20,
        page: options.page || 1
      };

      const response = await this.makeRequest(`/browse/${encodeURIComponent(cause)}`, params);
      return {
        nonprofits: response.nonprofits.map(np => this.formatNonprofitBrowse(np)),
        pagination: response.pagination
      };
    } catch (error) {
      throw error;
    }
  }

  // Get available causes/categories
  getAvailableCauses() {
    return [
      'animals',
      'arts',
      'civil',
      'education',
      'environment',
      'health',
      'humans',
      'international',
      'religion',
      'research'
    ];
  }

  // Format nonprofit details response
  formatNonprofitDetails(nonprofit) {
    return {
      id: nonprofit.id,
      name: nonprofit.name,
      description: nonprofit.description,
      descriptionLong: nonprofit.descriptionLong,
      ein: nonprofit.ein,
      slug: nonprofit.primarySlug,
      location: nonprofit.locationAddress,
      websiteUrl: nonprofit.websiteUrl,
      profileUrl: nonprofit.profileUrl,
      logoUrl: nonprofit.logoUrl,
      coverImageUrl: nonprofit.coverImageUrl,
      isDisbursable: nonprofit.isDisbursable,
      nteeCode: nonprofit.nteeCode,
      nteeCodeMeaning: nonprofit.nteeCodeMeaning,
      tags: nonprofit.nonprofitTags?.map(tag => ({
        name: tag.tagName,
        category: tag.causeCategory,
        title: tag.title
      })) || []
    };
  }

  // Format nonprofit search response
  formatNonprofitSearch(nonprofit) {
    return {
      name: nonprofit.name,
      description: nonprofit.description,
      ein: nonprofit.ein,
      slug: nonprofit.slug,
      websiteUrl: nonprofit.websiteUrl,
      profileUrl: nonprofit.profileUrl,
      logoUrl: nonprofit.logoUrl,
      matchedTerms: nonprofit.matchedTerms || []
    };
  }

  // Format nonprofit browse response
  formatNonprofitBrowse(nonprofit) {
    return {
      name: nonprofit.name,
      description: nonprofit.description,
      ein: nonprofit.ein,
      slug: nonprofit.slug,
      location: nonprofit.location,
      websiteUrl: nonprofit.websiteUrl,
      profileUrl: nonprofit.profileUrl,
      logoUrl: nonprofit.logoUrl,
      coverImageUrl: nonprofit.coverImageUrl,
      tags: nonprofit.tags || []
    };
  }
}

module.exports = new EveryOrgService();
