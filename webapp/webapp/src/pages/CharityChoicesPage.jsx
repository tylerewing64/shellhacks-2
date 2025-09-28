import React from 'react';
import { useLikedOrganizations } from '../contexts/LikedOrganizationsContext';
import { Heart, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const CharityChoicesPage = () => {
  const { likedOrganizations, removeLikedOrganization, isLiked } = useLikedOrganizations();

  const handleRemoveLike = (ein) => {
    removeLikedOrganization(ein);
  };

  const handleVisitWebsite = (websiteUrl) => {
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  if (likedOrganizations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <Heart className="w-16 h-16 text-gray-400 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">Your Charity Choices</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            You haven't liked any organizations yet. Search for charities you care about and click the heart icon to add them here.
          </p>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-4"
          >
            Go Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Your Charity Choices</h1>
          <p className="text-lg text-gray-600">
            {likedOrganizations.length} organization{likedOrganizations.length !== 1 ? 's' : ''} you care about
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedOrganizations.map((organization) => (
            <Card key={organization.ein} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
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
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight">
                        {organization.name}
                      </CardTitle>
                      {organization.ein && (
                        <p className="text-sm text-gray-500">
                          EIN: {organization.ein}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveLike(organization.ein)}
                    className="p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">
                  {organization.description}
                </p>

                {/* Matched Terms */}
                {organization.matchedTerms && organization.matchedTerms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {organization.matchedTerms.slice(0, 3).map((term, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {term}
                      </Badge>
                    ))}
                    {organization.matchedTerms.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{organization.matchedTerms.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  {organization.websiteUrl && (
                    <Button
                      onClick={() => handleVisitWebsite(organization.websiteUrl)}
                      size="sm"
                      className="flex-1"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {organization.profileUrl && (
                    <Button
                      onClick={() => handleVisitWebsite(organization.profileUrl)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Every.org
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {likedOrganizations.length}
                </div>
                <div className="text-sm text-gray-600">Total Organizations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {new Set(likedOrganizations.map(org => org.matchedTerms?.[0] || 'other')).size}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {likedOrganizations.filter(org => org.websiteUrl).length}
                </div>
                <div className="text-sm text-gray-600">With Websites</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CharityChoicesPage;
