
    import React from 'react';
    import StatsCards from '@/components/dashboard/StatsCards';
    import { Skeleton } from '@/components/ui/skeleton';

    const MainStatsGrid = ({ stats, isLoading }) => {
      if (isLoading) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[100px] rounded-lg" />
            ))}
          </div>
        );
      }
      return (
        <StatsCards stats={stats} />
      );
    };

    export default MainStatsGrid;
  