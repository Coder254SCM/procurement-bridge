
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/database.types';
import { KycStatus } from '@/types/enums';

export const useProfileActions = (
  user: any,
  profile: any,
  setProfile: any,
  userRoles: any,
  setUserRoles: any,
  setLoading: any,
  setUploading: any,
  toast: any
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const setFormData = (prev: any) => ({ ...prev, [name]: value });
    return setFormData;
  };

  const handleRoleChange = (value: string) => {
    return value as UserRole;
  };

  const handleProfileUpdate = async (formData: any) => {
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

  const handleAddRole = async (selectedRole: UserRole | null) => {
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      
      // Check if role already exists
      const roleExists = userRoles.some((r: any) => r.role === selectedRole);
      
      if (roleExists) {
        toast({
          title: 'Role Already Exists',
          description: 'You already have this role assigned to your account.',
          variant: 'destructive',
        });
        return;
      }
      
      // We need to ensure the role value matches one of the valid enum values in Supabase
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
      const convertedRoles = data.map((role: any) => ({
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
      setUserRoles((prev: any) => prev.filter((role: any) => role.id !== roleId));
      
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
      setProfile((prev: any) => {
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
      setProfile((prev: any) => {
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

  return {
    handleInputChange,
    handleRoleChange,
    handleProfileUpdate,
    handleAddRole,
    handleRemoveRole,
    handleDocumentUpload,
    handleSubmitVerification
  };
};
