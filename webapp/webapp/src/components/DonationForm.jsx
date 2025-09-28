import React, { useState, useEffect } from 'react';
import { DollarSign, Heart, CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLikedOrganizations } from '../contexts/LikedOrganizationsContext';

const DonationForm = ({ organization, onDonationSuccess, onClose }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(organization);
  const [likedOrgs, setLikedOrgs] = useState([]);
  const { likedOrganizations, loadLikedOrganizations } = useLikedOrganizations();

  const presetAmounts = [5, 10, 25, 50, 100];

  // Load liked organizations on component mount
  useEffect(() => {
    const loadOrgs = async () => {
      try {
        await loadLikedOrganizations();
      } catch (error) {
        console.error('Error loading liked organizations:', error);
      }
    };
    loadOrgs();
  }, [loadLikedOrganizations]);

  // Update liked organizations when context changes
  useEffect(() => {
    console.log('Liked organizations updated:', likedOrganizations);
    setLikedOrgs(likedOrganizations);
  }, [likedOrganizations]);

  // Update selected organization when organization prop changes
  useEffect(() => {
    setSelectedOrg(organization);
  }, [organization]);

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setAmount(value);
  };

  const handleOrganizationSelect = (orgEin) => {
    console.log('Selecting organization with EIN:', orgEin);
    console.log('Available organizations:', likedOrgs);
    const org = likedOrgs.find(o => o.ein === orgEin);
    if (org) {
      console.log('Selected organization:', org);
      setSelectedOrg(org);
    } else {
      console.error('Organization not found with EIN:', orgEin);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    if (!selectedOrg || !selectedOrg.ein) {
      alert('Please select an organization to donate to');
      return;
    }

    setIsSubmitting(true);

    try {
      // For general donations, we'll create a special organization first
      let organizationId = selectedOrg.ein;
      if (selectedOrg.ein === "general") {
        // Create a general donation organization entry
        const orgResponse = await fetch('http://localhost:3001/api/user-organizations/like', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ein: "general",
            name: "General Donation",
            description: "General donation to support the platform",
            websiteUrl: "https://charityround.com",
            matchedTerms: ["general", "donation"]
          })
        });
        
        if (!orgResponse.ok) {
          const errorData = await orgResponse.json().catch(() => ({}));
          console.error('Failed to create general organization:', errorData);
          throw new Error('Failed to set up general donation. Please try again.');
        }
        
        organizationId = "general";
      }

      const donationData = {
        organizationId: organizationId,
        amount: parseFloat(amount),
        organizationName: selectedOrg.name
      };
      
      console.log('Sending donation data:', donationData);
      console.log('Selected organization:', selectedOrg);
      
      const response = await fetch('http://localhost:3001/api/donations', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NTkwNTE4NzMsImV4cCI6MTc1OTEzODI3M30.z6ViM5kTwJ2cZfMP-YUQEppq9UaQ7q_0nlX8YrMAlt8',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Donation API error:', response.status, errorData);
        throw new Error(`Donation failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      setIsSuccess(true);
      
      // Call success callback after a delay
      setTimeout(() => {
        onDonationSuccess(data.donation);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Donation error:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Donation Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Thank you for donating ${amount} to {selectedOrg.name}
          </p>
          <p className="text-sm text-gray-500">
            This is a demo donation. No real money was charged.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Make a Donation
        </CardTitle>
        <p className="text-sm text-gray-600">
          Donate to <span className="font-semibold text-blue-600">{selectedOrg.name}</span>
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organization Selection */}
          {likedOrgs.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Label className="text-sm font-medium mb-3 block text-gray-700">Select Organization ({likedOrgs.length} available)</Label>
              <Select value={selectedOrg.ein} onValueChange={handleOrganizationSelect}>
                <SelectTrigger className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 font-medium py-2 px-3 rounded-md">
                  <SelectValue placeholder="Choose an organization" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl z-50 rounded-md min-w-[200px] max-h-[200px] overflow-y-auto">
                  {likedOrgs.map((org) => (
                    <SelectItem 
                      key={org.ein} 
                      value={org.ein}
                      className="hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2 px-3"
                    >
                      <div className="flex items-center gap-2">
                        {org.logoUrl && (
                          <img 
                            src={org.logoUrl} 
                            alt={`${org.name} logo`} 
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        )}
                        <span className="text-gray-900">{org.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                No liked organizations found. You can still make a general donation to support the platform.
              </p>
            </div>
          )}

          {/* Preset Amounts */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Choose Amount</Label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  type="button"
                  variant={amount === presetAmount.toString() ? "default" : "outline"}
                  onClick={() => handleAmountSelect(presetAmount)}
                  className="h-10"
                >
                  ${presetAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <Label htmlFor="customAmount" className="text-sm font-medium mb-2 block">
              Or enter custom amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="customAmount"
                type="number"
                placeholder="0.00"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="pl-10"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          {/* Selected Amount Display */}
          {amount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Donation Amount:</span>
                <span className="text-lg font-semibold text-green-600">
                  ${parseFloat(amount).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <CreditCard className="w-4 h-4 inline mr-1" />
              This is a demo donation. No real payment will be processed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Donate Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
