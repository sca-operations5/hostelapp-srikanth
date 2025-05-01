
      import React, { useState } from 'react';
      import { motion } from 'framer-motion';
      import { Button, buttonVariants } from "@/components/ui/button";
      import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
      import { Skeleton } from "@/components/ui/skeleton";
      import { exportToExcel } from "@/utils/exportToExcel";
      import { Download, RotateCw, Ban, Check, Trash2 } from "lucide-react";
      import { useToast } from "@/components/ui/use-toast";
      import { useNotifications } from "@/contexts/NotificationContext";
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

      const ComplaintList = ({ complaints, isLoading, updateStatus, deleteComplaint, refreshComplaints }) => {
          const [isDeleting, setIsDeleting] = useState(null); // Track which complaint is being deleted
          const { toast } = useToast();
           const { addNotification } = useNotifications();


           const handleStatusChange = (id, newStatus, complaintTitle, complaintPriority) => {
              updateStatus(id, newStatus); // Call the update function passed as prop
              addNotification({
                  title: `Complaint Status Updated`,
                  description: `${complaintTitle} is now ${newStatus.replace('-', ' ')}`,
                  priority: complaintPriority,
                  type: "status_update"
              });
          };

          const handleDelete = async (id) => {
              setIsDeleting(id);
              const success = await deleteComplaint(id); // Call delete function passed as prop
              // deleteComplaint hook handles success/error toasts internally
              setIsDeleting(null); // Reset deleting state
              if (success && refreshComplaints) {
                  // Optionally refresh if the hook doesn't trigger automatically via subscription
                  // refreshComplaints();
              }
          };

          const handleExport = () => {
              if (complaints.length === 0) {
                  toast({ title: "No Data", description: "There are no complaints to export.", variant: "destructive" });
                  return;
              }
              const dataToExport = complaints.map(({ id, created_at, user_id, ...rest }) => ({
                  Title: rest.title,
                  Description: rest.description,
                  Location: rest.location,
                  Priority: rest.priority,
                  Status: rest.status,
                  Date: created_at ? new Date(created_at).toLocaleString() : 'N/A'
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
              <Card className="shadow-lg border-none">
                  <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                          <CardTitle className="text-xl text-primary">Complaints List</CardTitle>
                          <CardDescription>Track the status of submitted complaints.</CardDescription>
                      </div>
                       <Button onClick={handleExport} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                          <Download className="mr-2 h-4 w-4" /> Export to Excel
                       </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {isLoading && (
                          Array.from({ length: 3 }).map((_, index) => (
                              <Skeleton key={index} className="h-24 w-full rounded-lg" />
                          ))
                      )}
                      {!isLoading && complaints.length === 0 && (
                          <p className="text-center text-muted-foreground py-4">No complaints submitted yet.</p>
                      )}
                      {!isLoading && complaints.map((complaint, index) => (
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
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 h-auto p-1" disabled={isDeleting === complaint.id}>
                                                  <Trash2 className="h-4 w-4" />
                                              </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                      This action cannot be undone. This will permanently delete the complaint: "{complaint.title}".
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel disabled={isDeleting === complaint.id}>Cancel</AlertDialogCancel>
                                                  <AlertDialogAction
                                                      onClick={() => handleDelete(complaint.id)}
                                                      disabled={isDeleting === complaint.id}
                                                      className={buttonVariants({ variant: "destructive" })}
                                                  >
                                                      {isDeleting === complaint.id ? 'Deleting...' : 'Delete'}
                                                  </AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                  </div>
                              </div>
                          </motion.div>
                      ))}
                  </CardContent>
              </Card>
          );
      };

      export default ComplaintList;
  