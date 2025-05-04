import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Import page components directly
import Dashboard from "@/components/Dashboard";
import ComplaintSystem from "@/components/ComplaintSystem";
import AttendanceSystem from "@/components/AttendanceSystem";
import MessManagement from "@/components/MessManagement";
import TransportTracking from "@/components/TransportTracking";
import FoodFeedback from "@/components/FoodFeedback";
import Leaves from "@/components/Leaves";
import OutingPermissions from "@/components/OutingPermissions";
import ReceptionLog from "@/components/ReceptionLog";
import HealthLog from "@/components/HealthLog";
import InfrastructureManagement from "@/components/InfrastructureManagement";
import StaffManagement from "@/components/StaffManagement";
import StudentManagement from "@/components/StudentManagement";
import Meetings from "@/components/Meetings";
import Layout from "@/components/Layout"; // Keep layout for structure
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext"; // Keep provider, but its state won't restrict routes
import { Toaster } from "@/components/ui/toaster"; // Assuming Toaster is needed

// AppContent renders the routes within the Layout
const AppContent = () => {
  // No need for useAuth here for routing purposes anymore
  return (
    <Routes>
      {/* Wrap main content routes in Layout */} 
      <Route path="/" element={<Layout />}>
        {/* Define routes directly, no wrappers needed for now */}
        <Route index element={<Dashboard />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="complaints" element={<ComplaintSystem />} />
        <Route path="meetings" element={<Meetings />} />
        <Route path="attendance" element={<AttendanceSystem />} />
        <Route path="mess" element={<MessManagement />} />
        <Route path="food-feedback" element={<FoodFeedback />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="outing-permissions" element={<OutingPermissions />} />
        <Route path="reception-log" element={<ReceptionLog />} />
        <Route path="health-log" element={<HealthLog />} />
        <Route path="infrastructure" element={<InfrastructureManagement />} />
        <Route path="transport" element={<TransportTracking />} />
        {/* Add a redirect from old auth paths or a 404 */} 
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Route>
       {/* Define login route outside Layout if kept for later? Or remove completely */}
       {/* For now, let's remove login route entirely */}
       {/* <Route path="/login" element={<div>Login Page Removed for Prototype</div>} /> */}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      {/* Keep providers, context state won't block routes now */}
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-background">
            <AppContent />
            <Toaster />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
  