
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Skeleton } from "@/components/ui/skeleton";
    import { AlertTriangle } from 'lucide-react';

    const StatBox = ({ title, value, colorClass, isLoading }) => (
      <div className="p-4 bg-muted rounded-md border">
        <p className="text-sm text-muted-foreground">{title}</p>
        {isLoading ? (
          <Skeleton className="h-8 w-16 mt-1" />
        ) : (
          <p className={`text-2xl font-bold ${colorClass}`}>{value ?? 0}</p>
        )}
      </div>
    );


    const ComplaintSummary = ({ complaintStats, isLoading }) => {

     // Provide default stats if undefined during loading or error
     const stats = complaintStats || { total: 0, resolved: 0, inProgress: 0, pending: 0 };

      return (
        <Card className="shadow-lg border-none h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary">Complaint Statistics</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
             {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                   <StatBox title="Total Complaints" value={null} isLoading={true} />
                   <StatBox title="Resolved" value={null} colorClass="text-green-500" isLoading={true} />
                   <StatBox title="In Progress" value={null} colorClass="text-blue-500" isLoading={true} />
                   <StatBox title="Pending" value={null} colorClass="text-yellow-500" isLoading={true} />
                 </div>
              ) : !complaintStats ? (
                 <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <AlertTriangle className="w-10 h-10 mb-2 text-destructive"/>
                    <p>Could not load complaint data.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <StatBox title="Total Complaints" value={stats.total} isLoading={false} />
                  <StatBox title="Resolved" value={stats.resolved} colorClass="text-green-500" isLoading={false} />
                  <StatBox title="In Progress" value={stats.inProgress} colorClass="text-blue-500" isLoading={false} />
                  <StatBox title="Pending" value={stats.pending} colorClass="text-yellow-500" isLoading={false} />
                </div>
              )}
          </CardContent>
        </Card>
      );
    };

    export default ComplaintSummary;
  