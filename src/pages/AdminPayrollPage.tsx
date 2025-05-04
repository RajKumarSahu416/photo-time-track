
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Search, User, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

// Mock employee payroll data
const employeePayrollData = [
  { 
    id: "1", 
    employeeName: "John Employee", 
    employeeId: "2",
    department: "Engineering",
    salary: 5000,
    workingDays: 22,
    presentDays: 20,
    leaves: 2,
    deductions: 500,
    netSalary: 4500,
    status: "pending",
  },
  { 
    id: "2", 
    employeeName: "Jane Smith", 
    employeeId: "3",
    department: "Marketing",
    salary: 4500,
    workingDays: 22,
    presentDays: 22,
    leaves: 0,
    deductions: 450,
    netSalary: 4050,
    status: "processing",
  },
  { 
    id: "3", 
    employeeName: "Alex Johnson", 
    employeeId: "4",
    department: "Finance",
    salary: 6000,
    workingDays: 22,
    presentDays: 21,
    leaves: 1,
    deductions: 550,
    netSalary: 5450,
    status: "paid",
  },
  { 
    id: "4", 
    employeeName: "Sarah Williams", 
    employeeId: "5",
    department: "HR",
    salary: 5500,
    workingDays: 22,
    presentDays: 18,
    leaves: 4,
    deductions: 1000,
    netSalary: 4500,
    status: "paid",
  }
];

const AdminPayrollPage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGeneratingPayroll, setIsGeneratingPayroll] = useState(false);
  
  // Filter payroll data
  const filteredPayroll = employeePayrollData.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleGeneratePayroll = () => {
    setIsGeneratingPayroll(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Payroll Generated",
        description: `Payroll for ${format(selectedMonth, "MMMM yyyy")} has been generated successfully`,
      });
      setIsGeneratingPayroll(false);
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>;
      case "pending":
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Pending</span>;
      case "processing":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Processing</span>;
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payroll Management</h1>
            <p className="text-muted-foreground">Generate and manage employee payroll</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={"justify-start text-left font-normal"}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedMonth, "MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => date && setSelectedMonth(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleGeneratePayroll} disabled={isGeneratingPayroll}>
              {isGeneratingPayroll ? "Generating..." : "Generate Payroll"}
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹21,000</div>
              <p className="text-xs text-muted-foreground">For {format(selectedMonth, "MMMM yyyy")}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Average Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹4,625</div>
              <p className="text-xs text-muted-foreground">Across 4 employees</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,500</div>
              <p className="text-xs text-muted-foreground">11.9% of total payroll</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Payroll Table Filters */}
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Payroll Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Payroll</CardTitle>
            <CardDescription>
              Payroll details for {format(selectedMonth, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Present/Total</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                      {record.presentDays}/{record.workingDays}
                    </TableCell>
                    <TableCell>₹{record.salary.toLocaleString()}</TableCell>
                    <TableCell>₹{record.deductions.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">₹{record.netSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Reports</CardTitle>
            <CardDescription>Download payroll reports by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">May 2025 Payroll Report</h4>
                    <p className="text-sm text-muted-foreground">Complete payroll report for the month</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">April 2025 Payroll Report</h4>
                    <p className="text-sm text-muted-foreground">Complete payroll report for the month</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">March 2025 Payroll Report</h4>
                    <p className="text-sm text-muted-foreground">Complete payroll report for the month</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayrollPage;
