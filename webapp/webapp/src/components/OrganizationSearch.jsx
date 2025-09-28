import React, { useState, useEffect, useCallback } from 'react';
import OrganizationService from '../services/organizationService';
import { useLikedOrganizations } from '../contexts/LikedOrganizationsContext';
import OrganizationDetailCard from './OrganizationDetailCard';
import { Heart } from 'lucide-react';

const OrganizationSearch = ({ onSelectOrganization, onClose, onDonationSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [causes, setCauses] = useState([]);
  const [selectedCause, setSelectedCause] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const { isLiked, toggleLike } = useLikedOrganizations();

  // Load causes on component mount
  useEffect(() => {
    loadCauses();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery, cause) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await OrganizationService.searchOrganizations(searchQuery, {
          causes: cause || undefined
        });

        if (response.success) {
          setResults(response.nonprofits || []);
          setShowResults(true);
        } else {
          setError('Search failed. Please try again.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Unable to search organizations. Please check your connection.');
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
    debouncedSearch(value, selectedCause);
  };

  // Handle cause filter change
  const handleCauseChange = (e) => {
    const cause = e.target.value;
    setSelectedCause(cause);
    if (query.length >= 2) {
      debouncedSearch(query, cause);
    }
  };

  // Handle organization selection - show detail card
  const handleSelectOrganization = (organization) => {
    setSelectedOrganization(organization);
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

  // Load available causes
  const loadCauses = async () => {
    try {
      const response = await OrganizationService.getCauses();
      if (response.success) {
        setCauses(response.causes || []);
      }
    } catch (err) {
      console.error('Failed to load causes:', err);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Search for organizations (e.g., 'pets', 'education', 'environment')"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Cause Filter */}
      {causes.length > 0 && (
        <div className="mt-3">
          <select
            value={selectedCause}
            onChange={handleCauseChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Causes</option>
            {causes.map((cause) => (
              <option key={cause.value} value={cause.value}>
                {cause.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No organizations found. Try a different search term.
            </div>
          ) : (
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
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {organization.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {organization.description}
                      </p>
                      {organization.websiteUrl && (
                        <a
                          href={organization.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:text-blue-800 truncate block"
                        >
                          {organization.websiteUrl}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
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
                          className={`w-5 h-5 ${
                            isLiked(organization.ein) ? 'fill-current' : ''
                          }`}
                        />
                      </button>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowResults(false)}
        />
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

export default OrganizationSearch;
