
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Briefcase, 
  ClipboardCheck, 
  BarChart4, 
  Users,
  ShoppingBag
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/enums";
import { UserRoleRecord } from "@/types/database.types";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is authenticated
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to access the dashboard",
        });
        navigate('/');
        return;
      }
      
      if (!data.session) {
        toast({
          variant: "destructive",
          title: "Not Authenticated",
          description: "Please log in to access the dashboard",
        });
        navigate('/');
        return;
      }
      
      setSession(data.session);
      
      // Fetch user roles from the user_roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id);
        
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load user roles",
        });
      } else if (rolesData) {
        setUserRoles(rolesData.map((r: { role: string }) => r.role));
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [navigate, toast]);

  const renderRoleBasedContent = () => {
    if (userRoles.includes('buyer')) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tenders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No active tenders yet
              </p>
              <Button size="sm" className="mt-4 w-full">
                <Link to="/create-tender">Create Tender</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Evaluations</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No pending evaluations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No verified suppliers yet
              </p>
              <Button size="sm" className="mt-4 w-full" variant="outline">
                <Link to="/supplier-marketplace">Browse Suppliers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (userRoles.includes('supplier')) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Tenders</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No available tenders yet
              </p>
              <Button size="sm" className="mt-4 w-full">
                <Link to="/tenders">Browse Tenders</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Bids</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No bids submitted yet
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium text-amber-500">Pending Verification</div>
              <p className="text-xs text-muted-foreground mt-1">
                Complete your profile to get verified
              </p>
              <Button size="sm" className="mt-4 w-full" variant="outline">
                <Link to="/profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (userRoles.some(role => role.startsWith('evaluator_'))) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Evaluations</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No pending evaluations
              </p>
              <Button size="sm" className="mt-4 w-full">
                <Link to="/evaluations">View All</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Evaluations</CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                No evaluations completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Specialization</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {userRoles.find(role => role.startsWith('evaluator_'))
                  .replace('evaluator_', '')
                  .replace(/^\w/, c => c.toUpperCase())}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Expert evaluator
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Default content for users without specific roles or for admin
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Your Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mt-1">
              Set up your profile and select your role to get started
            </p>
            <Button size="sm" className="mt-4 w-full">
              <Link to="/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Browse Tenders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mt-1">
              Explore available tenders on the platform
            </p>
            <Button size="sm" className="mt-4 w-full" variant="outline">
              <Link to="/tenders">View Tenders</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supplier Marketplace</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mt-1">
              Discover verified suppliers on the platform
            </p>
            <Button size="sm" className="mt-4 w-full" variant="outline">
              <Link to="/supplier-marketplace">Browse Suppliers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
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
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Button asChild>
              {userRoles.includes(UserRole.BUYER) ? (
                <Link to="/create-tender">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Tender
                </Link>
              ) : userRoles.includes(UserRole.SUPPLIER) ? (
                <Link to="/tenders">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Browse Tenders
                </Link>
              ) : (
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Complete Setup
                </Link>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenders">Tenders</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to ProcureChain</CardTitle>
                <CardDescription>
                  Your blockchain-based procurement platform. Here's your overview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderRoleBasedContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tenders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tenders</CardTitle>
                <CardDescription>
                  View and manage tender opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-secondary p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">No Tenders Available</h3>
                  <p className="text-muted-foreground mb-4">
                    {userRoles.includes(UserRole.BUYER) 
                      ? "You haven't created any tenders yet." 
                      : "There are no tender opportunities available at the moment."}
                  </p>
                  {userRoles.includes(UserRole.BUYER) && (
                    <Button asChild>
                      <Link to="/create-tender">Create Your First Tender</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="marketplace" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Marketplace</CardTitle>
                <CardDescription>
                  Browse and connect with verified suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-secondary p-8 text-center">
                  <h3 className="text-xl font-semibold mb-2">Marketplace Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Our supplier marketplace is being built. Check back soon to connect with verified suppliers.
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/profile">Complete Your Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
