import React from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MainStatsGrid from '@/components/dashboard/MainStatsGrid';
import BranchComplaintGrid from '@/components/dashboard/BranchComplaintGrid';
import SecondaryStatsGrid from '@/components/dashboard/SecondaryStatsGrid';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useComplaints } from '@/hooks/useComplaints';
import { useBranches } from '@/hooks/useBranches';

const Dashboard = () => {
  const { dashboardStats, isLoading: isLoadingStats } = useDashboardStats();
  const { complaintStats, isLoadingComplaints } = useComplaints();
  const { branches, isLoadingBranches } = useBranches();

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
        isLoadingBranches={isLoadingBranches}
      />
      <SecondaryStatsGrid
        complaintStats={complaintStats}
        isLoadingComplaints={isLoadingComplaints}
      />
    </motion.div>
  );
};

export default Dashboard;
  