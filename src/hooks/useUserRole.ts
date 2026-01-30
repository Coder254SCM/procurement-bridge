import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'buyer' | 'supplier' | 'evaluator_technical' | 'evaluator_financial' | 'evaluator_compliance' | 'admin';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [primaryRole, setPrimaryRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user) {
        setRoles([]);
        setPrimaryRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) throw error;

        const userRoles = (data || []).map(r => r.role as UserRole);
        setRoles(userRoles);

        // Determine primary role (priority: buyer > supplier > evaluator)
        if (userRoles.includes('buyer')) {
          setPrimaryRole('buyer');
        } else if (userRoles.includes('supplier')) {
          setPrimaryRole('supplier');
        } else if (userRoles.some(r => r.startsWith('evaluator_'))) {
          setPrimaryRole(userRoles.find(r => r.startsWith('evaluator_')) as UserRole);
        } else if (userRoles.includes('admin')) {
          setPrimaryRole('admin');
        } else {
          setPrimaryRole('supplier'); // Default
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setPrimaryRole('supplier'); // Default on error
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [user]);

  const isBuyer = roles.includes('buyer') || roles.includes('admin');
  const isSupplier = roles.includes('supplier');
  const isEvaluator = roles.some(r => r.startsWith('evaluator_'));
  const isAdmin = roles.includes('admin');

  return {
    roles,
    primaryRole,
    loading,
    isBuyer,
    isSupplier,
    isEvaluator,
    isAdmin
  };
};
