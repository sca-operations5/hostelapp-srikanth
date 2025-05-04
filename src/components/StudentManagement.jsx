import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import StudentList from './student/StudentList';
import AddStudentForm from './student/AddStudentForm';
import RoomAllocation from './student/RoomAllocation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const { toast } = useToast();

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      toast({
        title: "Error fetching students",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentAdded = () => {
    fetchStudents();
    setActiveTab('list');
  };

  const handleStudentDeleted = () => {
    fetchStudents();
  };

  const handleRoomUpdated = () => {
    fetchStudents();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="list">Student List</TabsTrigger>
          <TabsTrigger value="add">Add New Student</TabsTrigger>
          <TabsTrigger value="rooms">Room Allocation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card className="p-4">
            <StudentList 
              students={students} 
              isLoading={isLoading} 
              onStudentDeleted={handleStudentDeleted}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <AddStudentForm onStudentAdded={handleStudentAdded} />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomAllocation 
            students={students} 
            onRoomUpdated={handleRoomUpdated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default StudentManagement;
  