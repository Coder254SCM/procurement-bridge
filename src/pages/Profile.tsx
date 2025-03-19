
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, KycStatus, VerificationLevel, BusinessType } from '@/types/enums';
import { Profile as ProfileType, UserRoleRecord } from '@/types/database.types';
import { UploadCloud, Loader2 } from 'lucide-react';

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
            full_name: profileData.full_name || null,
            company_name: profileData.company_name || null,
            position: profileData.position || null,
            industry: profileData.industry || null,
            verified: profileData.verified || false,
            kyc_status: profileData.kyc_status as KycStatus || KycStatus.PENDING,
            kyc_documents: profileData.kyc_documents || null,
            created_at: profileData.created_at || new Date().toISOString(),
            updated_at: profileData.updated_at || new Date().toISOString(),
            // Add default values for missing fields from the database
            verification_level: profileData.verification_level as VerificationLevel || VerificationLevel.NONE,
            business_type: profileData.business_type as BusinessType || null,
            business_registration_number: profileData.business_registration_number || null,
            tax_pin: profileData.tax_pin || null,
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
            ...role,
            role: role.role as UserRole
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
      
      if (!validDbRoles.includes(selectedRole.toLowerCase())) {
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
          role: selectedRole.toLowerCase() as any
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
        ...role,
        role: role.role as UserRole
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

  if (loading && !profile) {
    return <div className="container py-10">Loading profile data...</div>;
  }

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
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
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
        </TabsContent>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Manage your roles in the procurement system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Current Roles</h3>
                {userRoles.length === 0 ? (
                  <p className="text-muted-foreground">You don't have any roles assigned yet.</p>
                ) : (
                  <div className="space-y-2">
                    {userRoles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                        <span className="font-medium">{role.role}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveRole(role.id)}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Add New Role</h3>
                <div className="flex gap-4">
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.BUYER}>Buyer</SelectItem>
                      <SelectItem value={UserRole.SUPPLIER}>Supplier</SelectItem>
                      <SelectItem value={UserRole.EVALUATOR_FINANCE}>Financial Evaluator</SelectItem>
                      <SelectItem value={UserRole.EVALUATOR_TECHNICAL}>Technical Evaluator</SelectItem>
                      <SelectItem value={UserRole.EVALUATOR_PROCUREMENT}>Procurement Evaluator</SelectItem>
                      <SelectItem value={UserRole.EVALUATOR_ENGINEERING}>Engineering Evaluator</SelectItem>
                      <SelectItem value={UserRole.EVALUATOR_LEGAL}>Legal Evaluator</SelectItem>
                      <SelectItem value={UserRole.EVALUATOR_ACCOUNTING}>Accounting Evaluator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddRole} disabled={!selectedRole || loading}>
                    Add Role
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <CardDescription>
                Complete verification to access all features of the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Verification Status</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile?.verified 
                      ? "bg-green-100 text-green-800" 
                      : profile?.kyc_status === KycStatus.UNDER_REVIEW
                        ? "bg-blue-100 text-blue-800"
                        : profile?.kyc_status === KycStatus.SUBMITTED
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                  }`}>
                    {profile?.verified 
                      ? "Verified" 
                      : profile?.kyc_status === KycStatus.UNDER_REVIEW
                        ? "Under Review"
                        : profile?.kyc_status === KycStatus.SUBMITTED
                          ? "Submitted"
                          : "Pending Verification"}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {profile?.verified 
                    ? "Your account has been fully verified." 
                    : profile?.kyc_status === KycStatus.UNDER_REVIEW
                      ? "Your documents are being reviewed by our team."
                      : profile?.kyc_status === KycStatus.SUBMITTED
                        ? "Your documents have been submitted. Please submit for verification when all required documents are uploaded."
                        : "Your account is pending verification. Complete the required steps below."}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Documents</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="business_registration" 
                      checked={hasDocument('business_registration')}
                      disabled={true}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="business_registration" className="font-medium">
                        Business Registration Certificate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload an official business registration document
                      </p>
                      {(!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW) && (
                        <div className="mt-1">
                          <Label
                            htmlFor="business_registration_upload"
                            className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                              hasDocument('business_registration') 
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            } cursor-pointer`}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                {hasDocument('business_registration') ? 'Replace Document' : 'Upload Document'}
                              </>
                            )}
                          </Label>
                          <input
                            id="business_registration_upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleDocumentUpload(e, 'business_registration')}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {hasDocument('business_registration') && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Status: {getDocumentStatus('business_registration')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="tax_compliance" 
                      checked={hasDocument('tax_compliance')}
                      disabled={true}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="tax_compliance" className="font-medium">
                        Tax Compliance Certificate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload a valid tax compliance certificate
                      </p>
                      {(!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW) && (
                        <div className="mt-1">
                          <Label
                            htmlFor="tax_compliance_upload"
                            className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                              hasDocument('tax_compliance') 
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            } cursor-pointer`}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                {hasDocument('tax_compliance') ? 'Replace Document' : 'Upload Document'}
                              </>
                            )}
                          </Label>
                          <input
                            id="tax_compliance_upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleDocumentUpload(e, 'tax_compliance')}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {hasDocument('tax_compliance') && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Status: {getDocumentStatus('tax_compliance')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="director_id" 
                      checked={hasDocument('director_id')}
                      disabled={true}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="director_id" className="font-medium">
                        Director ID/Passport
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload a valid identification document for the company director
                      </p>
                      {(!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW) && (
                        <div className="mt-1">
                          <Label
                            htmlFor="director_id_upload"
                            className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                              hasDocument('director_id') 
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            } cursor-pointer`}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                {hasDocument('director_id') ? 'Replace Document' : 'Upload Document'}
                              </>
                            )}
                          </Label>
                          <input
                            id="director_id_upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleDocumentUpload(e, 'director_id')}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {hasDocument('director_id') && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Status: {getDocumentStatus('director_id')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="blockchain_consent" 
                      checked={hasDocument('blockchain_consent')}
                      disabled={true}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="blockchain_consent" className="font-medium">
                        Blockchain Data Consent Form
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload the signed consent form for storing verification hashes on blockchain
                      </p>
                      {(!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW) && (
                        <div className="mt-1">
                          <Label
                            htmlFor="blockchain_consent_upload"
                            className={`inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                              hasDocument('blockchain_consent') 
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            } cursor-pointer`}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                {hasDocument('blockchain_consent') ? 'Replace Document' : 'Upload Document'}
                              </>
                            )}
                          </Label>
                          <input
                            id="blockchain_consent_upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => handleDocumentUpload(e, 'blockchain_consent')}
                            disabled={uploading}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          {hasDocument('blockchain_consent') && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Status: {getDocumentStatus('blockchain_consent')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            {!profile?.verified && profile?.kyc_status !== KycStatus.UNDER_REVIEW && (
              <CardFooter>
                <Button 
                  onClick={handleSubmitVerification} 
                  disabled={loading || 
                            !hasDocument('business_registration') || 
                            !hasDocument('tax_compliance') || 
                            !hasDocument('director_id')}
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Blockchain and KYC Information Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Blockchain Verification</CardTitle>
          <CardDescription>
            Your documents are verified using a secure, free blockchain integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This platform uses Hyperledger Fabric - an open-source, permissioned blockchain framework - to securely verify and store 
              document hashes without any gas fees. This provides enterprise-grade security and immutability for your KYC verification.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Key Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Completely free, with no gas fees or transaction costs</li>
                <li>Private, permissioned blockchain network for enterprise security</li>
                <li>Document integrity verification through cryptographic hashing</li>
                <li>Immutable audit trail of all document verifications</li>
                <li>Compliance with regulatory requirements through verifiable records</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Only document hashes are stored on the blockchain, not the actual files, ensuring your data remains private while providing
              cryptographic proof of document integrity and timestamp verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
