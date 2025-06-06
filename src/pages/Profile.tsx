import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole as EnumUserRole, KycStatus, VerificationLevel } from '@/types/enums';
import { Profile as ProfileType, UserRole, UserRoleRecord } from '@/types/database.types';

// Import the new components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInformation from '@/components/profile/ProfileInformation';
import UserRolesManager from '@/components/profile/UserRolesManager';
import KycVerification from '@/components/profile/KycVerification';
import BlockchainInfo from '@/components/profile/BlockchainInfo';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoleRecord[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    position: '',
    industry: '',
  });
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          
          // Fetch profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) throw profileError;
          
          // Create a complete Profile object with default values for missing fields
          const completeProfile: ProfileType = {
            id: profileData.id,
            full_name: profileData.full_name || '',
            company_name: profileData.company_name || '',
            position: profileData.position || '',
            industry: profileData.industry || '',
            verified: profileData.verified || false,
            kyc_status: profileData.kyc_status as string || KycStatus.PENDING,
            kyc_documents: profileData.kyc_documents as Record<string, any> || {},
            documents_uploaded: profileData.documents_uploaded as Record<string, any> || {},
            created_at: profileData.created_at || new Date().toISOString(),
            updated_at: profileData.updated_at || new Date().toISOString(),
            verification_level: profileData.verification_level as string || VerificationLevel.NONE,
            verification_status: profileData.verification_status || 'pending',
            avatar_url: '',
            email: '',
            website: '',
            phone_number: '',
            address: '',
            city: '',
            country: '',
            postal_code: '',
            bio: '',
            business_type: null,
            business_registration_number: null,
            tax_pin: null,
          };
          
          setProfile(completeProfile);
          
          // Initialize form data
          setFormData({
            full_name: profileData.full_name || '',
            company_name: profileData.company_name || '',
            position: profileData.position || '',
            industry: profileData.industry || '',
          });
          
          // Fetch user roles
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', user.id);
            
          if (rolesError) throw rolesError;
          
          // Convert the roles from the database to match our UserRole enum
          const convertedRoles: UserRoleRecord[] = rolesData.map(role => ({
            id: role.id,
            user_id: role.user_id,
            role: role.role as UserRole,
            created_at: role.created_at || new Date().toISOString(),
          }));
          
          setUserRoles(convertedRoles);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user profile data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value as UserRole);
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been updated successfully.',
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      
      // Check if role already exists
      const roleExists = userRoles.some(r => r.role === selectedRole);
      
      if (roleExists) {
        toast({
          title: 'Role Already Exists',
          description: 'You already have this role assigned to your account.',
          variant: 'destructive',
        });
        return;
      }
      
      // We need to ensure the role value matches one of the valid enum values in Supabase
      // The UserRole enum in our code might have more values than in the database
      const validDbRoles = ['buyer', 'supplier', 'admin', 'evaluator_finance', 'evaluator_technical', 'evaluator_procurement'];
      
      if (!validDbRoles.includes(String(selectedRole).toLowerCase())) {
        toast({
          title: 'Invalid Role',
          description: `The role "${selectedRole}" is not supported in the database.`,
          variant: 'destructive',
        });
        return;
      }
      
      // Add new role with a valid role value
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: String(selectedRole).toLowerCase() as any
        });
        
      if (error) throw error;
      
      // Refresh roles
      const { data, error: fetchError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
        
      if (fetchError) throw fetchError;
      
      // Convert the roles from the database to match our UserRole enum
      const convertedRoles: UserRoleRecord[] = data.map(role => ({
        id: role.id,
        user_id: role.user_id,
        role: role.role as UserRole,
        created_at: role.created_at || new Date().toISOString(),
      }));
      
      setUserRoles(convertedRoles);
      
      toast({
        title: 'Role Added',
        description: `The role "${selectedRole}" has been added to your account.`,
      });
      
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: 'Error',
        description: 'There was an error adding the role to your account.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
        
      if (error) throw error;
      
      // Update local state
      setUserRoles(prev => prev.filter(role => role.id !== roleId));
      
      toast({
        title: 'Role Removed',
        description: 'The role has been removed from your account.',
      });
      
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: 'Error',
        description: 'There was an error removing the role.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('kyc_documents')
        .upload(fileName, file);
        
      if (error) throw error;
      
      // Update kyc_documents in profile
      const kycDocuments = profile?.kyc_documents || {};
      const newKycDocuments = {
        ...kycDocuments,
        [documentType]: {
          path: data.path,
          uploaded_at: new Date().toISOString(),
          status: 'pending',
        }
      };
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          kyc_documents: newKycDocuments,
          kyc_status: KycStatus.SUBMITTED
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          kyc_documents: newKycDocuments,
          kyc_status: KycStatus.SUBMITTED
        };
      });
      
      toast({
        title: 'Document Uploaded',
        description: `Your ${documentType} document has been uploaded successfully.`,
      });
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your document.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      setLoading(true);
      
      // Update KYC status to UNDER_REVIEW
      const { error } = await supabase
        .from('profiles')
        .update({
          kyc_status: KycStatus.UNDER_REVIEW
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          kyc_status: KycStatus.UNDER_REVIEW
        };
      });
      
      toast({
        title: 'Verification Submitted',
        description: 'Your verification documents have been submitted for review.',
      });
      
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your verification.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
      
      <BlockchainInfo />
    </div>
  );
};

export default Profile;
