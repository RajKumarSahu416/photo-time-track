
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAttendanceData } from "@/hooks/useAttendanceData";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import AttendanceCalendar from "@/components/attendance/AttendanceCalendar";

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const { attendanceData, summary, loading } = useAttendanceData(user?.id, selectedMonth);

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Calendar</h1>
          <p className="text-muted-foreground">Track your attendance history</p>
        </div>
        
        {/* Attendance Summary Cards */}
        <AttendanceSummary 
          present={summary.present}
          absent={summary.absent}
          leave={summary.leave}
          holiday={summary.holiday}
        />
        
        {/* Attendance Calendar */}
        <AttendanceCalendar 
          selectedMonth={selectedMonth}
          attendanceData={attendanceData}
          onSelectMonth={setSelectedMonth}
        />
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
