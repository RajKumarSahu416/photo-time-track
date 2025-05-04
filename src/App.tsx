
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
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <RouteGuard requiredRole="admin">
                  <AdminDashboard />
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
