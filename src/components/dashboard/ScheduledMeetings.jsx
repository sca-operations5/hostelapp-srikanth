
    import React, { useState, useEffect, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { CalendarClock, MapPin, Clock, Link as LinkIcon } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';
    import { format, parseISO } from 'date-fns';
    import { Skeleton } from "@/components/ui/skeleton";
    import { Button } from "@/components/ui/button";
    import { useToast } from "@/components/ui/use-toast"; // Import useToast

    const ScheduledMeetings = () => {
      const [meetings, setMeetings] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const { toast } = useToast(); // Get toast function

      const fetchUpcomingMeetings = useCallback(async () => {
        setIsLoading(true);
        try {
          const now = new Date().toISOString();
          const { data, error, status } = await supabase
            .from('meetings')
            .select('id, title, branch, start_time, location, google_meet_link') // Added google_meet_link
            .gte('start_time', now)
            .order('start_time', { ascending: true })
            .limit(3);

          if (error) {
            if (status === 401 || status === 403) {
               console.error("Authorization error fetching meetings:", error);
               throw new Error("Permission denied fetching upcoming meetings.");
            } else if (error.message.includes('fetch')) {
              console.error("Network error fetching meetings:", error);
              throw new Error("Network error: Could not connect to fetch meetings.");
            }
            throw error;
          }
          setMeetings(data || []);
        } catch (error) {
          console.error("Error fetching upcoming meetings:", error);
          toast({ // Use toast for error feedback
            title: "Error Fetching Meetings",
            description: error.message || "Could not retrieve upcoming meetings.",
            variant: "destructive",
          });
          setMeetings([]); // Clear meetings on error
        } finally {
          setIsLoading(false);
        }
      }, [toast]); // Add toast to dependencies

      useEffect(() => {
        fetchUpcomingMeetings();

        const channel = supabase.channel('dashboard-meetings-channel')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, (payload) => {
            console.log('Dashboard meetings change received!', payload);
            fetchUpcomingMeetings();
          })
          .subscribe((status, err) => { // Add error handling for subscription
             if (err) {
               console.error("Meeting subscription error:", err);
               toast({
                 title: "Real-time Error",
                 description: "Could not listen for meeting updates.",
                 variant: "destructive",
               });
             }
          });


        return () => {
          supabase.removeChannel(channel).catch(err => console.error("Error removing meetings channel", err));
        };

      }, [fetchUpcomingMeetings, toast]); // Add toast to dependencies

      const formatMeetingTime = (dateTimeString) => {
         if (!dateTimeString) return '';
         try {
           const date = parseISO(dateTimeString);
           return format(date, 'MMM d, p');
         } catch (e) {
           return 'Invalid Time';
         }
      };

      const openMeetLink = (url) => {
         if (url) {
             window.open(url, '_blank', 'noopener,noreferrer');
         }
      };


      return (
        <Card className="shadow-md border-none bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-primary">
              <CalendarClock className="mr-2 h-5 w-5" />
              Upcoming Scheduled Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                  <Skeleton className="h-20 w-full rounded-md" />
                </>
              ) : meetings.length > 0 ? (
                meetings.map((meeting, i) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 bg-background/50 rounded-md border border-primary/10 shadow-sm flex flex-col space-y-1"
                  >
                    <p className="font-semibold text-sm text-primary">{meeting.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      {formatMeetingTime(meeting.start_time)}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
                      {meeting.location || 'No location specified'} {meeting.branch ? `(${meeting.branch})` : ''}
                    </p>
                     {meeting.google_meet_link && (
                        <Button
                            variant="link"
                            size="sm"
                            className="text-xs h-auto p-0 justify-start text-blue-600 hover:text-blue-800"
                            onClick={() => openMeetLink(meeting.google_meet_link)}
                        >
                            <LinkIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                            Join Google Meet
                        </Button>
                     )}
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming meetings scheduled.</p>
              )}
            </div>
          </CardContent>
        </Card>
      );
    };

    export default ScheduledMeetings;
  