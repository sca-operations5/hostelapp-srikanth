
    import React, { useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { motion } from "framer-motion";
    import { exportToExcel } from "@/utils/exportToExcel";
    import { Download } from "lucide-react";

    const VehicleLogBook = ({ vehicles, logs, onAddLog, getVehicleNumber, toast }) => {
      const [newLog, setNewLog] = useState({ vehicleId: "", type: "mileage", reading: "", date: "", notes: "", fuelAmount: "", cost: "" });

      const handleSubmit = (e) => {
        e.preventDefault();
         if (!newLog.vehicleId || !newLog.type || !newLog.date || (newLog.type === 'mileage' && !newLog.reading) || (newLog.type === 'refuel' && (!newLog.fuelAmount || !newLog.cost)) || (newLog.type === 'maintenance' && !newLog.notes)) {
           toast({ title: "Error", description: "Please fill all required log fields.", variant: "destructive" });
           return;
         }
        onAddLog(newLog);
        setNewLog({ vehicleId: "", type: "mileage", reading: "", date: "", notes: "", fuelAmount: "", cost: "" });
      };

      const handleExport = () => {
        if (logs.length === 0) {
          toast({ title: "No Data", description: "There are no vehicle logs to export.", variant: "destructive" });
          return;
        }
        const dataToExport = logs.map(({ id, ...rest }) => ({
          Vehicle: getVehicleNumber(rest.vehicleId),
          Date: rest.date,
          Type: rest.type,
          Reading: rest.type === 'mileage' ? rest.reading : '',
          'Fuel Amount (L)': rest.type === 'refuel' ? rest.fuelAmount : '',
          'Cost': rest.type === 'refuel' ? rest.cost : '',
          Notes: rest.notes || '',
        }));
        exportToExcel(dataToExport, "VehicleLogs");
      };

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vehicle Log Book (Mileage, Fuel, Maintenance)</CardTitle>
               <Button onClick={handleExport} variant="outline" size="sm">
                 <Download className="mr-2 h-4 w-4" /> Export Logs
               </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <Label htmlFor="logVehicle">Vehicle</Label>
                     <Select onValueChange={(value) => setNewLog({...newLog, vehicleId: value})} value={newLog.vehicleId}>
                       <SelectTrigger id="logVehicle"><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
                       <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id.toString()}>{v.number} ({v.driver})</SelectItem>)}</SelectContent>
                     </Select>
                   </div>
                   <div>
                     <Label htmlFor="logType">Log Type</Label>
                     <Select onValueChange={(value) => setNewLog({...newLog, type: value})} value={newLog.type}>
                       <SelectTrigger id="logType"><SelectValue /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="mileage">Mileage Reading</SelectItem>
                         <SelectItem value="refuel">Refueling</SelectItem>
                         <SelectItem value="maintenance">Maintenance</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div><Label htmlFor="logDate">Date</Label><Input id="logDate" type="date" value={newLog.date} onChange={(e) => setNewLog({...newLog, date: e.target.value})} /></div>
                 </div>
                 {newLog.type === 'mileage' && (
                   <div><Label htmlFor="logReading">Mileage Reading (km)</Label><Input id="logReading" type="number" value={newLog.reading} onChange={(e) => setNewLog({...newLog, reading: e.target.value})} /></div>
                 )}
                 {newLog.type === 'refuel' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><Label htmlFor="logFuel">Fuel Amount (Liters)</Label><Input id="logFuel" type="number" value={newLog.fuelAmount} onChange={(e) => setNewLog({...newLog, fuelAmount: e.target.value})} /></div>
                     <div><Label htmlFor="logCost">Total Cost</Label><Input id="logCost" type="number" value={newLog.cost} onChange={(e) => setNewLog({...newLog, cost: e.target.value})} /></div>
                   </div>
                 )}
                 {(newLog.type === 'refuel' || newLog.type === 'maintenance') && (
                   <div><Label htmlFor="logNotes">Notes / Details</Label><Textarea id="logNotes" value={newLog.notes} onChange={(e) => setNewLog({...newLog, notes: e.target.value})} /></div>
                 )}
                <Button type="submit">Add Log Entry</Button>
              </form>
               <div className="mt-6 space-y-2">
                 <h3 className="text-lg font-medium">Recent Logs</h3>
                 {logs.slice(0, 5).map(log => (
                   <div key={log.id} className="text-sm p-2 bg-muted rounded">
                     {getVehicleNumber(log.vehicleId)} - {log.date} - {log.type}:
                     {log.type === 'mileage' && ` ${log.reading} km`}
                     {log.type === 'refuel' && ` ${log.fuelAmount}L, Cost: ${log.cost || 'N/A'}, Notes: ${log.notes || 'N/A'}`}
                     {log.type === 'maintenance' && ` Details: ${log.notes}`}
                   </div>
                 ))}
                  {logs.length === 0 && <p className="text-sm text-muted-foreground">No logs recorded yet.</p>}
               </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default VehicleLogBook;
  