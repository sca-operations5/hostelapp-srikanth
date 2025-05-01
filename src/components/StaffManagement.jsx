
    import React, { useState, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import AddStaffForm from '@/components/staff/AddStaffForm';
    import StaffList from '@/components/staff/StaffList';

    const StaffManagement = () => {
      const [staffList, setStaffList] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const fetchStaff = useCallback(async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setStaffList(data || []);
        } catch (error) {
          toast({
            title: "Error fetching staff",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }, [toast]);

      useEffect(() => {
        fetchStaff();
      }, [fetchStaff]);

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-4 md:p-6"
        >
          <h1 className="text-3xl font-bold mb-6 text-primary">Staff Management</h1>

          <AddStaffForm onStaffAdded={fetchStaff} />

          <StaffList
            staffList={staffList}
            isLoading={isLoading}
            onStaffDeleted={fetchStaff}
          />
        </motion.div>
      );
    };

    export default StaffManagement;
  