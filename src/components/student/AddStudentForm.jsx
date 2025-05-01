
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { PlusCircle } from 'lucide-react';
    import { branchesData as branches } from '@/utils/hostelData';

    const AddStudentForm = ({ onStudentAdded }) => {
      const [newStudent, setNewStudent] = useState({
        student_id: '',
        name: '',
        branch: '',
        course_year: '',
        room_number: '',
        contact_number: ''
      });
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prevState => ({ ...prevState, [name]: value }));
      };

      const handleBranchChange = (value) => {
        setNewStudent(prevState => ({ ...prevState, branch: value }));
      };

      const addStudent = async (e) => {
        e.preventDefault();
        if (!newStudent.student_id || !newStudent.name || !newStudent.branch) {
          toast({
            title: "Missing Information",
            description: "Please fill in Student ID, Name, and Branch.",
            variant: "destructive",
          });
          return;
        }

        setIsLoading(true);
        try {
           // Changed: Removed .select() to simplify the insert operation
           const { error } = await supabase
            .from('students')
            .insert([newStudent]);

           if (error) throw error;

           const studentName = newStudent.name; // Get name from state
           setNewStudent({ student_id: '', name: '', branch: '', course_year: '', room_number: '', contact_number: '' }); // Reset form
           toast({
             title: "Student Added",
             // Changed: Use name from state as data is not returned without .select()
             description: `${studentName || 'New student'} has been successfully added.`,
           });
           if (onStudentAdded) {
             onStudentAdded(); // Callback to refresh list
           }
        } catch (error) {
            let description = error.message;
            if (error.message?.includes('duplicate key value violates unique constraint "students_student_id_key"')) {
              description = `Student with ID ${newStudent.student_id} already exists.`;
            } else if (error.message?.includes('violates row-level security policy')) {
              description = "You do not have permission to add students. Please check database policies.";
            }
            toast({
              title: "Error adding student",
              description: description,
              variant: "destructive",
            });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Card className="mb-6 bg-gradient-to-br from-green-50 to-teal-100 shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <PlusCircle className="mr-2 h-6 w-6" /> Add New Student
            </CardTitle>
          </CardHeader>
           <form onSubmit={addStudent}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="student_id">Student ID</Label>
                <Input id="student_id" name="student_id" value={newStudent.student_id} onChange={handleInputChange} placeholder="e.g., STU001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={newStudent.name} onChange={handleInputChange} placeholder="Full Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select onValueChange={handleBranchChange} value={newStudent.branch} name="branch" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course_year">Course & Year</Label>
                <Input id="course_year" name="course_year" value={newStudent.course_year} onChange={handleInputChange} placeholder="e.g., B.Tech 2nd Year" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="room_number">Room Number</Label>
                <Input id="room_number" name="room_number" value={newStudent.room_number} onChange={handleInputChange} placeholder="e.g., G-101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input id="contact_number" name="contact_number" type="tel" value={newStudent.contact_number} onChange={handleInputChange} placeholder="Phone Number" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
                 {isLoading ? 'Adding...' : 'Add Student'}
               </Button>
            </CardFooter>
          </form>
        </Card>
      );
    };

    export default AddStudentForm;
  