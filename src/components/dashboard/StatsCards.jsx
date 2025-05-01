
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Users, Building2, DoorClosed, BedDouble, Home } from 'lucide-react';

    const StatsCards = ({ stats }) => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="p-6 bg-card rounded-lg shadow-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      );
    };

    export default StatsCards;
  