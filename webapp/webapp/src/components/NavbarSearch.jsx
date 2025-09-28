import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Heart } from 'lucide-react';
import OrganizationService from '../services/organizationService';
import { useLikedOrganizations } from '../contexts/LikedOrganizationsContext';
import OrganizationDetailCard from './OrganizationDetailCard';

const NavbarSearch = ({ onSelectOrganization, onDonationSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const { isLiked, toggleLike } = useLikedOrganizations();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);

      try {
        const response = await OrganizationService.searchOrganizations(searchQuery, {
          limit: 5 // Limit results for navbar
        });

        if (response.success) {
          setResults(response.nonprofits || []);
          setShowResults(true);
        }
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle search input change
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle organization selection - show detail card
  const handleSelectOrganization = (organization) => {
    setSelectedOrganization(organization);
    setQuery('');
    setResults([]);
    setShowResults(false);
    setIsExpanded(false);
  };

  // Handle closing detail card
  const handleCloseDetail = () => {
    setSelectedOrganization(null);
  };

  // Handle like toggle
  const handleToggleLike = (e, organization) => {
    e.stopPropagation(); // Prevent organization selection when clicking like button
    toggleLike(organization);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsExpanded(true);
    if (query.length >= 2) {
      setShowResults(true);
    }
  };

  // Handle input blur (with delay to allow clicking on results)
  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
      setIsExpanded(false);
    }, 200);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <>
      <div className="relative">
      {/* Search Input */}
      <div className={`relative transition-all duration-200 ${
        isExpanded ? 'w-80' : 'w-64'
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search organizations..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="py-2">
            {results.map((organization, index) => (
              <div
                key={index}
                onClick={() => handleSelectOrganization(organization)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  {organization.logoUrl && (
                    <img
                      src={organization.logoUrl}
                      alt={`${organization.name} logo`}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {organization.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {organization.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleToggleLike(e, organization)}
                    className={`p-1 rounded-full transition-colors ${
                      isLiked(organization.ein)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                    title={isLiked(organization.ein) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked(organization.ein) ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4 text-center text-gray-500 text-sm">
            No organizations found. Try a different search term.
          </div>
        </div>
      )}
      </div>

      {/* Organization Detail Card */}
      {selectedOrganization && (
        <OrganizationDetailCard
          organization={selectedOrganization}
          onClose={handleCloseDetail}
          onLike={toggleLike}
          onUnlike={(ein) => toggleLike({ ein })}
          isLiked={isLiked(selectedOrganization.ein)}
          onDonationSuccess={onDonationSuccess}
        />
      )}
    </>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default NavbarSearch;
