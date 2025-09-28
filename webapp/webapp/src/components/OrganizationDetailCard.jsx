import React, { useEffect, useState } from 'react';
import { X, Heart, ExternalLink, MapPin, Calendar, Users, DollarSign, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import DonationModal from './DonationModal';

const OrganizationDetailCard = ({ organization, onClose, onLike, onUnlike, isLiked, onDonationSuccess }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  if (!organization) return null;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleLikeToggle = () => {
    if (isLiked) {
      onUnlike(organization.ein);
    } else {
      onLike(organization);
    }
  };

  const handleVisitWebsite = () => {
    if (organization.websiteUrl) {
      window.open(organization.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVisitProfile = () => {
    if (organization.profileUrl) {
      window.open(organization.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDonationSuccess = (donation) => {
    if (onDonationSuccess) {
      onDonationSuccess(donation);
    }
    setShowDonationModal(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-start space-x-4">
            {organization.logoUrl && (
              <img
                src={organization.logoUrl}
                alt={`${organization.name} logo`}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl leading-tight">
                {organization.name}
              </CardTitle>
              {organization.ein && (
                <p className="text-sm text-gray-500 mt-1">
                  EIN: {organization.ein}
                </p>
              )}
              {organization.slug && (
                <p className="text-xs text-gray-400 mt-1">
                  {organization.slug}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLikeToggle}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? 'text-red-500 hover:text-red-600 bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          {organization.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-600 leading-relaxed">
                {organization.description}
              </p>
            </div>
          )}

          {/* Long Description */}
          {organization.descriptionLong && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                {organization.descriptionLong}
              </p>
            </div>
          )}

          {/* Location */}
          {organization.location && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Location</h3>
                <p className="text-gray-600">{organization.location}</p>
              </div>
            </div>
          )}

          {/* Tags/Categories */}
          {organization.tags && organization.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Focus Areas</h3>
              <div className="flex flex-wrap gap-2">
                {organization.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag.name || tag.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Matched Terms */}
          {organization.matchedTerms && organization.matchedTerms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Terms</h3>
              <div className="flex flex-wrap gap-2">
                {organization.matchedTerms.map((term, index) => (
                  <Badge key={index} variant="outline">
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* NTEE Code */}
          {organization.nteeCode && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Organization Type</h3>
              <p className="text-gray-600">
                {organization.nteeCodeMeaning || organization.nteeCode}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {organization.websiteUrl && (
              <Button
                onClick={handleVisitWebsite}
                className="flex-1"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Visit Website
              </Button>
            )}
            {organization.profileUrl && (
              <Button
                onClick={handleVisitProfile}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                View on Every.org
              </Button>
            )}
            <Button
              onClick={() => setShowDonationModal(true)}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Make Donation
            </Button>
            <Button
              onClick={handleLikeToggle}
              variant={isLiked ? "destructive" : "outline"}
              className="flex-1"
              size="lg"
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </div>

          {/* Donation Info */}
          {organization.isDisbursable !== undefined && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Donation Status</h3>
              </div>
              <p className="text-blue-800">
                {organization.isDisbursable 
                  ? 'This organization accepts donations through Every.org'
                  : 'This organization may not be accepting donations at this time'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal
          organization={organization}
          onDonationSuccess={handleDonationSuccess}
          onClose={() => setShowDonationModal(false)}
        />
      )}
    </div>
  );
};

export default OrganizationDetailCard;
