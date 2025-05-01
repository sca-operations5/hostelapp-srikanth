
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";
    import { branchesData } from "@/utils/hostelData"; // Use branches from central data

    function MessManagement() {
      const [meals, setMeals] = useState([]);
      const [newMeal, setNewMeal] = useState({
        type: "breakfast",
        menu: "",
        dispatchTime: "",
        branch: ""
      });
      const { toast } = useToast();

      const branches = branchesData.map(b => b.name); // Use branches from hostelData
      const mealTypes = ["breakfast", "lunch", "snacks", "dinner"];

      useEffect(() => {
        const savedMeals = localStorage.getItem("meals");
        if (savedMeals) {
          setMeals(JSON.parse(savedMeals));
        }
      }, []);

      const handleSubmit = (e) => {
        e.preventDefault();
         if (!newMeal.type || !newMeal.menu || !newMeal.dispatchTime || !newMeal.branch) {
           toast({ title: "Error", description: "Please fill all meal details.", variant: "destructive" });
           return;
         }

        const meal = {
          ...newMeal,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0]
        };

        const updatedMeals = [...meals, meal];
        setMeals(updatedMeals);
        localStorage.setItem("meals", JSON.stringify(updatedMeals));

        setNewMeal({
          type: "breakfast",
          menu: "",
          dispatchTime: "",
          branch: ""
        });

        toast({
          title: "Success",
          description: "Meal schedule added successfully",
        });
      };

      const handleExport = () => {
        const today = new Date().toISOString().split('T')[0];
        const todaysMeals = meals.filter(meal => meal.date === today);
        if (todaysMeals.length === 0) {
          toast({ title: "No Data", description: "No meal schedule found for today to export.", variant: "destructive" });
          return;
        }
        const dataToExport = todaysMeals.map(({ id, date, ...rest }) => ({
          ...rest,
          type: rest.type.charAt(0).toUpperCase() + rest.type.slice(1) // Capitalize type
        }));
        exportToExcel(dataToExport, `MealSchedule_${today}`);
      };

      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Mess Management</h1>
             <Button onClick={handleExport} variant="outline">
               <Download className="mr-2 h-4 w-4" /> Export Today's Schedule
             </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-card rounded-lg shadow-lg border"
          >
            <h2 className="text-xl font-bold mb-4">Add Meal Schedule</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meal Type</label>
                <select
                  required
                  className="w-full p-2 rounded-md border bg-background"
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                >
                  {mealTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Menu</label>
                <textarea
                  required
                  className="w-full p-2 rounded-md border bg-background"
                  rows="3"
                  value={newMeal.menu}
                  onChange={(e) => setNewMeal({...newMeal, menu: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dispatch Time</label>
                <input
                  type="time"
                  required
                  className="w-full p-2 rounded-md border bg-background"
                  value={newMeal.dispatchTime}
                  onChange={(e) => setNewMeal({...newMeal, dispatchTime: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <select
                  required
                  className="w-full p-2 rounded-md border bg-background"
                  value={newMeal.branch}
                  onChange={(e) => setNewMeal({...newMeal, branch: e.target.value})}
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              <Button type="submit">Add Meal Schedule</Button>
            </form>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Today's Meal Schedule</h2>
            {meals.length === 0 && <p className="text-muted-foreground">No meals scheduled yet.</p>}
            {meals
              .filter(meal => meal.date === new Date().toISOString().split('T')[0])
              .map((meal, index) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-card rounded-lg shadow border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                      </h3>
                      <p className="text-sm text-muted-foreground">{meal.menu}</p>
                      <p className="text-sm">Branch: {meal.branch}</p>
                      <p className="text-sm">Dispatch Time: {meal.dispatchTime}</p>
                    </div>
                     <p className="text-xs text-muted-foreground">{new Date(meal.date).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
               {meals.filter(meal => meal.date === new Date().toISOString().split('T')[0]).length === 0 && meals.length > 0 &&
                 <p className="text-muted-foreground">No meals scheduled for today.</p>
               }
          </div>
        </div>
      );
    }

    export default MessManagement;
  