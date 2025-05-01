
    import React, { useState, useEffect } from "react";
    import { useToast } from "@/components/ui/use-toast";
    import AddVehicleForm from "@/components/transport/AddVehicleForm";
    import DriverAttendance from "@/components/transport/DriverAttendance";
    import VehicleLogBook from "@/components/transport/VehicleLogBook";
    import ActiveVehicleList from "@/components/transport/ActiveVehicleList";

    function TransportTracking() {
      const [vehicles, setVehicles] = useState([]);
      const [logs, setLogs] = useState([]);
      const [driverAttendance, setDriverAttendance] = useState([]);
      const { toast } = useToast();

      useEffect(() => {
        const savedVehicles = localStorage.getItem("vehicles");
        if (savedVehicles) setVehicles(JSON.parse(savedVehicles));

        const savedLogs = localStorage.getItem("transportLogs");
        if (savedLogs) setLogs(JSON.parse(savedLogs));

        const savedAttendance = localStorage.getItem("driverAttendance");
        if (savedAttendance) setDriverAttendance(JSON.parse(savedAttendance));
      }, []);

      useEffect(() => { localStorage.setItem("vehicles", JSON.stringify(vehicles)); }, [vehicles]);
      useEffect(() => { localStorage.setItem("transportLogs", JSON.stringify(logs)); }, [logs]);
      useEffect(() => { localStorage.setItem("driverAttendance", JSON.stringify(driverAttendance)); }, [driverAttendance]);

      const handleAddVehicle = (newVehicleData) => {
        const vehicle = { ...newVehicleData, id: Date.now(), currentLocation: "Campus", lastUpdated: new Date().toISOString() };
        setVehicles([vehicle, ...vehicles]);
        toast({ title: "Success", description: "Vehicle added successfully." });
      };

      const handleAddLog = (newLogData) => {
        const logEntry = { ...newLogData, id: Date.now() };
        setLogs([logEntry, ...logs]);
        toast({ title: "Success", description: "Log entry added successfully." });
      };

      const handleRecordAttendance = (newAttendanceData) => {
        const attendanceEntry = { ...newAttendanceData, id: Date.now() };
        setDriverAttendance([attendanceEntry, ...driverAttendance]);
        toast({ title: "Success", description: "Driver attendance recorded." });
      };

      const handleUpdateLocation = (id, location) => {
        const updatedVehicles = vehicles.map(v => v.id === id ? { ...v, currentLocation: location, lastUpdated: new Date().toISOString() } : v);
        setVehicles(updatedVehicles);
        toast({ title: "Updated", description: "Vehicle location updated." });
      };

      const getVehicleNumber = (id) => vehicles.find(v => v.id === parseInt(id))?.number || 'N/A';

      const drivers = [...new Set(vehicles.map(v => v.driver))];

      return (
        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Transport Management & Tracking</h1>

          <AddVehicleForm onAddVehicle={handleAddVehicle} toast={toast} />

          <DriverAttendance
             drivers={drivers}
             attendance={driverAttendance}
             onRecordAttendance={handleRecordAttendance}
             toast={toast}
           />

          <VehicleLogBook
            vehicles={vehicles}
            logs={logs}
            onAddLog={handleAddLog}
            getVehicleNumber={getVehicleNumber}
            toast={toast}
          />

          <ActiveVehicleList
            vehicles={vehicles}
            onUpdateLocation={handleUpdateLocation}
          />
        </div>
      );
    }

    export default TransportTracking;
  