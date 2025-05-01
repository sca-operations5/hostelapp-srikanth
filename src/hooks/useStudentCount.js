
    import { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";

    export const useStudentCount = () => {
      const [studentCount, setStudentCount] = useState(0);
      const [isLoadingStudents, setIsLoadingStudents] = useState(true);
      const { toast } = useToast();

       const fetchStudentCount = useCallback(async () => {
         setIsLoadingStudents(true);
         try {
           const { count, error, status } = await supabase
             .from('students')
             .select('*', { count: 'exact', head: true });

           if (error) {
             if (status === 401 || status === 403) {
               console.error("Authorization error fetching student count:", error);
               throw new Error("Permission denied fetching student count.");
             } else if (error.message.includes('fetch')) {
               console.error("Network error fetching student count:", error);
               throw new Error("Network error: Could not connect to fetch student count.");
             }
             throw error;
           }
           setStudentCount(count || 0);
         } catch (error) {
           console.error("Error caught in fetchStudentCount:", error);
           toast({
             title: "Error Fetching Student Data",
             description: error.message || "Could not retrieve student count.",
             variant: "destructive",
           });
           setStudentCount(0); // Reset on error
         } finally {
           setIsLoadingStudents(false);
         }
       }, [toast]);

      useEffect(() => {
        fetchStudentCount();

        // Keep the existing subscription to update count in real-time
        const subscription = supabase.channel('public:students:count') // Use a slightly different channel name
          .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
            console.log('Student count change detected, refetching...');
            fetchStudentCount();
          })
          .subscribe((status, err) => {
            if (err) {
              console.error("Student count subscription error:", err);
              toast({
                  title: "Real-time Error",
                  description: "Could not listen for student updates.",
                  variant: "destructive",
              });
            }
          });


        return () => {
          supabase.removeChannel(subscription).catch(err => console.error("Error removing student count channel", err));
        };

      }, [fetchStudentCount, toast]);

      return { studentCount, isLoadingStudents };
    };
  