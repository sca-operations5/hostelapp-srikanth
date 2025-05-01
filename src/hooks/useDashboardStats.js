
    import { useState, useEffect } from 'react';
    import { branchesData as branches, calculateDashboardStats } from '@/utils/hostelData';
    import { useStaffCount } from '@/hooks/useStaffCount';
    import { useStudentCount } from '@/hooks/useStudentCount';

    export const useDashboardStats = () => {
      const [dashboardStats, setDashboardStats] = useState([]);
      const { staffCount, isLoadingStaff } = useStaffCount();
      const { studentCount, isLoadingStudents } = useStudentCount();

      useEffect(() => {
        // Calculate stats using counts from hooks and infra data
        const stats = calculateDashboardStats(branches, staffCount, studentCount);
        setDashboardStats(stats);
      }, [staffCount, studentCount]); // Recalculate when counts change

      // Combine loading states
      const isLoading = isLoadingStaff || isLoadingStudents;

      return { dashboardStats, isLoading };
    };
  