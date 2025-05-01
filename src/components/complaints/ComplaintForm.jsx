
      import React, { useState } from 'react';
      import { Button } from "@/components/ui/button";
      import { Input } from "@/components/ui/input";
      import { Label } from "@/components/ui/label";
      import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
      import { Textarea } from "@/components/ui/textarea";
      import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
      import { useToast } from "@/components/ui/use-toast";
      import { RotateCw, PlusCircle } from "lucide-react";
      import { useNotifications } from "@/contexts/NotificationContext"; // If needed for notifications on submit

      const ComplaintForm = ({ addComplaint }) => {
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
              if (!newComplaint.title || !newComplaint.description || !newComplaint.location) {
                   toast({ title: "Missing Information", description: "Please fill in Title, Description, and Location.", variant: "destructive" });
                   return;
              }

              setIsSubmitting(true);
              const success = await addComplaint(newComplaint);

              if (success) {
                  addNotification({
                      title: `New ${newComplaint.priority} priority complaint`,
                      description: `${newComplaint.title} - ${newComplaint.location}`,
                      priority: newComplaint.priority,
                      type: "complaint"
                  });
                  setNewComplaint({ title: "", description: "", location: "", priority: "medium" }); // Reset form
              }
              // addComplaint hook handles success/error toasts internally
              setIsSubmitting(false);
          };

          return (
              <Card className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg border-none">
                  <CardHeader>
                      <CardTitle className="flex items-center text-xl text-primary">
                           <PlusCircle className="mr-2 h-6 w-6"/> Submit New Complaint
                      </CardTitle>
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
          );
      };

      export default ComplaintForm;
  