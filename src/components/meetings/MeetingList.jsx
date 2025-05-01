
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button, buttonVariants } from "@/components/ui/button";
    import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { useToast } from "@/components/ui/use-toast";
    import { CalendarDays, Trash2, Download, Link as LinkIcon } from 'lucide-react'; // Added LinkIcon
    import { exportToExcel } from '@/utils/exportToExcel';
    import { format, parseISO } from 'date-fns';
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

    const MeetingList = ({ meetings, isLoading, onMeetingDeleted }) => {
      const [isDeleting, setIsDeleting] = useState(false);
      const { toast } = useToast();

      const deleteMeeting = async (meetingId, meetingTitle) => {
        setIsDeleting(true);
        try {
          const { error } = await supabase
            .from('meetings')
            .delete()
            .match({ id: meetingId });

          if (error) throw error;

          toast({
            title: "Meeting Removed",
            description: `Meeting "${meetingTitle}" has been successfully removed.`,
          });
          if (onMeetingDeleted) {
            onMeetingDeleted(); // Callback to refresh list
          }
        } catch (error) {
           console.error("Error deleting meeting:", error)
          toast({
            title: "Error Removing Meeting",
            description: error.message || "Could not remove the meeting.",
            variant: "destructive",
          });
        } finally {
          setIsDeleting(false);
        }
      };

       const formatMeetingTime = (dateTimeString) => {
         if (!dateTimeString) return '-';
         try {
           const date = parseISO(dateTimeString);
           return format(date, 'PPpp'); // e.g., May 5, 2025, 10:00 AM
         } catch (e) {
           return 'Invalid Time';
         }
       };

       const handleExport = () => {
         if (meetings.length === 0) {
           toast({
             title: "No Data",
             description: "There are no meetings to export.",
             variant: "destructive",
           });
           return;
         }
         const exportData = meetings.map(m => ({
             'Title': m.title,
             'Description': m.description,
             'Participants': m.participants,
             'Start Time': formatMeetingTime(m.start_time),
             'Location': m.location,
             'Branch': m.branch || 'All Branches',
             'Google Meet Link': m.google_meet_link || '-',
             'Scheduled On': new Date(m.created_at).toLocaleDateString(),
         }));
         exportToExcel(exportData, 'Meeting_List');
         toast({
           title: "Export Successful",
           description: "Meeting list exported to Excel.",
         });
       };

      const openMeetLink = (url) => {
         if (url) {
             window.open(url, '_blank', 'noopener,noreferrer');
         } else {
              toast({
                 title: "No Link",
                 description: "No Google Meet link provided for this meeting.",
                 variant: "destructive"
             })
         }
      };


      return (
        <Card className="shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl text-primary">
              <CalendarDays className="mr-2 h-6 w-6" /> Scheduled Meetings
            </CardTitle>
             <Button onClick={handleExport} variant="outline" size="sm" className="ml-auto border-primary text-primary hover:bg-primary/10">
               <Download className="mr-2 h-4 w-4" /> Export to Excel
             </Button>
          </CardHeader>
          <CardContent>
           {isLoading && meetings.length === 0 ? (
               <p className="text-center text-gray-500">Loading meeting data...</p>
            ) : meetings.length === 0 ? (
              <p className="text-center text-gray-500">No meetings scheduled yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Meet Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell className="font-medium">{meeting.title}</TableCell>
                        <TableCell>{formatMeetingTime(meeting.start_time)}</TableCell>
                        <TableCell>{meeting.branch || 'All'}</TableCell>
                        <TableCell>{meeting.location || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{meeting.participants || '-'}</TableCell>
                         <TableCell>
                           {meeting.google_meet_link ? (
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={() => openMeetLink(meeting.google_meet_link)}
                                  title="Open Google Meet Link"
                                >
                                  <LinkIcon className="h-4 w-4" />
                              </Button>
                           ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                           )}
                         </TableCell>
                         <TableCell className="text-right">
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" disabled={isDeleting}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   This action cannot be undone. This will permanently remove the meeting "{meeting.title}".
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => deleteMeeting(meeting.id, meeting.title)}
                                   disabled={isDeleting}
                                   className={buttonVariants({ variant: "destructive" })}
                                  >
                                   {isDeleting ? 'Removing...' : 'Remove'}
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default MeetingList;
  