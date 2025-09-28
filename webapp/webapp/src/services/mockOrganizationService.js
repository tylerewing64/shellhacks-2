// Mock data for testing when Every.org API is not available
const mockOrganizations = [
  {
    name: "Local Food Bank",
    description: "Provides meals to families in need throughout the community",
    ein: "123456789",
    websiteUrl: "https://localfoodbank.org",
    logoUrl: "https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=LF",
    profileUrl: "https://every.org/localfoodbank",
    matchedTerms: ["food", "hunger", "community"]
  },
  {
    name: "Education First",
    description: "Supplies school materials to underserved communities",
    ein: "987654321",
    websiteUrl: "https://educationfirst.org",
    logoUrl: "https://via.placeholder.com/40x40/059669/FFFFFF?text=EF",
    profileUrl: "https://every.org/educationfirst",
    matchedTerms: ["education", "school", "children"]
  },
  {
    name: "Green Future Initiative",
    description: "Environmental conservation and tree planting programs",
    ein: "456789123",
    websiteUrl: "https://greenfuture.org",
    logoUrl: "https://via.placeholder.com/40x40/DC2626/FFFFFF?text=GF",
    profileUrl: "https://every.org/greenfuture",
    matchedTerms: ["environment", "trees", "conservation"]
  },
  {
    name: "Community Health Clinic",
    description: "Provides healthcare access to low-income families",
    ein: "789123456",
    websiteUrl: "https://communityhealth.org",
    logoUrl: "https://via.placeholder.com/40x40/7C3AED/FFFFFF?text=CH",
    profileUrl: "https://every.org/communityhealth",
    matchedTerms: ["health", "medical", "community"]
  },
  {
    name: "Animal Rescue League",
    description: "Rescues and cares for abandoned and abused animals",
    ein: "321654987",
    websiteUrl: "https://animalrescue.org",
    logoUrl: "https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=AR",
    profileUrl: "https://every.org/animalrescue",
    matchedTerms: ["animals", "pets", "rescue"]
  }
];

class MockOrganizationService {
  static async searchOrganizations(query, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const filtered = mockOrganizations.filter(org => 
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.description.toLowerCase().includes(query.toLowerCase()) ||
      org.matchedTerms.some(term => term.toLowerCase().includes(query.toLowerCase()))
    );

    return {
      success: true,
      nonprofits: filtered,
      total: filtered.length
    };
  }

  static async browseOrganizations(cause, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const causeMap = {
      'animals': ['Animal Rescue League'],
      'education': ['Education First'],
      'environment': ['Green Future Initiative'],
      'health': ['Community Health Clinic'],
      'community': ['Local Food Bank', 'Community Health Clinic']
    };

    const orgNames = causeMap[cause] || [];
    const filtered = mockOrganizations.filter(org => 
      orgNames.includes(org.name)
    );

    return {
      success: true,
      nonprofits: filtered,
      pagination: {
        page: 1,
        pages: 1,
        page_size: 10,
        total_results: filtered.length
      }
    };
  }

  static async getCauses() {
    return {
      success: true,
      causes: [
        { value: 'animals', label: 'Animals' },
        { value: 'arts', label: 'Arts' },
        { value: 'civil', label: 'Civil' },
        { value: 'education', label: 'Education' },
        { value: 'environment', label: 'Environment' },
        { value: 'health', label: 'Health' },
        { value: 'humans', label: 'Humans' },
        { value: 'international', label: 'International' },
        { value: 'religion', label: 'Religion' },
        { value: 'research', label: 'Research' }
      ]
    };
  }

  static async getOrganizationDetails(identifier) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const org = mockOrganizations.find(o => 
      o.ein === identifier || 
      o.name.toLowerCase().replace(/\s+/g, '') === identifier.toLowerCase()
    );

    if (!org) {
      throw new Error('Organization not found');
    }

    return {
      success: true,
      nonprofit: org
    };
  }
}

export default MockOrganizationService;
