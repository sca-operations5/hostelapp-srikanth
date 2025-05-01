
    import { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";
    import { calculateComplaintStats } from '@/utils/hostelData';

    export function useComplaints() {
      const { toast } = useToast();
      const [complaintStats, setComplaintStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
      const [recentComplaints, setRecentComplaints] = useState([]);
      const [allComplaints, setAllComplaints] = useState([]);
      const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);

      useEffect(() => {
        const fetchComplaints = async () => {
          setIsLoadingComplaints(true);
          try {
            const { data, error } = await supabase
              .from('complaints')
              .select('*')
              .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
              setAllComplaints(data);
              setComplaintStats(calculateComplaintStats(data));
              setRecentComplaints(data.slice(0, 5)); // Get latest 5
            } else {
              setAllComplaints([]);
              setComplaintStats({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
              setRecentComplaints([]);
            }
          } catch (error) {
            toast({
              title: "Error fetching complaints",
              description: error.message,
              variant: "destructive",
            });
             setAllComplaints([]);
             setComplaintStats({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
             setRecentComplaints([]);
          } finally {
            setIsLoadingComplaints(false);
          }
        };

        fetchComplaints();

        // Setup Supabase real-time subscription
        const channel = supabase.channel('public:complaints')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' },
            (payload) => {
              fetchComplaints(); // Refetch data on any change
            }
          )
          .subscribe();

          // Cleanup subscription on unmount
          return () => {
              supabase.removeChannel(channel);
          };

      }, [toast]);


      // Function to update complaint status
       const updateComplaintStatus = async (id, newStatus) => {
         try {
           const { error } = await supabase
             .from('complaints')
             .update({ status: newStatus })
             .eq('id', id);

           if (error) throw error;

           // Optimistic update (or rely on refetch from subscription)
           setAllComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
           setComplaintStats(calculateComplaintStats(allComplaints.map(c => c.id === id ? { ...c, status: newStatus } : c)));
           setRecentComplaints(allComplaints.map(c => c.id === id ? { ...c, status: newStatus } : c).slice(0, 5));


           toast({
              title: "Status Updated",
              description: "Complaint status has been updated.",
           });
         } catch (error) {
           toast({
             title: "Error updating status",
             description: error.message,
             variant: "destructive",
           });
         }
       };

        // Function to add a new complaint
       const addComplaint = async (newComplaintData) => {
          try {
            const { data, error } = await supabase
              .from('complaints')
              .insert([{ ...newComplaintData, status: 'pending' }]) // Ensure status is set
              .select();

            if (error) throw error;

            // Optimistic update (or rely on refetch from subscription)
             if (data && data.length > 0) {
                const addedComplaint = data[0];
                const updatedList = [addedComplaint, ...allComplaints];
                setAllComplaints(updatedList);
                setComplaintStats(calculateComplaintStats(updatedList));
                setRecentComplaints(updatedList.slice(0, 5));
             }

            toast({
              title: "Complaint Added",
              description: "New complaint has been submitted successfully.",
            });
             return true; // Indicate success
          } catch (error) {
            toast({
              title: "Error Adding Complaint",
              description: error.message,
              variant: "destructive",
            });
             return false; // Indicate failure
          }
        };


      return { allComplaints, recentComplaints, complaintStats, isLoadingComplaints, updateComplaintStatus, addComplaint };
    }
  