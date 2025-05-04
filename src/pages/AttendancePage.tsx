
import React, { useState } from "react";
import { format, isSameDay, isWeekend } from "date-fns";
import { mockDataServices, AttendanceStatus } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DayProps } from "react-day-picker";

// Status color mapping
const statusColors: Record<AttendanceStatus, { bg: string; text: string }> = {
  present: { bg: "bg-green-500", text: "text-green-500" },
  absent: { bg: "bg-red-500", text: "text-red-500" },
  leave: { bg: "bg-blue-500", text: "text-blue-500" },
  holiday: { bg: "bg-amber-500", text: "text-amber-500" },
};

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: { status: AttendanceStatus; checkIn?: string; checkOut?: string }
  }>({});
  const [loading, setLoading] = useState(true);

  // Generate summary stats
  const summary = {
    present: Object.values(attendanceData).filter(a => a.status === "present").length,
    absent: Object.values(attendanceData).filter(a => a.status === "absent").length,
    leave: Object.values(attendanceData).filter(a => a.status === "leave").length,
    holiday: Object.values(attendanceData).filter(a => a.status === "holiday").length,
  };

  // Load attendance data for the selected month
  React.useEffect(() => {
    const loadAttendanceData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const records = await mockDataServices.getAttendance(user.id, selectedMonth);
        
        // Convert to format needed by calendar
        const dataMap: {
          [key: string]: { status: AttendanceStatus; checkIn?: string; checkOut?: string }
        } = {};
        
        records.forEach(record => {
          dataMap[record.date] = {
            status: record.status,
            checkIn: record.checkInTime ? format(new Date(record.checkInTime), "h:mm a") : undefined,
            checkOut: record.checkOutTime ? format(new Date(record.checkOutTime), "h:mm a") : undefined,
          };
        });
        
        setAttendanceData(dataMap);
      } catch (error) {
        console.error("Error loading attendance data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAttendanceData();
  }, [user?.id, selectedMonth]);

  // Custom day content component - updated to match DayProps
  const AttendanceDayContent = (props: DayProps) => {
    const dateStr = format(props.date, "yyyy-MM-dd");
    const attendance = attendanceData[dateStr];
    const isToday = isSameDay(props.date, new Date());
    
    return (
      <div className="w-full h-full min-h-[80px] p-1 relative flex flex-col">
        <div className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm absolute top-1 right-1",
          isToday && "bg-primary text-primary-foreground font-medium"
        )}>
          {format(props.date, "d")}
        </div>
        
        {attendance && (
          <div className="mt-8 pt-2">
            <div className={cn(
              "text-xs px-1.5 py-0.5 rounded-full inline-block mb-1",
              `bg-${statusColors[attendance.status].bg}/10`,
              statusColors[attendance.status].text
            )}>
              {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
            </div>
            
            {attendance.status === "present" && (
              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                {attendance.checkIn && (
                  <div>In: {attendance.checkIn}</div>
                )}
                {attendance.checkOut && (
                  <div>Out: {attendance.checkOut}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Calendar</h1>
          <p className="text-muted-foreground">Track your attendance history</p>
        </div>
        
        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-sm text-muted-foreground">Present Days</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{summary.present}</span>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-sm text-muted-foreground">Absent Days</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{summary.absent}</span>
                <div className="h-2 w-2 rounded-full bg-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-sm text-muted-foreground">Leaves</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{summary.leave}</span>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <p className="text-sm text-muted-foreground">Holidays</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{summary.holiday}</span>
                <div className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Attendance Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance Calendar</CardTitle>
            <CardDescription>View and track your attendance for {format(selectedMonth, "MMMM yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-0">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={(date) => date && setSelectedMonth(date)}
                className="rounded-md border"
                month={selectedMonth}
                showOutsideDays={false}
                disableNavigation={true}
                styles={{
                  caption_label: { fontSize: "inherit" },
                  day: { width: "100%", height: "100%" },
                  head_cell: { width: "100%", textTransform: "capitalize" },
                  row: { width: "100%" },
                  table: { width: "100%" },
                }}
                modifiers={{
                  weekend: (date) => isWeekend(date),
                }}
                modifiersStyles={{
                  weekend: { color: "#94a3b8" },
                }}
                disabled={(date) => {
                  // Disable future dates
                  return date > new Date();
                }}
                components={{
                  Day: AttendanceDayContent
                }}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2" />
                <span className="text-sm">Present</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2" />
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2" />
                <span className="text-sm">Leave</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2" />
                <span className="text-sm">Holiday</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
