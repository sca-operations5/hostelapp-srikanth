
    import React, { useState, useEffect, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";
    import ScheduleMeetingForm from '@/components/meetings/ScheduleMeetingForm';
    import MeetingList from '@/components/meetings/MeetingList';
    import { CalendarClock } from 'lucide-react';

    const Meetings = () => {
      const [meetings, setMeetings] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const fetchMeetings = useCallback(async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .order('start_time', { ascending: false }); // Show newest first

          if (error) throw error;
          setMeetings(data || []);
        } catch (error) {
          toast({
            title: "Error fetching meetings",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }, [toast]);

      useEffect(() => {
        fetchMeetings();
      }, [fetchMeetings]);

      // Realtime subscription
      useEffect(() => {
        const channel = supabase.channel('meetings-channel')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, (payload) => {
            console.log('Change received!', payload);
            fetchMeetings(); // Refetch on any change
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }, [supabase, fetchMeetings]);


      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-4 md:p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
             <h1 className="text-3xl font-bold text-primary flex items-center">
               <CalendarClock className="mr-3 h-8 w-8" /> Meeting Management
             </h1>
          </div>

          <ScheduleMeetingForm onMeetingScheduled={fetchMeetings} />
          <MeetingList
            meetings={meetings}
            isLoading={isLoading}
            onMeetingDeleted={fetchMeetings}
          />
        </motion.div>
      );
    };

    export default Meetings;
  