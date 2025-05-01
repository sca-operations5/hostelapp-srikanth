
    import React, { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { motion } from "framer-motion";

    const AddVehicleForm = ({ onAddVehicle, toast }) => {
      const [newVehicle, setNewVehicle] = useState({ number: "", driver: "", route: "", status: "active" });

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!newVehicle.number || !newVehicle.driver || !newVehicle.route) {
          toast({ title: "Error", description: "Please fill all vehicle fields.", variant: "destructive" });
          return;
        }
        onAddVehicle(newVehicle);
        setNewVehicle({ number: "", driver: "", route: "", status: "active" });
      };

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle>Add New Vehicle</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><Label htmlFor="vNumber">Vehicle Number</Label><Input id="vNumber" value={newVehicle.number} onChange={(e) => setNewVehicle({...newVehicle, number: e.target.value})} /></div>
                  <div><Label htmlFor="vDriver">Driver Name</Label><Input id="vDriver" value={newVehicle.driver} onChange={(e) => setNewVehicle({...newVehicle, driver: e.target.value})} /></div>
                  <div><Label htmlFor="vRoute">Route</Label><Input id="vRoute" value={newVehicle.route} onChange={(e) => setNewVehicle({...newVehicle, route: e.target.value})} /></div>
                </div>
                <Button type="submit">Add Vehicle</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default AddVehicleForm;
  