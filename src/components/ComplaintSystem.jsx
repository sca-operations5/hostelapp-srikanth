
    import React, { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { useNotifications } from "@/contexts/NotificationContext";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download, RotateCw, Ban, Check } from "lucide-react";
    import { useComplaints } from "@/hooks/useComplaints"; // Import the hook
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Textarea } from "@/components/ui/textarea";
    import { Skeleton } from "@/components/ui/skeleton";

    function ComplaintSystem() {
      // Use the custom hook to manage complaints
      const { allComplaints, isLoadingComplaints, updateComplaintStatus, addComplaint } = useComplaints();
      const [newComplaint, setNewComplaint] = useState({
        title: "",
        description: "",
        location: "",
        priority: "medium"
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const { toast } = useToast();
      const { addNotification } = useNotifications();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await addComplaint(newComplaint);

        if (success) {
          addNotification({
            title: `New ${newComplaint.priority} priority complaint`,
            description: `${newComplaint.title} - ${newComplaint.location}`,
            priority: newComplaint.priority,
            type: "complaint"
          });

          setNewComplaint({
            title: "",
            description: "",
            location: "",
            priority: "medium"
          });
        }
        setIsSubmitting(false);
      };

      const handleStatusChange = (id, newStatus, complaintTitle, complaintPriority) => {
        updateComplaintStatus(id, newStatus); // Call the update function from the hook

        addNotification({
            title: `Complaint Status Updated`,
            description: `${complaintTitle} is now ${newStatus.replace('-', ' ')}`,
            priority: complaintPriority,
            type: "status_update"
          });
      };

      const handleExport = () => {
        if (allComplaints.length === 0) {
          toast({ title: "No Data", description: "There are no complaints to export.", variant: "destructive" });
          return;
        }
        const dataToExport = allComplaints.map(({ id, created_at, ...rest }) => ({
          ...rest,
          date: created_at ? new Date(created_at).toLocaleString() : 'N/A' // Format date
        }));
        exportToExcel(dataToExport, "ComplaintsLog");
         toast({ title: "Export Successful", description: "Complaints log exported to Excel." });
      };

      const getStatusColor = (status) => {
        switch (status) {
          case "pending": return "border-yellow-500 bg-yellow-500/10";
          case "in-progress": return "border-blue-500 bg-blue-500/10";
          case "resolved": return "border-green-500 bg-green-500/10";
          default: return "border-gray-300 bg-gray-50";
        }
      };

      const getPriorityColor = (priority) => {
         switch (priority) {
           case "low": return "text-green-600";
           case "medium": return "text-yellow-600";
           case "high": return "text-red-600";
           default: return "text-gray-600";
         }
      };


      return (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="container mx-auto p-4 md:p-6 space-y-6"
         >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-primary">Complaint Management</h1>
            <Button onClick={handleExport} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Download className="mr-2 h-4 w-4" /> Export to Excel
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Submit New Complaint</CardTitle>
              <CardDescription>Report any issues or concerns you have.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title" required placeholder="e.g., Leaking tap in Room 101"
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                     id="description" required placeholder="Provide more details about the issue."
                    rows="3"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location" required placeholder="e.g., Room 101, Common Area 2nd Floor"
                    value={newComplaint.location}
                    onChange={(e) => setNewComplaint({...newComplaint, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                   <Select
                      value={newComplaint.priority}
                      onValueChange={(value) => setNewComplaint({...newComplaint, priority: value})}
                      name="priority"
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white">
                     {isSubmitting ? <><RotateCw className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Complaint'}
                   </Button>
              </CardFooter>
            </form>
          </Card>

           <Card className="shadow-lg border-none">
              <CardHeader>
                  <CardTitle className="text-xl text-primary">Complaints List</CardTitle>
                  <CardDescription>Track the status of submitted complaints.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingComplaints && (
                   Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full rounded-lg" />
                    ))
                 )}
                 {!isLoadingComplaints && allComplaints.length === 0 && (
                     <p className="text-center text-muted-foreground py-4">No complaints submitted yet.</p>
                 )}
                 {!isLoadingComplaints && allComplaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg shadow-sm border ${getStatusColor(complaint.status)}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold">{complaint.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2">
                            <span>Location: <span className="font-medium">{complaint.location}</span></span>
                            <span className={getPriorityColor(complaint.priority)}>Priority: <span className="font-medium uppercase">{complaint.priority}</span></span>
                            <span>Status: <span className="font-medium capitalize">{complaint.status.replace('-', ' ')}</span></span>
                            <span className="text-muted-foreground">Date: {complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'N/A'}</span>
                        </div>
                      </div>
                       <div className="flex items-center space-x-2 flex-shrink-0">
                         <Button
                            size="sm" variant={complaint.status === "pending" ? "destructive" : "outline"} className="px-2 py-1 h-auto"
                            onClick={() => handleStatusChange(complaint.id, "pending", complaint.title, complaint.priority)}
                            disabled={complaint.status === "pending"}
                         >
                           <Ban className="h-3 w-3 mr-1"/> Pending
                         </Button>
                         <Button
                           size="sm" variant={complaint.status === "in-progress" ? "default" : "outline"} className="px-2 py-1 h-auto"
                           onClick={() => handleStatusChange(complaint.id, "in-progress", complaint.title, complaint.priority)}
                            disabled={complaint.status === "in-progress"}
                         >
                           <RotateCw className="h-3 w-3 mr-1"/> In Progress
                         </Button>
                         <Button
                           size="sm" variant={complaint.status === "resolved" ? "secondary" : "outline"} className="px-2 py-1 h-auto"
                           onClick={() => handleStatusChange(complaint.id, "resolved", complaint.title, complaint.priority)}
                            disabled={complaint.status === "resolved"}
                         >
                           <Check className="h-3 w-3 mr-1"/> Resolved
                         </Button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
           </Card>
        </motion.div>
      );
    }

    export default ComplaintSystem;
  