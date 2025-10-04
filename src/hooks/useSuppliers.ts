
import { useState, useEffect } from 'react';
import { SupplierProps } from '@/components/marketplace/SupplierCard';
import { VerificationDetails } from '@/components/marketplace/SupplierVerificationBadge';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Fetch suppliers (users with supplier role)
        const { data: supplierRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'supplier');

        if (rolesError) throw rolesError;

        const supplierIds = supplierRoles.map(r => r.user_id);

        // Fetch supplier profiles with verification details
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            company_name,
            industry,
            verification_level,
            verification_status
          `)
          .in('id', supplierIds)
          .not('company_name', 'is', null);

        if (profilesError) throw profilesError;

        // Transform to SupplierProps format
        const formattedSuppliers: SupplierProps[] = (profilesData || []).map(profile => {
          
          // Map verification_level to VerificationLevel type
          const verificationLevel: 'basic' | 'standard' | 'advanced' = 
            profile.verification_level === 'standard' ? 'standard' :
            profile.verification_level === 'advanced' ? 'advanced' : 'basic';
          
          return {
            id: profile.id,
            name: profile.company_name || 'Unnamed Supplier',
            category: profile.industry || 'General',
            location: 'Kenya',
            verified: profile.verification_status === 'verified',
            rating: 0, // Can be calculated from evaluations
            completedProjects: 0, // Can be calculated from contracts
            description: `${profile.company_name} - Verified supplier on the platform`,
            contact: '',
            verification: {
              status: (profile.verification_status as 'verified' | 'pending' | 'unverified' | 'rejected') || 'pending',
              level: verificationLevel,
              verificationScore: profile.verification_status === 'verified' ? 85 : 65,
              completedProjects: 0,
              performanceRating: 0
            }
          };
        });

        setSuppliers(formattedSuppliers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return { suppliers, loading };
}
