
    import React from 'react';
    import BranchStats from '@/components/dashboard/BranchStats';
    import ComplaintStatusCards from '@/components/dashboard/ComplaintStatusCards';

    const BranchComplaintGrid = ({ branches, complaintStats, isLoadingComplaints }) => {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BranchStats branches={branches} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <ComplaintStatusCards stats={complaintStats} isLoading={isLoadingComplaints} />
          </div>
        </div>
      );
    };

    export default BranchComplaintGrid;
  