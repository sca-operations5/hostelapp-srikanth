
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";

    function Leaves() {
      const [leaveRequests, setLeaveRequests] = useState([]);
      const [newLeave, setNewLeave] = useState({
        applicantName: "",
        leaveType: "personal", // Default or add select if needed
        startDate: "",
        endDate: "",
        reason: "",
      });
      const { toast } = useToast();

      useEffect(() => {
        const savedLeaves = localStorage.getItem("leaveRequests");
        if (savedLeaves) {
          setLeaveRequests(JSON.parse(savedLeaves));
        }
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!newLeave.applicantName || !newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
           toast({
            title: "Error",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return;
        }
        if (new Date(newLeave.endDate) < new Date(newLeave.startDate)) {
           toast({
            title: "Error",
            description: "End date cannot be before start date.",
            variant: "destructive",
          });
          return;
        }

        const leaveRequest = {
          ...newLeave,
          id: Date.now(),
          status: "pending",
          requestDate: new Date().toISOString(),
        };

        const updatedLeaveRequests = [leaveRequest, ...leaveRequests];
        setLeaveRequests(updatedLeaveRequests);
        localStorage.setItem("leaveRequests", JSON.stringify(updatedLeaveRequests));

        setNewLeave({
          applicantName: "",
          leaveType: "personal",
          startDate: "",
          endDate: "",
          reason: "",
        });

        toast({
          title: "Success",
          description: "Leave request submitted successfully.",
        });
      };

      const handleStatusChange = (id, status) => {
         const updatedRequests = leaveRequests.map(req =>
           req.id === id ? { ...req, status: status } : req
         );
         setLeaveRequests(updatedRequests);
         localStorage.setItem("leaveRequests", JSON.stringify(updatedRequests));
         toast({
           title: "Status Updated",
           description: `Leave request status changed to ${status}.`,
         });
      };

      const handleExport = () => {
        if (leaveRequests.length === 0) {
          toast({ title: "No Data", description: "There are no leave requests to export.", variant: "destructive" });
          return;
        }
        const dataToExport = leaveRequests.map(({ id, ...rest }) => ({
          ...rest,
          requestDate: new Date(rest.requestDate).toLocaleString()
        }));
        exportToExcel(dataToExport, "LeaveRequestsLog");
      };

      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Leave Management</h1>
             <Button onClick={handleExport} variant="outline">
               <Download className="mr-2 h-4 w-4" /> Export Requests
             </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Apply for Leave</CardTitle>
                <CardDescription>
                  Please fill out the form below to request leave. Ensure all details are accurate.
                  Leave requests are subject to approval based on hostel policy.
                  Provide a clear reason for your leave.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="applicantName">Applicant Name</Label>
                    <Input
                      id="applicantName"
                      placeholder="Enter your name"
                      value={newLeave.applicantName}
                      onChange={(e) => setNewLeave({ ...newLeave, applicantName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newLeave.startDate}
                        onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      />
                    </div>
                     <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newLeave.endDate}
                        onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                   <div>
                    <Label htmlFor="reason">Reason for Leave</Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain the reason for your leave request"
                      value={newLeave.reason}
                      onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    />
                  </div>
                  <Button type="submit">Submit Request</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Leave Requests</h2>
            {leaveRequests.length === 0 ? (
               <p className="text-muted-foreground">No leave requests found.</p>
            ) : (
              leaveRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{request.applicantName}</p>
                          <p className="text-sm">Dates: {request.startDate} to {request.endDate}</p>
                          <p className="text-sm">Reason: {request.reason}</p>
                          <p className="text-sm capitalize">Status: <span className={`font-medium ${request.status === 'approved' ? 'text-green-600' : request.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{request.status}</span></p>
                        </div>
                        <div className="flex flex-col space-y-1 items-end">
                           <p className="text-xs text-muted-foreground">Requested: {new Date(request.requestDate).toLocaleDateString()}</p>
                           {request.status === 'pending' && (
                             <div className="flex space-x-1">
                               <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100" onClick={() => handleStatusChange(request.id, 'approved')}>Approve</Button>
                               <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100" onClick={() => handleStatusChange(request.id, 'rejected')}>Reject</Button>
                             </div>
                           )}
                        </div>
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

    export default Leaves;
  