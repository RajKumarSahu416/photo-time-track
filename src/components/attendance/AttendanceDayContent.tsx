
import React from "react";
import { format, isSameDay } from "date-fns";
import { DayProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { AttendanceStatus } from "@/services/mockData";

interface AttendanceDayContentProps extends DayProps {
  attendanceData: {
    [key: string]: { status: AttendanceStatus; checkIn?: string; checkOut?: string }
  };
}

// Status color mapping
const statusColors: Record<AttendanceStatus, { bg: string; text: string }> = {
  present: { bg: "bg-green-500", text: "text-green-500" },
  absent: { bg: "bg-red-500", text: "text-red-500" },
  leave: { bg: "bg-blue-500", text: "text-blue-500" },
  holiday: { bg: "bg-amber-500", text: "text-amber-500" },
};

const AttendanceDayContent: React.FC<AttendanceDayContentProps> = ({ date, attendanceData }) => {
  const dateStr = format(date, "yyyy-MM-dd");
  const attendance = attendanceData[dateStr];
  const isToday = isSameDay(date, new Date());
  
  return (
    <div className="w-full h-full min-h-[80px] p-1 relative flex flex-col">
      <div className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm absolute top-1 right-1",
        isToday && "bg-primary text-primary-foreground font-medium"
      )}>
        {format(date, "d")}
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

export default AttendanceDayContent;
