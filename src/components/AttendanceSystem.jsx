
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input"; // Added missing import
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";
    import { branchesData } from "@/utils/hostelData";

    function AttendanceSystem() {
      const [students, setStudents] = useState([]);
      const [attendance, setAttendance] = useState({});
      const [selectedBranch, setSelectedBranch] = useState("");
      const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
      const { toast } = useToast();

      const branches = branchesData.map(b => b.name);

      useEffect(() => {
        const savedStudents = localStorage.getItem("hostelStudents");
        if (savedStudents) {
          setStudents(JSON.parse(savedStudents));
        } else {
          const demoStudents = [
            { id: 1, studentId: 'S001', name: "John Doe", branch: "GODAVARI", roomNumber: 'G-101' },
            { id: 2, studentId: 'S002', name: "Jane Smith", branch: "GODAVARI", roomNumber: 'G-102' },
            { id: 3, studentId: 'S003', name: "Bob Johnson", branch: "SARAYU", roomNumber: 'S-101' },
          ];
          setStudents(demoStudents);
        }

        const savedAttendance = localStorage.getItem("attendance");
        if (savedAttendance) {
          setAttendance(JSON.parse(savedAttendance));
        }
      }, []);

      const handleAttendanceChange = (studentId) => {
        const date = selectedDate;
        const newAttendance = {
          ...attendance,
          [date]: {
            ...attendance[date],
            [studentId]: !attendance[date]?.[studentId]
          }
        };

        setAttendance(newAttendance);
        localStorage.setItem("attendance", JSON.stringify(newAttendance));
      };

      const handleSubmit = () => {
        toast({
          title: "Success",
          description: `Attendance for ${selectedDate} saved successfully`,
        });
      };

      const handleExport = () => {
        const date = selectedDate;
        const attendanceForDate = attendance[date] || {};
        if (Object.keys(attendanceForDate).length === 0 && filteredStudents.length === 0) {
           toast({ title: "No Data", description: `No attendance data recorded for ${date}.`, variant: "destructive" });
           return;
        }

        const dataToExport = filteredStudents.map(student => ({
          'Student ID': student.studentId,
          'Name': student.name,
          'Branch': student.branch,
          'Room': student.roomNumber,
          'Status': attendanceForDate[student.id] ? 'Present' : 'Absent'
        }));

        exportToExcel(dataToExport, `Attendance_${selectedBranch || 'All'}_${date}`);
      };

      const filteredStudents = selectedBranch
        ? students.filter(student => student.branch === selectedBranch)
        : students;

      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h1 className="text-4xl font-bold">Attendance Management</h1>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export for {selectedDate}
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-card rounded-lg shadow-lg border"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Branch</label>
              <select
                className="w-full p-2 rounded-md border bg-background"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <h2 className="text-xl font-semibold mb-3">Mark Attendance for {selectedDate}</h2>
            <div className="space-y-4">
              {filteredStudents.length === 0 && <p className="text-muted-foreground">No students found for the selected branch.</p>}
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-muted rounded-md"
                >
                  <div>
                    <p className="font-medium">{student.name} ({student.studentId})</p>
                    <p className="text-sm text-muted-foreground">{student.branch} - Room {student.roomNumber}</p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={attendance[selectedDate]?.[student.id] ? "default" : "outline"}
                      onClick={() => handleAttendanceChange(student.id)}
                      className={attendance[selectedDate]?.[student.id] ? "bg-green-600 hover:bg-green-700" : "border-red-500 text-red-500 hover:bg-red-50"}
                    >
                      {attendance[selectedDate]?.[student.id] ? "Present" : "Absent"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="mt-4 w-full" onClick={handleSubmit}>
              Save Attendance for {selectedDate}
            </Button>
          </motion.div>
        </div>
      );
    }

    export default AttendanceSystem;
  