
import React from "react";

const AttendanceCalendarLegend: React.FC = () => {
  return (
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
  );
};

export default AttendanceCalendarLegend;
