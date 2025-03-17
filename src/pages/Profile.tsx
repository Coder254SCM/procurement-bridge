
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/enums';
import { Profile as ProfileType, UserRoleRecord } from '@/types/database.types';

const Profile = () => {
  const [loading, setLoading] = useState(true);
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
          setProfile(profileData);
          
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
  }, []);

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
      
      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: selectedRole as unknown as string
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

  if (loading && !profile) {
    return <div className="container py-10">Loading profile data...</div>;
  }

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
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {profile?.verified ? "Verified" : "Pending Verification"}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {profile?.verified 
                    ? "Your account has been fully verified." 
                    : "Your account is pending verification. Complete the required steps below."}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Documents</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="business_registration" />
                    <div className="space-y-1">
                      <Label htmlFor="business_registration" className="font-medium">
                        Business Registration Certificate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload an official business registration document
                      </p>
                      {!profile?.verified && (
                        <Button variant="outline" size="sm" className="mt-1">
                          Upload Document
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="tax_compliance" />
                    <div className="space-y-1">
                      <Label htmlFor="tax_compliance" className="font-medium">
                        Tax Compliance Certificate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload a valid tax compliance certificate from KRA
                      </p>
                      {!profile?.verified && (
                        <Button variant="outline" size="sm" className="mt-1">
                          Upload Document
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox id="director_id" />
                    <div className="space-y-1">
                      <Label htmlFor="director_id" className="font-medium">
                        Director ID/Passport
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Upload a valid identification document for the company director
                      </p>
                      {!profile?.verified && (
                        <Button variant="outline" size="sm" className="mt-1">
                          Upload Document
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            {!profile?.verified && (
              <CardFooter>
                <Button>Submit for Verification</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
