
import React from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, CreditCard, DollarSign, FileText, User, Users } from "lucide-react";

const AdminDashboard: React.FC = () => {
  // Mock data for dashboard
  const stats = {
    totalEmployees: 45,
    presentToday: 38,
    onLeave: 3,
    pendingLeaveRequests: 5,
    totalSalary: 215000,
  };

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, employee: "John Employee", action: "Checked in", time: "09:05 AM", date: "2023-05-04" },
    { id: 2, employee: "Alice Johnson", action: "Applied for leave", time: "10:15 AM", date: "2023-05-04" },
    { id: 3, employee: "Bob Smith", action: "Checked out", time: "06:30 PM", date: "2023-05-03" },
    { id: 4, employee: "Emily Davis", action: "Leave approved", time: "11:45 AM", date: "2023-05-03" },
  ];

  // Mock data for pending approvals
  const pendingApprovals = [
    { id: 1, type: "Leave Request", employee: "Alice Johnson", date: "2023-05-10", status: "Pending" },
    { id: 2, type: "Attendance Correction", employee: "Bob Smith", date: "2023-05-03", status: "Pending" },
    { id: 3, type: "Leave Request", employee: "Emily Davis", date: "2023-05-15", status: "Pending" },
  ];

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalEmployees}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">
                +3 new this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.presentToday}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <User size={20} />
                </div>
              </div>
              <p className="text-xs mt-2 text-green-600">
                84% attendance rate
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Leave</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.onLeave}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Calendar size={20} />
                </div>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">
                3 pending requests
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.pendingLeaveRequests}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <FileText size={20} />
                </div>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">
                2 new since yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Payroll</p>
                  <h3 className="text-2xl font-bold mt-1">${stats.totalSalary.toLocaleString()}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <DollarSign size={20} />
                </div>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">
                For {format(new Date(), "MMMM yyyy")}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest employee activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.employee}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>
                        {format(new Date(activity.date), "MMM d")} at {activity.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Activity</Button>
            </CardFooter>
          </Card>
          
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="bg-muted p-3 rounded-md flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm">{item.employee}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(item.date), "MMM d, yyyy")}
                    </div>
                    <div className="pt-2 flex gap-2">
                      <Button size="sm" className="flex-1">Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <Users size={20} />
                <span>Add Employee</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <Calendar size={20} />
                <span>Manage Attendance</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <FileText size={20} />
                <span>Process Leave</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                <CreditCard size={20} />
                <span>Run Payroll</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
