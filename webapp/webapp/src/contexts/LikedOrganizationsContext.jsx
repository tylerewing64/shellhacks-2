import React, { createContext, useContext, useState, useEffect } from 'react';
import UserOrganizationService from '../services/userOrganizationService';

const LikedOrganizationsContext = createContext();

export const useLikedOrganizations = () => {
  const context = useContext(LikedOrganizationsContext);
  if (!context) {
    throw new Error('useLikedOrganizations must be used within a LikedOrganizationsProvider');
  }
  return context;
};

export const LikedOrganizationsProvider = ({ children }) => {
  const [likedOrganizations, setLikedOrganizations] = useState([]);

  // Load liked organizations from database on mount
  useEffect(() => {
    loadLikedOrganizations();
  }, []);

  const loadLikedOrganizations = async () => {
    try {
      const response = await UserOrganizationService.getLikedOrganizations();
      if (response.success) {
        setLikedOrganizations(response.organizations);
      }
    } catch (error) {
      console.error('Error loading liked organizations:', error);
      setLikedOrganizations([]);
    }
  };

  const addLikedOrganization = async (organization) => {
    try {
      await UserOrganizationService.likeOrganization(organization);
      setLikedOrganizations(prev => {
        // Check if organization is already liked
        const isAlreadyLiked = prev.some(org => org.ein === organization.ein);
        if (isAlreadyLiked) {
          return prev;
        }
        return [...prev, organization];
      });
    } catch (error) {
      console.error('Error liking organization:', error);
      // You might want to show a toast notification here
    }
  };

  const removeLikedOrganization = async (ein) => {
    try {
      await UserOrganizationService.unlikeOrganization(ein);
      setLikedOrganizations(prev => prev.filter(org => org.ein !== ein));
    } catch (error) {
      console.error('Error unliking organization:', error);
      // You might want to show a toast notification here
    }
  };

  const isLiked = (ein) => {
    return likedOrganizations.some(org => org.ein === ein);
  };

  const toggleLike = async (organization) => {
    if (isLiked(organization.ein)) {
      await removeLikedOrganization(organization.ein);
    } else {
      await addLikedOrganization(organization);
    }
  };

  const value = {
    likedOrganizations,
    addLikedOrganization,
    removeLikedOrganization,
    isLiked,
    toggleLike
  };

  return (
    <LikedOrganizationsContext.Provider value={value}>
      {children}
    </LikedOrganizationsContext.Provider>
  );
};
