
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRoleRecord, UserRole } from '@/types/database.types';
import { KycStatus, VerificationLevel } from '@/types/enums';

export const useProfileData = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
          const completeProfile: Profile = {
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

  return {
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
  };
};
