import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, Download, Trash2, Search, Filter, Pencil } from 'lucide-react';
import { exportToExcel } from '@/utils/exportToExcel';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { branchesData as branches } from '@/utils/hostelData';
import EditStudentForm from './EditStudentForm';
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

const StudentList = ({ students, isLoading, onStudentDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const { toast } = useToast();

  const deleteStudent = async (studentId, studentName) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .match({ id: studentId });

      if (error) throw error;

      toast({
        title: "Student Removed",
        description: `${studentName} has been successfully removed.`,
      });
      if (onStudentDeleted) {
        onStudentDeleted();
      }
    } catch (error) {
      toast({
        title: "Error removing student",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    if (students.length === 0) {
      toast({
        title: "No Data",
        description: "There is no student data to export.",
        variant: "destructive",
      });
      return;
    }
    const exportData = students.map(s => ({
      'Student ID': s.student_id,
      'Name': s.name,
      'Branch': s.branch,
      'Course & Year': s.course_year,
      'Room No.': s.room_number,
      'Contact': s.contact_number,
      'Added On': new Date(s.created_at).toLocaleDateString(),
    }));
    exportToExcel(exportData, 'Student_List');
    toast({
      title: "Export Successful",
      description: "Student list exported to Excel.",
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.room_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranch ? student.branch === selectedBranch : true;
    
    return matchesSearch && matchesBranch;
  });

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl text-primary">
            <GraduationCap className="mr-2 h-6 w-6" /> Student List
          </CardTitle>
          <Button onClick={handleExport} variant="outline" size="sm" className="ml-auto border-primary text-primary hover:bg-primary/10">
            <Download className="mr-2 h-4 w-4" /> Export to Excel
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && students.length === 0 ? (
          <p className="text-center text-gray-500">Loading student data...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500">No students found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Course & Year</TableHead>
                  <TableHead>Room No.</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.student_id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.course_year || '-'}</TableCell>
                    <TableCell>{student.room_number || '-'}</TableCell>
                    <TableCell>{student.contact_number || '-'}</TableCell>
                    <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:text-primary/80"
                        onClick={() => setEditingStudent(student)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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
                              This action cannot be undone. This will permanently remove {student.name} from the student list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteStudent(student.id, student.name)}
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

      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditStudentForm
              student={editingStudent}
              onStudentUpdated={() => {
                onStudentDeleted();
                setEditingStudent(null);
              }}
              onCancel={() => setEditingStudent(null)}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default StudentList;
  