
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";

    export const useStaffCount = () => {
      const [staffCount, setStaffCount] = useState(0);
      const [isLoadingStaff, setIsLoadingStaff] = useState(true);
      const { toast } = useToast();

      const fetchStaffCount = useCallback(async () => {
        setIsLoadingStaff(true);
        try {
          const { count, error, status } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true });

          if (error) {
            // Handle specific errors if possible, otherwise throw generic
            if (status === 401 || status === 403) {
               console.error("Authorization error fetching staff count:", error);
               throw new Error("Permission denied fetching staff count.");
            } else if (error.message.includes('fetch')) {
              console.error("Network error fetching staff count:", error);
              throw new Error("Network error: Could not connect to fetch staff count.");
            }
            throw error; // Re-throw other Supabase errors
          }
          setStaffCount(count || 0);
        } catch (error) {
          console.error("Error caught in fetchStaffCount:", error);
          toast({
            title: "Error Fetching Staff Data",
            description: error.message || "Could not retrieve staff count.",
            variant: "destructive",
          });
          setStaffCount(0); // Reset count on error
        } finally {
          setIsLoadingStaff(false);
        }
      }, [toast]);


      useEffect(() => {
        fetchStaffCount();

         // Optional: Add subscription if real-time updates are needed for count
         // const subscription = supabase.channel('public:staff:count')
         //  .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, fetchStaffCount)
         //  .subscribe();

         // return () => {
         //   supabase.removeChannel(subscription);
         // };

      }, [fetchStaffCount]);

      return { staffCount, isLoadingStaff };
    };
  