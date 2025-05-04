
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/auth/RouteGuard";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AttendancePage from "./pages/AttendancePage";
import LeaveRequestPage from "./pages/LeaveRequestPage";
import PayrollPage from "./pages/PayrollPage";
import AdminEmployeesPage from "./pages/AdminEmployeesPage";
import AdminAttendancePage from "./pages/AdminAttendancePage";
import AdminLeavePage from "./pages/AdminLeavePage";
import AdminPayrollPage from "./pages/AdminPayrollPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirect root to appropriate dashboard */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Employee Routes */}
            <Route 
              path="/dashboard" 
              element={
                <RouteGuard requiredRole="employee">
                  <EmployeeDashboard />
                </RouteGuard>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <RouteGuard requiredRole="employee">
                  <AttendancePage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/leave" 
              element={
                <RouteGuard requiredRole="employee">
                  <LeaveRequestPage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/payroll" 
              element={
                <RouteGuard requiredRole="employee">
                  <PayrollPage />
                </RouteGuard>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <RouteGuard requiredRole="admin">
                  <AdminDashboard />
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/employees" 
              element={
                <RouteGuard requiredRole="admin">
                  <AdminEmployeesPage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/attendance" 
              element={
                <RouteGuard requiredRole="admin">
                  <AdminAttendancePage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/leave" 
              element={
                <RouteGuard requiredRole="admin">
                  <AdminLeavePage />
                </RouteGuard>
              } 
            />
            <Route 
              path="/admin/payroll" 
              element={
                <RouteGuard requiredRole="admin">
                  <AdminPayrollPage />
                </RouteGuard>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
