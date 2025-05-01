
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button, buttonVariants } from "@/components/ui/button";
    import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { useToast } from "@/components/ui/use-toast";
    import { GraduationCap, Download, Trash2 } from 'lucide-react';
    import { exportToExcel } from '@/utils/exportToExcel';
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
            onStudentDeleted(); // Callback to refresh list
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

      return (
        <Card className="shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl text-primary">
              <GraduationCap className="mr-2 h-6 w-6" /> Student List
            </CardTitle>
             <Button onClick={handleExport} variant="outline" size="sm" className="ml-auto border-primary text-primary hover:bg-primary/10">
               <Download className="mr-2 h-4 w-4" /> Export to Excel
             </Button>
          </CardHeader>
          <CardContent>
           {isLoading && students.length === 0 ? (
               <p className="text-center text-gray-500">Loading student data...</p>
            ) : students.length === 0 ? (
              <p className="text-center text-gray-500">No students added yet.</p>
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
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.student_id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.branch}</TableCell>
                        <TableCell>{student.course_year || '-'}</TableCell>
                         <TableCell>{student.room_number || '-'}</TableCell>
                        <TableCell>{student.contact_number || '-'}</TableCell>
                        <TableCell>{new Date(student.created_at).toLocaleDateString()}</TableCell>
                         <TableCell className="text-right">
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
        </Card>
      );
    };

    export default StudentList;
  