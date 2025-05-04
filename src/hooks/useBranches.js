import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const { toast } = useToast();

  const fetchBranches = useCallback(async () => {
    setIsLoadingBranches(true);
    try {
      const { data, error } = await supabase.from('students').select('branch');
      if (error) throw error;
      const uniqueNames = Array.from(new Set(data.map(item => item.branch)));
      const branchList = await Promise.all(
        uniqueNames.map(async name => {
          const { count: studentCount, error: studentError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('branch', name);
          if (studentError) throw studentError;
          let staffCount = 0;
          // fetch staff count if branch exists in staff table
          try {
            const { count: sc, error: staffError } = await supabase
              .from('staff')
              .select('*', { count: 'exact', head: true })
              .eq('branch', name);
            if (!staffError) staffCount = sc;
          } catch {}
          return { id: name, name, students: studentCount || 0, staff: staffCount };
        })
      );
      setBranches(branchList);
    } catch (error) {
      toast({
        title: 'Error fetching branches',
        description: error.message,
        variant: 'destructive',
      });
      setBranches([]);
    } finally {
      setIsLoadingBranches(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { branches, isLoadingBranches };
}; 