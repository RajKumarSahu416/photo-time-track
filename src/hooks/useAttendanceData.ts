
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { mockDataServices, AttendanceStatus } from "@/services/mockData";

interface AttendanceDataItem {
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

interface UseAttendanceDataResult {
  attendanceData: { [key: string]: AttendanceDataItem };
  summary: {
    present: number;
    absent: number;
    leave: number;
    holiday: number;
  };
  loading: boolean;
}

export const useAttendanceData = (userId: string | undefined, selectedMonth: Date): UseAttendanceDataResult => {
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: AttendanceDataItem
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
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const records = await mockDataServices.getAttendance(userId, selectedMonth);
        
        // Convert to format needed by calendar
        const dataMap: {
          [key: string]: { status: AttendanceStatus; checkIn?: string; checkOut?: string }
        } = {};
        
        records.forEach(record => {
          const checkIn = record.checkInTime ? format(new Date(record.checkInTime), "h:mm a") : undefined;
          const checkOut = record.checkOutTime ? format(new Date(record.checkOutTime), "h:mm a") : undefined;
          
          dataMap[record.date] = {
            status: record.status,
            checkIn,
            checkOut,
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
  }, [userId, selectedMonth]);

  return { attendanceData, summary, loading };
};
