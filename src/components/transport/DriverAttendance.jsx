
    import React, { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input"; // Added missing import
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { motion } from "framer-motion";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";

    const DriverAttendance = ({ drivers, attendance, onRecordAttendance, toast }) => {
      const [selectedDriver, setSelectedDriver] = useState("");
      const [status, setStatus] = useState("present");
      const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDriver || !date || !status) {
          toast({ title: "Error", description: "Please select driver, date, and status.", variant: "destructive" });
          return;
        }
        onRecordAttendance({ driver: selectedDriver, date, status });
        setSelectedDriver(""); // Reset after submit
      };

      const handleExport = () => {
        if (attendance.length === 0) {
          toast({ title: "No Data", description: "There is no driver attendance data to export.", variant: "destructive" });
          return;
        }
        const dataToExport = attendance.map(({ id, ...rest }) => rest);
        exportToExcel(dataToExport, "DriverAttendanceLog");
      };

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Driver Attendance</CardTitle>
               <Button onClick={handleExport} variant="outline" size="sm">
                 <Download className="mr-2 h-4 w-4" /> Export Attendance
               </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="driverSelect">Driver</Label>
                    <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                      <SelectTrigger id="driverSelect"><SelectValue placeholder="Select Driver" /></SelectTrigger>
                      <SelectContent>{drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="attendanceDate">Date</Label>
                    <Input id="attendanceDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="attendanceStatus">Status</Label>
                    <Select onValueChange={setStatus} value={status}>
                      <SelectTrigger id="attendanceStatus"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit">Record Attendance</Button>
              </form>
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-medium">Recent Attendance</h3>
                {attendance.slice(0, 5).map(att => (
                  <div key={att.id} className="text-sm p-2 bg-muted rounded">
                    {att.driver} - {att.date} - <span className="capitalize">{att.status}</span>
                  </div>
                ))}
                 {attendance.length === 0 && <p className="text-sm text-muted-foreground">No attendance recorded yet.</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default DriverAttendance;
  