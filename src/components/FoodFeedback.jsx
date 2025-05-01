
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { branchesData, floorsData } from "@/utils/hostelData";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";

    function FoodFeedback() {
      const [feedbackList, setFeedbackList] = useState([]);
      const [newFeedback, setNewFeedback] = useState({
        branch: "",
        floor: "",
        studentName: "",
        feedbackType: "suggestion",
        details: "",
        rating: 3,
      });
      const { toast } = useToast();

      const branches = branchesData.map(b => b.name);
      const floors = floorsData;

      useEffect(() => {
        const savedFeedback = localStorage.getItem("foodFeedback");
        if (savedFeedback) {
          setFeedbackList(JSON.parse(savedFeedback));
        }
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!newFeedback.branch || !newFeedback.floor || !newFeedback.studentName || !newFeedback.details) {
          toast({
            title: "Error",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return;
        }

        const feedbackEntry = {
          ...newFeedback,
          id: Date.now(),
          date: new Date().toISOString(),
        };

        const updatedFeedbackList = [feedbackEntry, ...feedbackList];
        setFeedbackList(updatedFeedbackList);
        localStorage.setItem("foodFeedback", JSON.stringify(updatedFeedbackList));

        setNewFeedback({
          branch: "",
          floor: "",
          studentName: "",
          feedbackType: "suggestion",
          details: "",
          rating: 3,
        });

        toast({
          title: "Success",
          description: "Food feedback submitted successfully.",
        });
      };

      const handleExport = () => {
        if (feedbackList.length === 0) {
          toast({ title: "No Data", description: "There is no food feedback to export.", variant: "destructive" });
          return;
        }
        const dataToExport = feedbackList.map(({ id, ...rest }) => ({
          ...rest,
          date: new Date(rest.date).toLocaleString()
        }));
        exportToExcel(dataToExport, "FoodFeedbackLog");
      };

      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Food Feedback Management</h1>
             <Button onClick={handleExport} variant="outline">
               <Download className="mr-2 h-4 w-4" /> Export Feedback
             </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Log New Food Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select onValueChange={(value) => setNewFeedback({...newFeedback, branch: value})} value={newFeedback.branch}>
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="floor">Floor</Label>
                       <Select onValueChange={(value) => setNewFeedback({...newFeedback, floor: value})} value={newFeedback.floor}>
                        <SelectTrigger id="floor">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {floors.map(floor => (
                            <SelectItem key={floor} value={floor}>{floor}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      placeholder="Enter student name"
                      value={newFeedback.studentName}
                      onChange={(e) => setNewFeedback({ ...newFeedback, studentName: e.target.value })}
                    />
                  </div>
                   <div>
                      <Label htmlFor="feedbackType">Feedback Type</Label>
                       <Select onValueChange={(value) => setNewFeedback({...newFeedback, feedbackType: value})} value={newFeedback.feedbackType}>
                        <SelectTrigger id="feedbackType">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suggestion">Suggestion</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="compliment">Compliment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  <div>
                    <Label htmlFor="details">Details</Label>
                    <Textarea
                      id="details"
                      placeholder="Enter feedback details"
                      value={newFeedback.details}
                      onChange={(e) => setNewFeedback({ ...newFeedback, details: e.target.value })}
                    />
                  </div>
                   <div>
                      <Label htmlFor="rating">Rating (1-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={newFeedback.rating}
                        onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  <Button type="submit">Submit Feedback</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Logged Feedback</h2>
            {feedbackList.length === 0 ? (
              <p className="text-muted-foreground">No feedback logged yet.</p>
            ) : (
              feedbackList.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{feedback.studentName} ({feedback.branch} - {feedback.floor})</p>
                          <p className="text-sm capitalize">Type: {feedback.feedbackType}</p>
                          <p className="text-sm">Rating: {feedback.rating}/5</p>
                          <p className="mt-2 text-sm text-muted-foreground">{feedback.details}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(feedback.date).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      );
    }

    export default FoodFeedback;
  