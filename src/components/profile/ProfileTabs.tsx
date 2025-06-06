
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Profile, UserRoleRecord } from '@/types/database.types';
import { UserRole } from '@/types/enums';
import ProfileInformation from './ProfileInformation';
import UserRolesManager from './UserRolesManager';
import KycVerification from './KycVerification';

interface ProfileTabsProps {
  formData: {
    full_name: string;
    company_name: string;
    position: string;
    industry: string;
  };
  loading: boolean;
  profile: Profile | null;
  userRoles: UserRoleRecord[];
  selectedRole: UserRole | null;
  uploading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileUpdate: () => void;
  handleRoleChange: (value: string) => void;
  handleAddRole: () => void;
  handleRemoveRole: (roleId: string) => void;
  handleDocumentUpload: (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => void;
  handleSubmitVerification: () => void;
  hasDocument: (documentType: string) => boolean;
  getDocumentStatus: (documentType: string) => string;
}

const ProfileTabs = ({
  formData,
  loading,
  profile,
  userRoles,
  selectedRole,
  uploading,
  handleInputChange,
  handleProfileUpdate,
  handleRoleChange,
  handleAddRole,
  handleRemoveRole,
  handleDocumentUpload,
  handleSubmitVerification,
  hasDocument,
  getDocumentStatus
}: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="profile">
      <TabsList className="mb-6">
        <TabsTrigger value="profile">Profile Information</TabsTrigger>
        <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileInformation
          formData={formData}
          loading={loading}
          handleInputChange={handleInputChange}
          handleProfileUpdate={handleProfileUpdate}
        />
      </TabsContent>
      
      <TabsContent value="roles">
        <UserRolesManager
          userRoles={userRoles}
          selectedRole={selectedRole}
          handleRoleChange={handleRoleChange}
          handleAddRole={handleAddRole}
          handleRemoveRole={handleRemoveRole}
          loading={loading}
        />
      </TabsContent>
      
      <TabsContent value="kyc">
        <KycVerification
          profile={profile}
          uploading={uploading}
          loading={loading}
          handleDocumentUpload={handleDocumentUpload}
          handleSubmitVerification={handleSubmitVerification}
          hasDocument={hasDocument}
          getDocumentStatus={getDocumentStatus}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
