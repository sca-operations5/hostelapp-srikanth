
    import React from "react";
    import { Button } from "@/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { motion } from "framer-motion";
    import { MapPin, Truck } from "lucide-react";

    const ActiveVehicleList = ({ vehicles, onUpdateLocation }) => {
      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
             <CardHeader><CardTitle>Active Vehicles & GPS Tracking (Simulation)</CardTitle></CardHeader>
             <CardContent className="space-y-4">
              {vehicles.length === 0 ? <p className="text-muted-foreground">No vehicles added yet.</p> : vehicles.map((vehicle, index) => (
                <motion.div key={vehicle.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Truck className="h-5 w-5 text-primary" />
                            <h3 className="font-bold">{vehicle.number}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Driver: {vehicle.driver}</p>
                          <p className="text-sm">Route: {vehicle.route}</p>
                          <div className="flex items-center space-x-1 text-sm text-green-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{vehicle.currentLocation}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last updated: {new Date(vehicle.lastUpdated).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2 items-end">
                          <p className="text-xs font-semibold">Update Location:</p>
                          <Button size="sm" variant="outline" onClick={() => onUpdateLocation(vehicle.id, "Campus")}>At Campus</Button>
                          <Button size="sm" variant="outline" onClick={() => onUpdateLocation(vehicle.id, "En Route")}>En Route</Button>
                          <Button size="sm" variant="outline" onClick={() => onUpdateLocation(vehicle.id, "Branch Drop-off")}>Branch Drop-off</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default ActiveVehicleList;
  