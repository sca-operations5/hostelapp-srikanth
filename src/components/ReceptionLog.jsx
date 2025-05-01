
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";

    function ReceptionLog() {
      const [visitorLog, setVisitorLog] = useState([]);
      const [newVisitor, setNewVisitor] = useState({
        name: "",
        phone: "",
        address: "",
        purpose: "",
        relatedStudentName: "",
        relatedStudentBranch: "",
        entryTime: "", // Will be set on submit
      });
      const { toast } = useToast();

      useEffect(() => {
        const savedLog = localStorage.getItem("receptionLog");
        if (savedLog) {
          setVisitorLog(JSON.parse(savedLog));
        }
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
         if (!newVisitor.name || !newVisitor.phone || !newVisitor.purpose) {
           toast({ title: "Error", description: "Please fill Name, Phone, and Purpose.", variant: "destructive" });
           return;
         }

        const visitorEntry = {
          ...newVisitor,
          id: Date.now(),
          entryTime: new Date().toISOString(),
        };

        const updatedLog = [visitorEntry, ...visitorLog];
        setVisitorLog(updatedLog);
        localStorage.setItem("receptionLog", JSON.stringify(updatedLog));

        setNewVisitor({
          name: "", phone: "", address: "", purpose: "",
          relatedStudentName: "", relatedStudentBranch: "", entryTime: "",
        });

        toast({
          title: "Success",
          description: "Visitor logged successfully.",
        });
      };

      const handleExport = () => {
        if (visitorLog.length === 0) {
          toast({ title: "No Data", description: "There are no visitor logs to export.", variant: "destructive" });
          return;
        }
        const dataToExport = visitorLog.map(({ id, ...rest }) => ({
          ...rest,
          entryTime: new Date(rest.entryTime).toLocaleString()
        }));
        exportToExcel(dataToExport, "VisitorLog");
      };

      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Reception Visitor Log</h1>
             <Button onClick={handleExport} variant="outline">
               <Download className="mr-2 h-4 w-4" /> Export Log
             </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Log New Visitor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="visitorName">Visitor Name</Label>
                      <Input id="visitorName" value={newVisitor.name} onChange={(e) => setNewVisitor({...newVisitor, name: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="visitorPhone">Phone Number</Label>
                      <Input id="visitorPhone" type="tel" value={newVisitor.phone} onChange={(e) => setNewVisitor({...newVisitor, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="visitorAddress">Address</Label>
                    <Textarea id="visitorAddress" value={newVisitor.address} onChange={(e) => setNewVisitor({...newVisitor, address: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="visitPurpose">Purpose of Visit</Label>
                    <Input id="visitPurpose" value={newVisitor.purpose} onChange={(e) => setNewVisitor({...newVisitor, purpose: e.target.value})} />
                  </div>
                  <h3 className="text-lg font-medium pt-2">Related Student (If any)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input id="studentName" value={newVisitor.relatedStudentName} onChange={(e) => setNewVisitor({...newVisitor, relatedStudentName: e.target.value})} />
                    </div>
                     <div>
                      <Label htmlFor="studentBranch">Student Branch</Label>
                      <Input id="studentBranch" value={newVisitor.relatedStudentBranch} onChange={(e) => setNewVisitor({...newVisitor, relatedStudentBranch: e.target.value})} />
                    </div>
                  </div>
                  <Button type="submit">Log Visitor</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Visitor Log History</h2>
             {visitorLog.length === 0 ? (
               <p className="text-muted-foreground">No visitors logged yet.</p>
            ) : (
              visitorLog.map((visitor, index) => (
                <motion.div
                  key={visitor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{visitor.name} ({visitor.phone})</p>
                          <p className="text-sm">Address: {visitor.address || 'N/A'}</p>
                          <p className="text-sm">Purpose: {visitor.purpose}</p>
                          {visitor.relatedStudentName && (
                            <p className="text-sm">Visiting: {visitor.relatedStudentName} ({visitor.relatedStudentBranch || 'N/A'})</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Entry: {new Date(visitor.entryTime).toLocaleString()}</p>
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

    export default ReceptionLog;
  