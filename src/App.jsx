import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Unauthorized from "@/components/Unauthorized";
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
import Layout from "@/components/Layout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import ProtectedRoute from "@/components/ProtectedRoute";

const AppContent = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Admin and Warden Routes */}
        <Route
          path="staff"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden']}>
              <StaffManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="students"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden']}>
              <StudentManagement />
            </RoleBasedRoute>
          }
        />
        {/* Warden and Incharge Routes */}
        <Route
          path="complaints"
          element={
            <RoleBasedRoute allowedRoles={['warden', 'incharge', 'student']}>
              <ComplaintSystem />
            </RoleBasedRoute>
          }
        />
        <Route
          path="attendance"
          element={
            <RoleBasedRoute allowedRoles={['warden', 'incharge']}>
              <AttendanceSystem />
            </RoleBasedRoute>
          }
        />
        {/* Mess Incharge Routes */}
        <Route
          path="mess"
          element={
            <RoleBasedRoute allowedRoles={['mess_incharge']}>
              <MessManagement />
            </RoleBasedRoute>
          }
        />
        <Route
          path="food-feedback"
          element={
            <RoleBasedRoute allowedRoles={['mess_incharge', 'student']}>
              <FoodFeedback />
            </RoleBasedRoute>
          }
        />
        {/* Student Routes */}
        <Route
          path="leaves"
          element={
            <RoleBasedRoute allowedRoles={['student']}>
              <Leaves />
            </RoleBasedRoute>
          }
        />
        <Route
          path="outing-permissions"
          element={
            <RoleBasedRoute allowedRoles={['student']}>
              <OutingPermissions />
            </RoleBasedRoute>
          }
        />
        {/* Reception Routes */}
        <Route
          path="reception-log"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden', 'incharge']}>
              <ReceptionLog />
            </RoleBasedRoute>
          }
        />
        {/* Health Routes */}
        <Route
          path="health-log"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden', 'incharge']}>
              <HealthLog />
            </RoleBasedRoute>
          }
        />
        {/* Infrastructure Routes */}
        <Route
          path="infrastructure"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden']}>
              <InfrastructureManagement />
            </RoleBasedRoute>
          }
        />
        {/* Transport Routes */}
        <Route
          path="transport"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden']}>
              <TransportTracking />
            </RoleBasedRoute>
          }
        />
        {/* Meetings Routes */}
        <Route
          path="meetings"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'warden', 'incharge']}>
              <Meetings />
            </RoleBasedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <AppContent />
            <Toaster />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
  