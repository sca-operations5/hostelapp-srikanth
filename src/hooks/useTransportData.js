
    import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo import
    import { useToast } from "@/components/ui/use-toast";

    const useLocalStorage = (key, initialValue) => {
      const [storedValue, setStoredValue] = useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error(`Error reading localStorage key “${key}”:`, error);
          return initialValue;
        }
      });

      const setValue = (value) => {
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key “${key}”:`, error);
        }
      };

      return [storedValue, setValue];
    };

    export const useTransportData = () => {
      const [vehicles, setVehicles] = useLocalStorage("vehicles", []);
      const [logs, setLogs] = useLocalStorage("transportLogs", []);
      const [driverAttendance, setDriverAttendance] = useLocalStorage("driverAttendance", []);
      const { toast } = useToast();

      const handleAddVehicle = useCallback((newVehicleData) => {
        const vehicle = { ...newVehicleData, id: Date.now(), currentLocation: "Campus", lastUpdated: new Date().toISOString() };
        setVehicles(prev => [vehicle, ...prev]);
        toast({ title: "Success", description: "Vehicle added successfully." });
      }, [setVehicles, toast]);

      const handleDeleteVehicle = useCallback((id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
        // Also remove related logs and attendance? Consider implications or add separate logic if needed.
        setLogs(prev => prev.filter(log => log.vehicleId !== id));
        toast({ title: "Success", description: "Vehicle removed successfully." });
      }, [setVehicles, setLogs, toast]);


      const handleAddLog = useCallback((newLogData) => {
        const logEntry = { ...newLogData, id: Date.now() };
        setLogs(prev => [logEntry, ...prev]);
        toast({ title: "Success", description: "Log entry added successfully." });
      }, [setLogs, toast]);

       const handleDeleteLog = useCallback((id) => {
         setLogs(prev => prev.filter(log => log.id !== id));
         toast({ title: "Success", description: "Log entry removed successfully." });
       }, [setLogs, toast]);


      const handleRecordAttendance = useCallback((newAttendanceData) => {
        const attendanceEntry = { ...newAttendanceData, id: Date.now() };
        setDriverAttendance(prev => [attendanceEntry, ...prev]);
        toast({ title: "Success", description: "Driver attendance recorded." });
      }, [setDriverAttendance, toast]);

       const handleDeleteAttendance = useCallback((id) => {
         setDriverAttendance(prev => prev.filter(att => att.id !== id));
         toast({ title: "Success", description: "Attendance record removed successfully." });
       }, [setDriverAttendance, toast]);


      const handleUpdateLocation = useCallback((id, location) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, currentLocation: location, lastUpdated: new Date().toISOString() } : v));
        toast({ title: "Updated", description: "Vehicle location updated." });
      }, [setVehicles, toast]);

      const getVehicleNumber = useCallback((id) => {
         // Ensure comparison is correct type if id from log is string
         const vehicleId = typeof id === 'string' ? parseInt(id, 10) : id;
         return vehicles.find(v => v.id === vehicleId)?.number || 'N/A';
       }, [vehicles]);


      const drivers = useMemo(() => [...new Set(vehicles.map(v => v.driver).filter(Boolean))], [vehicles]);

      return {
        vehicles,
        logs,
        driverAttendance,
        handleAddVehicle,
        handleDeleteVehicle,
        handleAddLog,
        handleDeleteLog,
        handleRecordAttendance,
        handleDeleteAttendance,
        handleUpdateLocation,
        getVehicleNumber,
        drivers,
        toast,
      };
    };
  