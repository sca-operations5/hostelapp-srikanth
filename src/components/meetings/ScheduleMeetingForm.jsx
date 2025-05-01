
    import React, { useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { DatePicker } from "@/components/ui/date-picker";
    import { CalendarPlus, Clock, Users, MapPin, Link as LinkIcon } from 'lucide-react';
    import { branchesData as branches } from '@/utils/hostelData';

    const ScheduleMeetingForm = ({ onMeetingAdded }) => {
      const initialMeetingState = {
        title: '',
        description: '',
        participants: '',
        branch: 'all',
        location: '',
        start_date: null,
        start_time: '',
        google_meet_link: ''
      };
      const [newMeeting, setNewMeeting] = useState(initialMeetingState);
      const [staffList, setStaffList] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        const fetchStaff = async () => {
          try {
            const { data, error } = await supabase
              .from('staff')
              .select('name, role');
            if (error) throw error;
            setStaffList(data || []);
          } catch (error) {
            console.error("Error fetching staff list:", error);
          }
        };
        fetchStaff();
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMeeting(prevState => ({ ...prevState, [name]: value }));
      };

      const handleDateChange = (date) => {
        setNewMeeting(prevState => ({ ...prevState, start_date: date }));
      };

      const handleBranchChange = (value) => {
         setNewMeeting(prevState => ({ ...prevState, branch: value }));
      };


      const scheduleMeeting = async (e) => {
        e.preventDefault();
        if (!newMeeting.title || !newMeeting.start_date || !newMeeting.start_time) {
          toast({
            title: "Missing Information",
            description: "Please fill in Title, Start Date, and Start Time.",
            variant: "destructive",
          });
          return;
        }

         let startDateTimeISO = null;
         try {
             const [hours, minutes] = newMeeting.start_time.split(':');
             const startDateTime = new Date(newMeeting.start_date);
             startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
             startDateTimeISO = startDateTime.toISOString();
         } catch (err) {
              toast({
                  title: "Invalid Time",
                  description: "Please enter a valid start time (HH:MM).",
                  variant: "destructive",
              });
              return;
         }


        setIsLoading(true);
        try {
          const meetingData = {
            title: newMeeting.title,
            description: newMeeting.description,
            participants: newMeeting.participants,
            start_time: startDateTimeISO,
            location: newMeeting.location,
            branch: newMeeting.branch === 'all' ? null : newMeeting.branch,
            google_meet_link: newMeeting.google_meet_link || null,
          };

          const { error } = await supabase
            .from('meetings')
            .insert([meetingData]);

          if (error) throw error;

          toast({
            title: "Meeting Scheduled",
            description: `Meeting "${newMeeting.title}" has been successfully scheduled.`,
          });
          setNewMeeting(initialMeetingState);
          if (onMeetingAdded) {
            onMeetingAdded();
          }
        } catch (error) {
          console.error("Error scheduling meeting:", error)
          toast({
            title: "Error Scheduling Meeting",
            description: error.message || "Could not schedule the meeting.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Card className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-100 shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <CalendarPlus className="mr-2 h-6 w-6" /> Schedule New Meeting
            </CardTitle>
          </CardHeader>
          <form onSubmit={scheduleMeeting}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={newMeeting.title} onChange={handleInputChange} placeholder="Meeting Title" required />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <DatePicker date={newMeeting.start_date} setDate={handleDateChange} />
                </div>
               <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input id="start_time" name="start_time" type="time" value={newMeeting.start_time} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" value={newMeeting.description} onChange={handleInputChange} placeholder="Meeting agenda, notes..." />
                </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Input id="participants" name="participants" value={newMeeting.participants} onChange={handleInputChange} placeholder="e.g., Wardens, Incharges, Specific names" />

              </div>

               <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                 <Select onValueChange={handleBranchChange} value={newMeeting.branch} name="branch">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch or All" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All Branches</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={newMeeting.location} onChange={handleInputChange} placeholder="e.g., Conference Room A, Online" />
              </div>
               <div className="space-y-2 md:col-span-2">
                 <Label htmlFor="google_meet_link">Google Meet Link (Optional)</Label>
                 <div className="flex items-center space-x-2">
                    <LinkIcon className="h-5 w-5 text-muted-foreground" />
                    <Input id="google_meet_link" name="google_meet_link" type="url" value={newMeeting.google_meet_link} onChange={handleInputChange} placeholder="Paste Google Meet link here" />
                 </div>
               </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
                {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      );
    };

    export default ScheduleMeetingForm;
  