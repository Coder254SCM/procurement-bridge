
import React from 'react';
import { Profile } from '@/types/database.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  loading: boolean;
  profile: Profile | null;
}

const ProfileHeader = ({ loading, profile }: ProfileHeaderProps) => {
  if (loading && !profile) {
    return (
      <div className="container py-10">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-secondary animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-secondary animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-secondary animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>
              {profile?.full_name ? `Welcome back, ${profile.full_name}` : 'Manage your profile information and preferences'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {profile?.company_name && (
          <div className="px-4 py-3 rounded-md bg-secondary/50 inline-block">
            <span className="font-medium">Organization: </span>
            <span>{profile.company_name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
