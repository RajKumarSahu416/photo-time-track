
import React from "react";
import { format, isWeekend } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { AttendanceStatus } from "@/services/mockData";
import AttendanceCalendarLegend from "./AttendanceCalendarLegend";
import AttendanceDayContent from "./AttendanceDayContent";

interface AttendanceCalendarProps {
  selectedMonth: Date;
  attendanceData: {
    [key: string]: { status: AttendanceStatus; checkIn?: string; checkOut?: string }
  };
  onSelectMonth: (date: Date) => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  selectedMonth,
  attendanceData,
  onSelectMonth
}) => {
  // Custom day content wrapper that passes attendanceData
  const DayContentWrapper = (props: any) => (
    <AttendanceDayContent {...props} attendanceData={attendanceData} />
  );

  return (
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
            onSelect={(date) => date && onSelectMonth(date)}
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
              Day: DayContentWrapper
            }}
          />
        </div>
        
        <AttendanceCalendarLegend />
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
