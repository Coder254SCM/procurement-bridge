
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SessionData {
  loading: boolean;
  session: any;
  userRoles: string[];
  isEvaluator: boolean;
}

export function useEvaluationSession(): SessionData {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isEvaluator, setIsEvaluator] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "Please log in to evaluate bids",
          });
          navigate('/');
          return;
        }
        
        setSession(data.session);
        
        // Check user roles
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
          return;
        }
        
        if (rolesData) {
          const roles = rolesData.map((r: { role: string }) => r.role);
          setUserRoles(roles);
          
          // Check if user has any evaluator role
          const hasEvaluatorRole = roles.some(role => role.includes('evaluator_'));
          setIsEvaluator(hasEvaluatorRole);
          
          if (!hasEvaluatorRole) {
            toast({
              variant: "destructive",
              title: "Permission Denied",
              description: "Only evaluators can access this page",
            });
            navigate('/dashboard');
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate, toast]);

  return {
    loading,
    session,
    userRoles,
    isEvaluator
  };
}
