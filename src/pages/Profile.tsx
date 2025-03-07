
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/enums";
import { Profile as ProfileType } from "@/types/database.types";

const INDUSTRIES = [
  "Agriculture",
  "Construction",
  "Education",
  "Energy",
  "Finance",
  "Food & Beverage",
  "Government",
  "Healthcare",
  "Information Technology",
  "Manufacturing",
  "Mining",
  "Professional Services",
  "Real Estate",
  "Telecommunications",
  "Transportation",
  "Other"
];

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<ProfileType>>({});
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [availableRoles, setAvailableRoles] = useState([
    { role: UserRole.BUYER, label: "Buyer/Procurement Entity" },
    { role: UserRole.SUPPLIER, label: "Supplier/Vendor" },
    { role: UserRole.EVALUATOR_FINANCE, label: "Financial Evaluator (Accountant)" },
    { role: UserRole.EVALUATOR_TECHNICAL, label: "Technical Evaluator (Engineer)" },
    { role: UserRole.EVALUATOR_PROCUREMENT, label: "Procurement Evaluator" }
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to access your profile",
        });
        navigate('/');
        return;
      }
      
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') { // Not found is OK for new users
        console.error("Error fetching profile:", profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your profile",
        });
      } else if (profileData) {
        setProfile(profileData);
      }
      
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role');
        
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
      } else if (rolesData) {
        setSelectedRoles(rolesData.map(r => r.role as UserRole));
      }
      
      setLoading(false);
    };
    
    fetchProfile();
  }, [navigate, toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', profile.id);
        
      if (profileError) throw profileError;
      
      // Get current user roles
      const { data: currentRoles, error: fetchError } = await supabase
        .from('user_roles')
        .select('role');
        
      if (fetchError) throw fetchError;
      
      const currentRoleValues = currentRoles?.map(r => r.role) || [];
      
      // Add new roles
      for (const role of selectedRoles) {
        if (!currentRoleValues.includes(role)) {
          const { error } = await supabase
            .from('user_roles')
            .insert({ role });
            
          if (error) throw error;
        }
      }
      
      // Remove unselected roles
      for (const role of currentRoleValues) {
        if (!selectedRoles.includes(role as UserRole)) {
          const { error } = await supabase
            .from('user_roles')
            .delete()
            .eq('role', role);
            
          if (error) throw error;
        }
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update your profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles(prev => 
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>
        
        <form onSubmit={handleProfileUpdate}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal and company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={profile.full_name || ''} 
                      onChange={e => setProfile({...profile, full_name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company/Organization</Label>
                    <Input 
                      id="companyName" 
                      value={profile.company_name || ''} 
                      onChange={e => setProfile({...profile, company_name: e.target.value})}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title</Label>
                    <Input 
                      id="position" 
                      value={profile.position || ''} 
                      onChange={e => setProfile({...profile, position: e.target.value})}
                      placeholder="Enter your job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={profile.industry || ''} 
                      onValueChange={value => setProfile({...profile, industry: value})}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>Select the roles that apply to you in the procurement process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableRoles.map(({ role, label }) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`role-${role}`}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={() => toggleRole(role)}
                      />
                      <Label htmlFor={`role-${role}`} className="cursor-pointer">{label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Verification Status</CardTitle>
                    <CardDescription>Your account verification status</CardDescription>
                  </div>
                  {profile.verified ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-500">
                      <AlertTriangle className="h-5 w-5 mr-1" />
                      <span>Pending</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {profile.verified 
                    ? "Your account is verified. You have full access to all features."
                    : "Your account is pending verification. Some features may be limited until verification is complete."}
                </p>
                {!profile.verified && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Verification Documents</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please upload the required documents for verification.
                    </p>
                    {/* Document upload functionality will be implemented later */}
                    <Button variant="outline" disabled>Upload Documents (Coming Soon)</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
