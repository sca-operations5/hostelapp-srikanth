
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { useNotifications } from "@/contexts/NotificationContext";
    import { Upload, Download } from "lucide-react";
    import { branchesData, floorsData } from "@/utils/hostelData";
    import { exportToExcel } from "@/utils/exportToExcel";

    function HealthLog() {
      const [healthRecords, setHealthRecords] = useState([]);
      const [newRecord, setNewRecord] = useState({
        studentName: "", branch: "", floor: "", illnessReason: "", medicationsTaken: "",
        sentToHospital: "no", hospitalDetails: "", medicalReports: null, expenses: "",
        floorInchargeNotified: "no", careProvided: "",
      });
      const { toast } = useToast();
      const { addNotification } = useNotifications();

      const branches = branchesData.map(b => b.name);
      const floors = floorsData;

      useEffect(() => {
        const savedRecords = localStorage.getItem("healthLog");
        if (savedRecords) {
          setHealthRecords(JSON.parse(savedRecords));
        }
      }, []);

      const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          setNewRecord({ ...newRecord, medicalReports: e.target.files[0].name });
          toast({ title: "File Selected", description: e.target.files[0].name });
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
         if (!newRecord.studentName || !newRecord.branch || !newRecord.floor || !newRecord.illnessReason) {
           toast({ title: "Error", description: "Please fill required fields (Student, Branch, Floor, Reason).", variant: "destructive" });
           return;
         }

        const recordEntry = {
          ...newRecord,
          id: Date.now(),
          reportDate: new Date().toISOString(),
        };

        const updatedRecords = [recordEntry, ...healthRecords];
        setHealthRecords(updatedRecords);
        localStorage.setItem("healthLog", JSON.stringify(updatedRecords));

        if (newRecord.floorInchargeNotified === 'yes') {
           addNotification({
             title: "Health Alert: Student Sick",
             description: `${newRecord.studentName} (${newRecord.branch} - ${newRecord.floor}) reported sick. Reason: ${newRecord.illnessReason}. Please check on them.`,
             priority: "high",
             type: "health_alert"
           });
           toast({ title: "Notification Sent", description: `Floor Incharge for ${newRecord.floor} notified.` });
        }

        setNewRecord({
          studentName: "", branch: "", floor: "", illnessReason: "", medicationsTaken: "",
          sentToHospital: "no", hospitalDetails: "", medicalReports: null, expenses: "",
          floorInchargeNotified: "no", careProvided: "",
        });
         const fileInput = document.getElementById('medicalReports');
         if (fileInput) fileInput.value = '';

        toast({
          title: "Success",
          description: "Health record logged successfully.",
        });
      };

       const handleExport = () => {
         if (healthRecords.length === 0) {
           toast({ title: "No Data", description: "There are no health records to export.", variant: "destructive" });
           return;
         }
         const dataToExport = healthRecords.map(({ id, ...rest }) => ({
           ...rest,
           reportDate: new Date(rest.reportDate).toLocaleString()
         }));
         exportToExcel(dataToExport, "HealthLog");
       };

      return (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
             <h1 className="text-4xl font-bold">Student Health Log</h1>
             <Button onClick={handleExport} variant="outline">
               <Download className="mr-2 h-4 w-4" /> Export Log
             </Button>
           </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Log New Health Incident</CardTitle>
                <CardDescription>Record details of student illness or health concerns.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input id="studentName" value={newRecord.studentName} onChange={(e) => setNewRecord({...newRecord, studentName: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select onValueChange={(value) => setNewRecord({...newRecord, branch: value})} value={newRecord.branch}>
                        <SelectTrigger id="branch"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                        <SelectContent>{branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                     <div>
                      <Label htmlFor="floor">Floor</Label>
                      <Select onValueChange={(value) => setNewRecord({...newRecord, floor: value})} value={newRecord.floor}>
                        <SelectTrigger id="floor"><SelectValue placeholder="Select Floor" /></SelectTrigger>
                        <SelectContent>{floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="illnessReason">Reason for Illness / Concern</Label>
                    <Textarea id="illnessReason" value={newRecord.illnessReason} onChange={(e) => setNewRecord({...newRecord, illnessReason: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="medicationsTaken">Medications Taken</Label>
                    <Input id="medicationsTaken" value={newRecord.medicationsTaken} onChange={(e) => setNewRecord({...newRecord, medicationsTaken: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sentToHospital">Sent to Hospital?</Label>
                      <Select onValueChange={(value) => setNewRecord({...newRecord, sentToHospital: value})} value={newRecord.sentToHospital}>
                        <SelectTrigger id="sentToHospital"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hospitalDetails">Hospital Details (If Yes)</Label>
                      <Input id="hospitalDetails" value={newRecord.hospitalDetails} onChange={(e) => setNewRecord({...newRecord, hospitalDetails: e.target.value})} disabled={newRecord.sentToHospital === 'no'} />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="medicalReports">Upload Medical Reports (Optional)</Label>
                       <div className="flex items-center space-x-2">
                         <Input id="medicalReports" type="file" className="hidden" onChange={handleFileChange} />
                         <Button type="button" variant="outline" onClick={() => document.getElementById('medicalReports')?.click()}>
                           <Upload className="mr-2 h-4 w-4" /> Choose File
                         </Button>
                         {newRecord.medicalReports && <span className="text-sm text-muted-foreground">{newRecord.medicalReports}</span>}
                       </div>
                     </div>
                     <div>
                       <Label htmlFor="expenses">Medical Expenses (If any)</Label>
                       <Input id="expenses" type="number" value={newRecord.expenses} onChange={(e) => setNewRecord({...newRecord, expenses: e.target.value})} />
                     </div>
                   </div>
                   <div>
                     <Label htmlFor="floorInchargeNotified">Notify Floor Incharge?</Label>
                     <Select onValueChange={(value) => setNewRecord({...newRecord, floorInchargeNotified: value})} value={newRecord.floorInchargeNotified}>
                       <SelectTrigger id="floorInchargeNotified"><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="yes">Yes</SelectItem>
                         <SelectItem value="no">No</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label htmlFor="careProvided">Care Provided by Floor Incharge</Label>
                     <Textarea id="careProvided" placeholder="Record actions taken by floor incharge" value={newRecord.careProvided} onChange={(e) => setNewRecord({...newRecord, careProvided: e.target.value})} />
                   </div>
                  <Button type="submit">Log Health Record</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Health Log History</h2>
             {healthRecords.length === 0 ? (
               <p className="text-muted-foreground">No health records logged yet.</p>
            ) : (
              healthRecords.map((record, index) => (
                <motion.div key={record.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{record.studentName} ({record.branch} - {record.floor})</p>
                          <p className="text-sm">Reason: {record.illnessReason}</p>
                          <p className="text-sm">Medications: {record.medicationsTaken || 'None'}</p>
                          <p className="text-sm">Hospital: {record.sentToHospital === 'yes' ? record.hospitalDetails || 'Yes' : 'No'}</p>
                          {record.medicalReports && <p className="text-sm">Reports: {record.medicalReports}</p>}
                          {record.expenses && <p className="text-sm">Expenses: ${record.expenses}</p>}
                          <p className="text-sm">Incharge Notified: {record.floorInchargeNotified}</p>
                          {record.careProvided && <p className="text-sm">Care Provided: {record.careProvided}</p>}
                        </div>
                        <p className="text-xs text-muted-foreground">Reported: {new Date(record.reportDate).toLocaleString()}</p>
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

    export default HealthLog;
  