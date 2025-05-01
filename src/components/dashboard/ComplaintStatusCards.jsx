
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
    import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton component exists

    const ComplaintStatusCards = ({ stats, isLoading }) => {
      const getStatusColor = (status) => {
        switch (status) {
          case "pending": return "bg-yellow-500";
          case "inProgress": return "bg-blue-500"; // Match key name
          case "resolved": return "bg-green-500";
          default: return "bg-gray-500";
        }
      };

      const getStatusIcon = (status) => {
        switch (status) {
          case "pending": return AlertCircle;
          case "inProgress": return Clock; // Match key name
          case "resolved": return CheckCircle2;
          default: return AlertCircle;
        }
      };

      const statusCategories = [
         { key: "pending", title: "Pending Issues" },
         { key: "inProgress", title: "In Progress" }, // Match key name
         { key: "resolved", title: "Resolved Issues" }
       ];


      return (
        <Card className="shadow-lg border-none">
             <CardHeader>
               <CardTitle className="text-lg font-semibold text-primary">Complaint Status</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                 {statusCategories.map((category, index) => {
                   const Icon = getStatusIcon(category.key);
                   const count = stats ? stats[category.key] : 0; // Access count from stats object

                   return (
                     <motion.div
                       key={category.key}
                       initial={{ opacity: 0, y: 15 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.1 + index * 0.1 }}
                       className={`p-4 rounded-lg border flex items-center justify-between ${getStatusColor(category.key)} bg-opacity-10 border-${getStatusColor(category.key).replace('bg-','')} `}
                     >
                       <div className="flex items-center space-x-3">
                         <div className={`p-2 rounded-full ${getStatusColor(category.key)}`}>
                            <Icon className="h-5 w-5 text-white" />
                         </div>
                         <span className="font-medium text-sm">{category.title}</span>
                       </div>
                       {isLoading ? (
                         <Skeleton className="h-6 w-10 rounded-md" />
                       ) : (
                         <span className="text-xl font-bold">{count}</span>
                       )}
                     </motion.div>
                   );
                 })}
             </CardContent>
           </Card>

      );
    };

    // Simple Skeleton component if not already available via shadcn/ui
    // If you already have Skeleton via shadcn, remove this.
    // Make sure to create src/components/ui/skeleton.jsx if needed.
    // const Skeleton = ({ className }) => (
    //   <div className={cn("animate-pulse rounded-md bg-muted", className)} />
    // );

    export default ComplaintStatusCards;
  