
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AttendanceSummaryProps {
  present: number;
  absent: number;
  leave: number;
  holiday: number;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  present,
  absent,
  leave,
  holiday,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card>
        <CardContent className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Present Days</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{present}</span>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Absent Days</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{absent}</span>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Leaves</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{leave}</span>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col">
          <p className="text-sm text-muted-foreground">Holidays</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{holiday}</span>
            <div className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSummary;
