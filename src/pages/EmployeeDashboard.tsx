
import React from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AttendanceCard from "@/components/dashboard/AttendanceCard";
import MonthlyAttendanceCard from "@/components/dashboard/MonthlyAttendanceCard";
import LeaveBalanceCard from "@/components/dashboard/LeaveBalanceCard";
import PerformanceStatsCard from "@/components/dashboard/PerformanceStatsCard";

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  // Attendance statistics - would come from API in a real app
  const attendanceStats = {
    present: 18,
    absent: 2,
    leave: 1,
    late: 3,
  };

  // Performance stats - would come from API in a real app
  const performanceStats = {
    completedTasks: 37,
    pendingTasks: 5,
    projectsCompleted: 4,
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <div className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </div>
        </div>
        
        {/* Attendance Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <AttendanceCard />
          <MonthlyAttendanceCard 
            present={attendanceStats.present} 
            absent={attendanceStats.absent} 
            leave={attendanceStats.leave} 
            late={attendanceStats.late} 
          />
          <LeaveBalanceCard />
        </div>
        
        {/* Performance Stats */}
        <PerformanceStatsCard 
          completedTasks={performanceStats.completedTasks} 
          pendingTasks={performanceStats.pendingTasks} 
          projectsCompleted={performanceStats.projectsCompleted} 
        />
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
