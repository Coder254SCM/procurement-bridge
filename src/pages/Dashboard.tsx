import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const redirectToRoleDashboard = async () => {
      if (authLoading) return;
      
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        // Fetch user roles
        const { data: rolesData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        const roles = rolesData?.map(r => r.role) || [];

        // Redirect based on primary role
        if (roles.includes('buyer')) {
          navigate('/buyer-dashboard', { replace: true });
        } else if (roles.includes('supplier')) {
          navigate('/supplier-dashboard', { replace: true });
        } else if (roles.some(role => role.startsWith('evaluator_'))) {
          navigate('/evaluator-dashboard', { replace: true });
        } else {
          // Default to supplier dashboard for new users
          navigate('/supplier-dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        navigate('/supplier-dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    redirectToRoleDashboard();
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Redirecting to your dashboard...</span>
      </div>
    </div>
  );
};

export default Dashboard;
