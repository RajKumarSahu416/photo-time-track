
import React, { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, Calendar as CalendarIcon, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

type AttendanceStatus = "present" | "absent" | "leave" | "holiday";

// Mock attendance data - would come from API in a real app
const attendanceData = [
  { 
    id: "1", 
    employeeName: "John Employee", 
    employeeId: "2",
    date: "2025-05-01",
    checkIn: "09:05 AM",
    checkOut: "06:10 PM",
    status: "present" as AttendanceStatus,
    hoursWorked: "9:05",
  },
  { 
    id: "2", 
    employeeName: "Jane Smith", 
    employeeId: "3",
    date: "2025-05-01",
    checkIn: "09:15 AM",
    checkOut: "06:00 PM",
    status: "present" as AttendanceStatus,
    hoursWorked: "8:45",
  },
  { 
    id: "3", 
    employeeName: "Alex Johnson", 
    employeeId: "4",
    date: "2025-05-01",
    checkIn: null,
    checkOut: null,
    status: "absent" as AttendanceStatus,
    hoursWorked: "0:00",
  },
  { 
    id: "4", 
    employeeName: "Sarah Williams", 
    employeeId: "5",
    date: "2025-05-01",
    checkIn: null,
    checkOut: null,
    status: "leave" as AttendanceStatus,
    hoursWorked: "0:00",
  }
];

// Summary stats
const attendanceSummary = {
  today: {
    present: 15,
    absent: 3,
    leave: 2,
    total: 20
  },
  month: {
    workingDays: 22,
    averageAttendance: "90%"
  }
};

const AdminAttendancePage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get date string for query
  const dateString = format(selectedDate, "yyyy-MM-dd");
  
  // Filter attendance data
  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Present</span>;
      case "absent":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Absent</span>;
      case "leave":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Leave</span>;
      case "holiday":
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Holiday</span>;
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">Monitor and manage employee attendance</p>
          </div>
        </div>
        
        {/* Attendance Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceSummary.today.present}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((attendanceSummary.today.present / attendanceSummary.today.total) * 100)}% of total employees
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Absent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{attendanceSummary.today.absent}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((attendanceSummary.today.absent / attendanceSummary.today.total) * 100)}% of total employees
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">On Leave Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{attendanceSummary.today.leave}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((attendanceSummary.today.leave / attendanceSummary.today.total) * 100)}% of total employees
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Monthly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceSummary.month.averageAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Based on {attendanceSummary.month.workingDays} working days
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Attendance Table Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={"w-[240px] justify-start text-left font-normal"}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>
              Employee attendance for {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours Worked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.checkIn || "—"}
                    </TableCell>
                    <TableCell>
                      {record.checkOut || "—"}
                    </TableCell>
                    <TableCell>
                      {record.hoursWorked}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2">
                        <User className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Monthly Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
            <CardDescription>
              Attendance summary for {format(selectedDate, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {eachDayOfInterval({
                start: startOfMonth(selectedDate),
                end: endOfMonth(selectedDate)
              }).map((day, i) => {
                const isPast = day <= new Date();
                const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                
                // Mock data - in real app would come from aggregations
                const dayStatus = isPast ? 
                  (i % 7 === 0 || i % 7 === 6) ? "weekend" :
                  (i % 15 === 0) ? "holiday" :
                  (i % 10 === 0) ? "low" :
                  "high" : "future";
                
                let bgClass = "bg-gray-100";
                if (dayStatus === "high") bgClass = "bg-green-100";
                if (dayStatus === "low") bgClass = "bg-amber-100";
                if (dayStatus === "holiday") bgClass = "bg-blue-100";
                if (dayStatus === "weekend") bgClass = "bg-gray-50";
                if (dayStatus === "future") bgClass = "bg-gray-50 text-gray-400";
                if (isToday) bgClass = "bg-primary/20";
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`p-2 text-center rounded-md ${bgClass} ${isToday ? 'ring-1 ring-primary' : ''}`}
                  >
                    <div className="text-xs mb-1">{format(day, "EEE")}</div>
                    <div className="font-medium">{format(day, "d")}</div>
                    {isPast && dayStatus !== "weekend" && (
                      <div className={`text-xs ${
                        dayStatus === "high" ? "text-green-600" :
                        dayStatus === "low" ? "text-amber-600" :
                        dayStatus === "holiday" ? "text-blue-600" : ""
                      }`}>
                        {dayStatus === "high" && "95%"}
                        {dayStatus === "low" && "75%"}
                        {dayStatus === "holiday" && "Holiday"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAttendancePage;
