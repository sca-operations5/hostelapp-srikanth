import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const BranchStats = ({ branches, isLoading = false }) => {
  // Prepare placeholder slots
  const placeholders = Array.from({ length: 4 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Branch Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading
              ? placeholders.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-muted/50 rounded-lg border"
                  >
                    <Skeleton className="h-5 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </motion.div>
                ))
              : branches.map((branch, index) => (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-muted/50 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-md">{branch.name}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{branch.students} Students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{branch.staff} Staff</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BranchStats;
  