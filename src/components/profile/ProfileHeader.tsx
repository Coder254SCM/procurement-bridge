
import React from 'react';
import { Profile } from '@/types/database.types';

interface ProfileHeaderProps {
  loading: boolean;
  profile: Profile | null;
}

const ProfileHeader = ({ loading, profile }: ProfileHeaderProps) => {
  if (loading && !profile) {
    return <div className="container py-10">Loading profile data...</div>;
  }
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
    </>
  );
};

export default ProfileHeader;
