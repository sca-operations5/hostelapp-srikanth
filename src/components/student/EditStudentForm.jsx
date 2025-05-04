import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Pencil } from 'lucide-react';
import { branchesData as branches } from '@/utils/hostelData';

const EditStudentForm = ({ student, onStudentUpdated, onCancel }) => {
  const [editedStudent, setEditedStudent] = useState(student);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setEditedStudent(student);
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent(prevState => ({ ...prevState, [name]: value }));
  };

  const handleBranchChange = (value) => {
    setEditedStudent(prevState => ({ ...prevState, branch: value }));
  };

  const updateStudent = async (e) => {
    e.preventDefault();
    if (!editedStudent.student_id || !editedStudent.name || !editedStudent.branch) {
      toast({
        title: "Missing Information",
        description: "Please fill in Student ID, Name, and Branch.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('students')
        .update(editedStudent)
        .match({ id: editedStudent.id });

      if (error) throw error;

      toast({
        title: "Student Updated",
        description: `${editedStudent.name}'s information has been successfully updated.`,
      });
      
      if (onStudentUpdated) {
        onStudentUpdated();
      }
    } catch (error) {
      toast({
        title: "Error updating student",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-primary">
          <Pencil className="mr-2 h-6 w-6" /> Edit Student Details
        </CardTitle>
      </CardHeader>
      <form onSubmit={updateStudent}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="student_id">Student ID</Label>
            <Input id="student_id" name="student_id" value={editedStudent.student_id} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={editedStudent.name} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select onValueChange={handleBranchChange} value={editedStudent.branch} name="branch" required>
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
            <Input id="course_year" name="course_year" value={editedStudent.course_year} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_number">Room Number</Label>
            <Input id="room_number" name="room_number" value={editedStudent.room_number} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input id="contact_number" name="contact_number" type="tel" value={editedStudent.contact_number} onChange={handleInputChange} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
            {isLoading ? 'Updating...' : 'Update Student'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditStudentForm; 