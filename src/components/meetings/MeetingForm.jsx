
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Textarea } from "@/components/ui/textarea";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { PlusCircle } from 'lucide-react';
    import { branchesData as branches } from '@/utils/hostelData';

    const MeetingForm = ({ onMeetingAdded }) => {
      const [newMeeting, setNewMeeting] = useState({
        title: '',
        description: '',
        participants: '',
        start_time: '',
        end_time: '',
        location: '',
        branch: ''
      });
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

       const handleInputChange = (e) => {
         const { name, value } = e.target;
         setNewMeeting(prevState => ({ ...prevState, [name]: value }));
       };

       const handleBranchChange = (value) => {
         setNewMeeting(prevState => ({ ...prevState, branch: value }));
       };

      const scheduleMeeting = async (e) => {
        e.preventDefault();
        if (!newMeeting.title || !newMeeting.start_time || !newMeeting.location) {
          toast({
            title: "Missing Information",
            description: "Please provide Title, Start Time, and Location.",
            variant: "destructive",
          });
          return;
        }
         // Optional: Validate end_time is after start_time
         if (newMeeting.end_time && newMeeting.start_time && new Date(newMeeting.end_time) <= new Date(newMeeting.start_time)) {
             toast({
                 title: "Invalid Time",
                 description: "End time must be after start time.",
                 variant: "destructive",
             });
             return;
         }

        setIsLoading(true);
        try {
          // Format date/time for Supabase (assuming TIMESTAMPTZ)
          const meetingData = {
            ...newMeeting,
            start_time: new Date(newMeeting.start_time).toISOString(),
            end_time: newMeeting.end_time ? new Date(newMeeting.end_time).toISOString() : null,
          };

          const { data, error } = await supabase
            .from('meetings')
            .insert([meetingData])
            .select();

          if (error) throw error;

          setNewMeeting({ title: '', description: '', participants: '', start_time: '', end_time: '', location: '', branch: '' }); // Reset form
          toast({
            title: "Meeting Scheduled",
            description: `Meeting "${data[0]?.title}" has been scheduled successfully.`,
          });
          if (onMeetingAdded) {
            onMeetingAdded(); // Callback to refresh list
          }
        } catch (error) {
          toast({
            title: "Error scheduling meeting",
            description: error.message,
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
              <PlusCircle className="mr-2 h-6 w-6" /> Schedule New Meeting
            </CardTitle>
             <CardDescription>Fill in the details for the upcoming meeting.</CardDescription>
          </CardHeader>
          <form onSubmit={scheduleMeeting}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input id="title" name="title" value={newMeeting.title} onChange={handleInputChange} placeholder="e.g., Monthly Staff Review" required />
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
                 <Input id="location" name="location" value={newMeeting.location} onChange={handleInputChange} placeholder="e.g., Conference Room B, Online" required />
               </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch (Optional)</Label>
                <Select onValueChange={handleBranchChange} value={newMeeting.branch} name="branch">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch (if specific)" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="">All Branches / General</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="participants">Participants (Optional)</Label>
                <Input id="participants" name="participants" value={newMeeting.participants} onChange={handleInputChange} placeholder="e.g., All Wardens, John Doe, Jane Smith" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description / Agenda (Optional)</Label>
                <Textarea id="description" name="description" rows={3} value={newMeeting.description} onChange={handleInputChange} placeholder="Details about the meeting agenda..." />
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

    export default MeetingForm;
  