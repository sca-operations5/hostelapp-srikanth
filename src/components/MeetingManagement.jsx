
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button, buttonVariants } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { PlusCircle, CalendarClock, Trash2, RotateCw } from 'lucide-react';
    import { motion } from "framer-motion";
    import { branchesData } from '@/utils/hostelData';
    import { Skeleton } from "@/components/ui/skeleton";
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const MeetingManagement = () => {
      const [meetings, setMeetings] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isDeleting, setIsDeleting] = useState(null);
      const [newMeeting, setNewMeeting] = useState({
        title: '',
        description: '',
        participants: '',
        start_time: '',
        end_time: '',
        location: '',
        branch: '',
      });
      const { toast } = useToast();
      const branches = branchesData.map(b => b.name);

      const fetchMeetings = useCallback(async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('meetings')
            .select('*')
            .order('start_time', { ascending: true }); // Order by start time

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

        // Setup Supabase real-time subscription
        const channel = supabase.channel('public:meetings')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' },
            (payload) => {
              fetchMeetings(); // Refetch data on any change
            }
          )
          .subscribe();

          // Cleanup subscription on unmount
          return () => {
              supabase.removeChannel(channel);
          };

      }, [fetchMeetings]);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting(prevState => ({ ...prevState, [name]: value }));
      };

      const handleBranchChange = (value) => {
        setNewMeeting(prevState => ({ ...prevState, branch: value }));
      };

      const addMeeting = async (e) => {
        e.preventDefault();
        if (!newMeeting.title || !newMeeting.start_time || !newMeeting.location) {
          toast({
            title: "Missing Information",
            description: "Please fill in Title, Start Time, and Location.",
            variant: "destructive",
          });
          return;
        }

        setIsSubmitting(true);
        try {
          // Format date/time for Supabase (assuming input type="datetime-local")
          const startTimeUTC = new Date(newMeeting.start_time).toISOString();
          const endTimeUTC = newMeeting.end_time ? new Date(newMeeting.end_time).toISOString() : null;

          const { error } = await supabase
            .from('meetings')
            .insert([{
              ...newMeeting,
              start_time: startTimeUTC,
              end_time: endTimeUTC,
            }]);

          if (error) throw error;

          setNewMeeting({ title: '', description: '', participants: '', start_time: '', end_time: '', location: '', branch: '' });
          toast({
            title: "Meeting Scheduled",
            description: `${newMeeting.title} has been successfully scheduled.`,
          });
          // Rely on subscription to update list
        } catch (error) {
           toast({
             title: "Error scheduling meeting",
             description: error.message,
             variant: "destructive",
           });
        } finally {
          setIsSubmitting(false);
        }
      };

      const deleteMeeting = async (meetingId, meetingTitle) => {
        setIsDeleting(meetingId);
        try {
          const { error } = await supabase
            .from('meetings')
            .delete()
            .match({ id: meetingId });

          if (error) throw error;

          toast({
            title: "Meeting Deleted",
            description: `${meetingTitle} has been removed.`,
          });
          // Rely on subscription to update list
        } catch (error) {
          toast({
            title: "Error deleting meeting",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsDeleting(null);
        }
      };

      const upcomingMeetings = meetings.filter(m => new Date(m.start_time) >= new Date());
      const pastMeetings = meetings.filter(m => new Date(m.start_time) < new Date()).sort((a, b) => new Date(b.start_time) - new Date(a.start_time)); // Show recent past first

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-4 md:p-6 space-y-6"
        >
          <h1 className="text-3xl font-bold text-primary">Meeting Management</h1>

          {/* Add Meeting Form */}
          <Card className="bg-gradient-to-br from-green-50 to-cyan-100 shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <PlusCircle className="mr-2 h-6 w-6" /> Schedule New Meeting
              </CardTitle>
            </CardHeader>
            <form onSubmit={addMeeting}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" value={newMeeting.title} onChange={handleInputChange} placeholder="Meeting Title" required />
                </div>
                 <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" name="description" value={newMeeting.description} onChange={handleInputChange} placeholder="Meeting agenda or details" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input id="start_time" name="start_time" type="datetime-local" value={newMeeting.start_time} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time (Optional)</Label>
                  <Input id="end_time" name="end_time" type="datetime-local" value={newMeeting.end_time} onChange={handleInputChange} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={newMeeting.location} onChange={handleInputChange} placeholder="e.g., Conference Room A" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="branch">Branch (Optional)</Label>
                  <Select onValueChange={handleBranchChange} value={newMeeting.branch} name="branch">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Branches</SelectItem>
                      {branches.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="participants">Participants (Optional)</Label>
                  <Input id="participants" name="participants" value={newMeeting.participants} onChange={handleInputChange} placeholder="e.g., Wardens, Floor Incharges" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                  {isSubmitting ? <><RotateCw className="mr-2 h-4 w-4 animate-spin" /> Scheduling...</> : 'Schedule Meeting'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Upcoming Meetings List */}
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-primary">
                <CalendarClock className="mr-2 h-6 w-6" /> Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading && upcomingMeetings.length === 0 && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
              {!isLoading && upcomingMeetings.length === 0 && <p className="text-center text-muted-foreground py-4">No upcoming meetings scheduled.</p>}
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg shadow-sm border bg-background flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-bold">{meeting.title}</h3>
                    {meeting.description && <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2">
                      <span>Location: <span className="font-medium">{meeting.location}</span></span>
                      {meeting.branch && <span>Branch: <span className="font-medium">{meeting.branch}</span></span>}
                      <span>Starts: <span className="font-medium">{new Date(meeting.start_time).toLocaleString()}</span></span>
                      {meeting.end_time && <span>Ends: <span className="font-medium">{new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>}
                      {meeting.participants && <span>Participants: <span className="font-medium">{meeting.participants}</span></span>}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 flex-shrink-0" disabled={isDeleting === meeting.id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the meeting "{meeting.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting === meeting.id}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMeeting(meeting.id, meeting.title)}
                          disabled={isDeleting === meeting.id}
                          className={buttonVariants({ variant: "destructive" })}
                        >
                          {isDeleting === meeting.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              ))}
            </CardContent>
          </Card>

           {/* Past Meetings List (Optional - can be hidden or paginated later) */}
           <Card className="shadow-lg border-none opacity-70">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-muted-foreground">
                 Past Meetings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto">
              {isLoading && pastMeetings.length === 0 && <p className="text-center text-muted-foreground py-4">Loading past meetings...</p>}
              {!isLoading && pastMeetings.length === 0 && <p className="text-center text-muted-foreground py-4">No past meetings found.</p>}
              {pastMeetings.slice(0, 5).map((meeting, index) => ( // Show only last 5 past meetings
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-md border bg-muted/50 flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{meeting.title}</h3>
                     <div className="flex flex-wrap gap-x-3 gap-y-0 text-xs text-muted-foreground mt-1">
                       <span>{meeting.location}</span>
                       {meeting.branch && <span>({meeting.branch})</span>}
                       <span>{new Date(meeting.start_time).toLocaleString()}</span>
                     </div>
                  </div>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 flex-shrink-0 h-auto p-1" disabled={isDeleting === meeting.id}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the meeting "{meeting.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting === meeting.id}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMeeting(meeting.id, meeting.title)}
                          disabled={isDeleting === meeting.id}
                          className={buttonVariants({ variant: "destructive" })}
                        >
                          {isDeleting === meeting.id ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </motion.div>
              ))}
            </CardContent>
          </Card>

        </motion.div>
      );
    };

    export default MeetingManagement;
  