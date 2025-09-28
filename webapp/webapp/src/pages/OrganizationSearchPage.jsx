import React, { useState } from 'react';
import OrganizationSearch from '../components/OrganizationSearch';

const OrganizationSearchPage = () => {
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  const handleSelectOrganization = (organization) => {
    // Check if organization is already selected
    const isAlreadySelected = selectedOrganizations.some(
      org => org.ein === organization.ein
    );

    if (!isAlreadySelected) {
      setSelectedOrganizations(prev => [...prev, organization]);
    }
  };

  const handleRemoveOrganization = (ein) => {
    setSelectedOrganizations(prev => 
      prev.filter(org => org.ein !== ein)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Organizations to Support
          </h1>
          <p className="text-lg text-gray-600">
            Search for charities and nonprofits to add to your donation list
          </p>
        </div>

        {/* Search Component */}
        <div className="mb-8">
          <OrganizationSearch onSelectOrganization={handleSelectOrganization} />
        </div>

        {/* Selected Organizations */}
        {selectedOrganizations.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Selected Organizations ({selectedOrganizations.length})
            </h2>
            <div className="space-y-4">
              {selectedOrganizations.map((organization) => (
                <div
                  key={organization.ein}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {organization.logoUrl && (
                      <img
                        src={organization.logoUrl}
                        alt={`${organization.name} logo`}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {organization.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {organization.description}
                      </p>
                      {organization.websiteUrl && (
                        <a
                          href={organization.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveOrganization(organization.ein)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Remove organization"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedOrganizations.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No organizations selected yet
            </h3>
            <p className="text-gray-500">
              Use the search bar above to find and select organizations you'd like to support
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationSearchPage;
