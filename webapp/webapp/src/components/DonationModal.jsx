import React from 'react';
import { X } from 'lucide-react';
import DonationForm from './DonationForm';

const DonationModal = ({ organization, onDonationSuccess, onClose }) => {
  if (!organization) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Donation Form */}
        <DonationForm
          organization={organization}
          onDonationSuccess={onDonationSuccess}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default DonationModal;
