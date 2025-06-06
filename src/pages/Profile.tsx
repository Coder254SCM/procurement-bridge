
import React from 'react';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileActions } from '@/hooks/useProfileActions';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import BlockchainInfo from '@/components/profile/BlockchainInfo';

const Profile = () => {
  const {
    loading,
    setLoading,
    uploading,
    setUploading,
    user,
    profile,
    setProfile,
    userRoles,
    setUserRoles,
    formData,
    setFormData,
    selectedRole,
    setSelectedRole,
    toast
  } = useProfileData();

  const {
    handleInputChange,
    handleRoleChange,
    handleProfileUpdate,
    handleAddRole,
    handleRemoveRole,
    handleDocumentUpload,
    handleSubmitVerification
  } = useProfileActions(
    user,
    profile,
    setProfile,
    userRoles,
    setUserRoles,
    setLoading,
    setUploading,
    toast
  );

  // Helper function to check if a document exists
  const hasDocument = (documentType: string) => {
    return profile?.kyc_documents && 
           profile.kyc_documents[documentType] && 
           profile.kyc_documents[documentType].path;
  };

  // Helper function to get document status
  const getDocumentStatus = (documentType: string) => {
    if (!profile?.kyc_documents || !profile.kyc_documents[documentType]) {
      return 'Not uploaded';
    }
    return profile.kyc_documents[documentType].status || 'pending';
  };

  return (
    <div className="container py-10">
      <ProfileHeader loading={loading} profile={profile} />
      
      <ProfileTabs
        formData={formData}
        loading={loading}
        profile={profile}
        userRoles={userRoles}
        selectedRole={selectedRole}
        uploading={uploading}
        handleInputChange={(e) => setFormData(handleInputChange(e))}
        handleProfileUpdate={() => handleProfileUpdate(formData)}
        handleRoleChange={(value) => setSelectedRole(handleRoleChange(value))}
        handleAddRole={() => handleAddRole(selectedRole)}
        handleRemoveRole={handleRemoveRole}
        handleDocumentUpload={handleDocumentUpload}
        handleSubmitVerification={handleSubmitVerification}
        hasDocument={hasDocument}
        getDocumentStatus={getDocumentStatus}
      />
      
      <BlockchainInfo />
    </div>
  );
};

export default Profile;
