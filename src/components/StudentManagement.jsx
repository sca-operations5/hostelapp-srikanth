
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import AddStudentForm from '@/components/student/AddStudentForm';
    import StudentList from '@/components/student/StudentList';

    const StudentManagement = () => {
      const [students, setStudents] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const fetchStudents = useCallback(async () => {
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
      }, [toast]); // Include toast in dependency array

      useEffect(() => {
        fetchStudents();
      }, [fetchStudents]); // fetchStudents is now stable due to useCallback

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-4 md:p-6"
        >
          <h1 className="text-3xl font-bold mb-6 text-primary">Student Management</h1>

          <AddStudentForm onStudentAdded={fetchStudents} />

          <StudentList
            students={students}
            isLoading={isLoading}
            onStudentDeleted={fetchStudents}
          />
        </motion.div>
      );
    };

    export default StudentManagement;
  