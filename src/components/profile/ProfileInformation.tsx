
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileInformationProps {
  formData: {
    full_name: string;
    company_name: string;
    position: string;
    industry: string;
  };
  loading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileUpdate: () => void;
}

const ProfileInformation = ({ 
  formData, 
  loading, 
  handleInputChange, 
  handleProfileUpdate 
}: ProfileInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal and company information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input 
              id="full_name" 
              name="full_name" 
              value={formData.full_name || ''} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input 
              id="company_name" 
              name="company_name" 
              value={formData.company_name || ''} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input 
              id="position" 
              name="position" 
              value={formData.position || ''} 
              onChange={handleInputChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input 
              id="industry" 
              name="industry" 
              value={formData.industry || ''} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleProfileUpdate} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileInformation;
