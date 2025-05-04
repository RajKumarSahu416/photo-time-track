
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'holiday';
export type LeaveType = 'sick' | 'casual' | 'paid' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  joiningDate: string;
  leaveBalance: {
    sick: number;
    casual: number;
    paid: number;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInPhoto: string | null;
  checkOutPhoto: string | null;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  workingDays: number;
  presentDays: number;
  leavesTaken: number;
  baseSalary: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

// Generate mock employees
export const mockEmployees: Employee[] = [
  {
    id: "2",
    name: "John Employee",
    email: "employee@salarybox.com",
    position: "Software Developer",
    department: "Engineering",
    salary: 50000,
    joiningDate: "2023-01-15",
    leaveBalance: { sick: 10, casual: 7, paid: 15 }
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice@salarybox.com",
    position: "UI Designer",
    department: "Design",
    salary: 48000,
    joiningDate: "2023-03-10",
    leaveBalance: { sick: 8, casual: 5, paid: 12 }
  },
  {
    id: "4",
    name: "Bob Smith",
    email: "bob@salarybox.com",
    position: "Marketing Specialist",
    department: "Marketing",
    salary: 45000,
    joiningDate: "2023-02-20",
    leaveBalance: { sick: 10, casual: 6, paid: 14 }
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@salarybox.com",
    position: "HR Coordinator",
    department: "Human Resources",
    salary: 47000,
    joiningDate: "2023-01-05",
    leaveBalance: { sick: 9, casual: 7, paid: 15 }
  },
];

// Generate mock attendance for current month
export const generateMockAttendance = (employeeId: string, month: Date = new Date()): AttendanceRecord[] => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  return days.map(day => {
    const dayOfWeek = day.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPast = day < new Date();
    const isHoliday = day.getDate() === 1 || day.getDate() === 15; // Mock holidays
    
    let status: AttendanceStatus;
    let checkInTime: string | null = null;
    let checkOutTime: string | null = null;
    
    if (isHoliday) {
      status = 'holiday';
    } else if (isWeekend) {
      status = 'absent'; // Weekend marked as absent
    } else if (isPast) {
      // Randomly assign status for past days
      const rand = Math.random();
      if (rand > 0.9) {
        status = 'leave';
      } else if (rand > 0.8) {
        status = 'absent';
      } else {
        status = 'present';
        const dayDate = format(day, 'yyyy-MM-dd');
        checkInTime = `${dayDate}T09:${Math.floor(Math.random() * 15)}:00`;
        checkOutTime = `${dayDate}T17:${30 + Math.floor(Math.random() * 30)}:00`;
      }
    } else {
      status = 'absent'; // Future days are not marked yet
    }
    
    return {
      id: `att-${employeeId}-${format(day, 'yyyy-MM-dd')}`,
      employeeId,
      date: format(day, 'yyyy-MM-dd'),
      checkInTime,
      checkOutTime,
      checkInPhoto: status === 'present' ? '/placeholder.svg' : null,
      checkOutPhoto: status === 'present' ? '/placeholder.svg' : null,
      status,
    };
  });
};

// Generate mock leave requests
export const generateMockLeaveRequests = (employeeId: string): LeaveRequest[] => {
  const today = new Date();
  
  return [
    {
      id: `leave-${employeeId}-1`,
      employeeId,
      startDate: format(subDays(today, 20), 'yyyy-MM-dd'),
      endDate: format(subDays(today, 18), 'yyyy-MM-dd'),
      type: 'sick',
      reason: 'Fever and cold',
      status: 'approved',
      createdAt: format(subDays(today, 25), 'yyyy-MM-dd')
    },
    {
      id: `leave-${employeeId}-2`,
      employeeId,
      startDate: format(addDays(today, 5), 'yyyy-MM-dd'),
      endDate: format(addDays(today, 7), 'yyyy-MM-dd'),
      type: 'casual',
      reason: 'Family function',
      status: 'pending',
      createdAt: format(subDays(today, 2), 'yyyy-MM-dd')
    }
  ];
};

// Generate mock payroll
export const generateMockPayroll = (employeeId: string): PayrollRecord[] => {
  const employee = mockEmployees.find(e => e.id === employeeId);
  const baseSalary = employee?.salary || 0;
  
  const today = new Date();
  const currentMonth = today.getMonth();
  
  return [
    {
      id: `payroll-${employeeId}-${currentMonth-1}`,
      employeeId,
      month: format(new Date(today.getFullYear(), currentMonth-1, 1), 'yyyy-MM'),
      workingDays: 22,
      presentDays: 21,
      leavesTaken: 1,
      baseSalary,
      deductions: Math.round(baseSalary * 0.1),
      netSalary: Math.round(baseSalary - (baseSalary * 0.1)),
      status: 'paid'
    },
    {
      id: `payroll-${employeeId}-${currentMonth}`,
      employeeId,
      month: format(new Date(today.getFullYear(), currentMonth, 1), 'yyyy-MM'),
      workingDays: 21,
      presentDays: 0, // Current month in progress
      leavesTaken: 0,
      baseSalary,
      deductions: 0,
      netSalary: 0,
      status: 'pending'
    }
  ];
};

// Mock data services
export const mockDataServices = {
  // Employee services
  getEmployees: (): Promise<Employee[]> => {
    return Promise.resolve(mockEmployees);
  },
  
  getEmployee: (id: string): Promise<Employee | undefined> => {
    return Promise.resolve(mockEmployees.find(e => e.id === id));
  },
  
  // Attendance services
  getAttendance: (employeeId: string, month: Date = new Date()): Promise<AttendanceRecord[]> => {
    return Promise.resolve(generateMockAttendance(employeeId, month));
  },
  
  markAttendance: (employeeId: string, type: 'check-in' | 'check-out', photo: string): Promise<AttendanceRecord> => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // In a real app, we would update the database
    // Here we're just returning a mock response
    return Promise.resolve({
      id: `att-${employeeId}-${todayStr}`,
      employeeId,
      date: todayStr,
      checkInTime: type === 'check-in' ? format(today, "yyyy-MM-dd'T'HH:mm:ss") : null,
      checkOutTime: type === 'check-out' ? format(today, "yyyy-MM-dd'T'HH:mm:ss") : null,
      checkInPhoto: type === 'check-in' ? photo : null,
      checkOutPhoto: type === 'check-out' ? photo : null,
      status: 'present'
    });
  },
  
  // Leave services
  getLeaveRequests: (employeeId: string): Promise<LeaveRequest[]> => {
    return Promise.resolve(generateMockLeaveRequests(employeeId));
  },
  
  createLeaveRequest: (leaveRequest: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): Promise<LeaveRequest> => {
    const id = `leave-${leaveRequest.employeeId}-${Date.now()}`;
    return Promise.resolve({
      ...leaveRequest,
      id,
      status: 'pending',
      createdAt: format(new Date(), 'yyyy-MM-dd')
    });
  },
  
  // Payroll services
  getPayroll: (employeeId: string): Promise<PayrollRecord[]> => {
    return Promise.resolve(generateMockPayroll(employeeId));
  }
};
