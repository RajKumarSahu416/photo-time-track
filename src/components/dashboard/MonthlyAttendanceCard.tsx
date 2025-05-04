
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AttendanceStatsProps {
  present: number;
  absent: number;
  leave: number;
  late: number;
}

const MonthlyAttendanceCard: React.FC<AttendanceStatsProps> = ({
  present,
  absent,
  leave,
  late
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Monthly Attendance</CardTitle>
        <CardDescription>Your attendance this month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col p-3 bg-muted/50 rounded-md">
            <span className="text-3xl font-bold text-green-500">{present}</span>
            <span className="text-sm text-muted-foreground">Present Days</span>
          </div>
          <div className="flex flex-col p-3 bg-muted/50 rounded-md">
            <span className="text-3xl font-bold text-red-500">{absent}</span>
            <span className="text-sm text-muted-foreground">Absent Days</span>
          </div>
          <div className="flex flex-col p-3 bg-muted/50 rounded-md">
            <span className="text-3xl font-bold text-amber-500">{late}</span>
            <span className="text-sm text-muted-foreground">Late Days</span>
          </div>
          <div className="flex flex-col p-3 bg-muted/50 rounded-md">
            <span className="text-3xl font-bold text-blue-500">{leave}</span>
            <span className="text-sm text-muted-foreground">Leave Days</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => window.location.href = "/attendance"}>
          <Calendar size={16} className="mr-2" />
          View Calendar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MonthlyAttendanceCard;
