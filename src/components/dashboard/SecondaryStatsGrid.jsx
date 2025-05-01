
    import React from 'react';
    import ComplaintSummary from '@/components/dashboard/ComplaintSummary';
    import MessScheduleSummary from '@/components/dashboard/MessScheduleSummary';
    import ScheduledMeetings from '@/components/dashboard/ScheduledMeetings';

    const SecondaryStatsGrid = ({ complaintStats, isLoadingComplaints }) => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ComplaintSummary complaintStats={complaintStats} isLoading={isLoadingComplaints} />
          <MessScheduleSummary />
          <ScheduledMeetings />
        </div>
      );
    };

    export default SecondaryStatsGrid;
  