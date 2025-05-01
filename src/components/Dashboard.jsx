
    import React from 'react';
    import { motion } from 'framer-motion';
    import DashboardHeader from '@/components/dashboard/DashboardHeader';
    import MainStatsGrid from '@/components/dashboard/MainStatsGrid';
    import BranchComplaintGrid from '@/components/dashboard/BranchComplaintGrid';
    import SecondaryStatsGrid from '@/components/dashboard/SecondaryStatsGrid';
    import { branchesData as branches } from '@/utils/hostelData';
    import { useComplaints } from '@/hooks/useComplaints';
    import { useDashboardStats } from '@/hooks/useDashboardStats'; // Import the new hook

    const Dashboard = () => {
      const { dashboardStats, isLoading: isLoadingStats } = useDashboardStats(); // Use the stats hook
      const { complaintStats, isLoadingComplaints } = useComplaints();

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-6 space-y-6"
        >
          <DashboardHeader />
          <MainStatsGrid stats={dashboardStats} isLoading={isLoadingStats} />
          <BranchComplaintGrid
            branches={branches}
            complaintStats={complaintStats}
            isLoadingComplaints={isLoadingComplaints}
          />
          <SecondaryStatsGrid
            complaintStats={complaintStats}
            isLoadingComplaints={isLoadingComplaints}
          />
        </motion.div>
      );
    };

    export default Dashboard;
  