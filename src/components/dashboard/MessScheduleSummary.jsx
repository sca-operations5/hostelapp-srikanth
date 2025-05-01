
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MessScheduleSummary = () => {
  const [todayMeals, setTodayMeals] = useState([]);

   useEffect(() => {
    const savedMeals = localStorage.getItem("meals");
    if (savedMeals) {
      const allMeals = JSON.parse(savedMeals);
      const today = new Date().toISOString().split('T')[0];
      setTodayMeals(allMeals.filter(meal => meal.date === today));
    }
  }, []);


  const defaultSchedule = [
    { meal: "Breakfast", time: "7:00 AM - 9:00 AM", menu: "Not Set" },
    { meal: "Lunch", time: "12:00 PM - 2:00 PM", menu: "Not Set" },
    { meal: "Dinner", time: "7:00 PM - 9:00 PM", menu: "Not Set" },
  ];

  const getMealInfo = (mealType) => {
     const meal = todayMeals.find(m => m.type === mealType.toLowerCase());
     return meal ? meal.menu : "Not Set";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Mess Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {defaultSchedule.map((meal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-3 bg-muted rounded-md border"
            >
              <div className="flex justify-between items-center">
                 <p className="font-medium text-sm">{meal.meal} <span className="text-xs text-muted-foreground">({meal.time})</span></p>
                 <p className="text-sm text-primary">{getMealInfo(meal.meal)}</p>
              </div>
            </motion.div>
          ))}
           {todayMeals.length === 0 && <p className="text-xs text-center text-muted-foreground pt-2">No specific menu set for today.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessScheduleSummary;
