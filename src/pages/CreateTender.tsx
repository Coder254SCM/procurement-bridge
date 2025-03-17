
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TenderForm from '@/components/tenders/TenderForm';

const CreateTender = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBuyer, setIsBuyer] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          variant: "destructive",
          title: "Not Authenticated",
          description: "Please log in to create a tender",
        });
        navigate('/');
        return;
      }
      
      setSession(data.session);
      
      // Check if user has buyer role
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id);
        
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify your permissions",
        });
      } else if (rolesData) {
        const roles = rolesData.map((r: { role: string }) => r.role);
        setIsBuyer(roles.includes('buyer'));
        
        if (!roles.includes('buyer')) {
          toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "Only buyers can create tenders",
          });
          navigate('/dashboard');
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isBuyer) {
    return null; // Will navigate away in useEffect
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
      
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Tender</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to create a new tender request for suppliers.
          </p>
        </div>
        
        <TenderForm userId={session.user.id} />
      </div>
    </div>
  );
};

export default CreateTender;
