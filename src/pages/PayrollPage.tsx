
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  
  // Mock payroll data - would come from API in a real app
  const payrollData = [
    {
      month: "April 2025",
      workingDays: 22,
      presentDays: 20,
      leaves: 2,
      basicSalary: 5000,
      allowances: 1500,
      deductions: 700,
      netSalary: 5800,
      status: "Paid",
      paidOn: "30 Apr 2025",
    },
    {
      month: "March 2025",
      workingDays: 23,
      presentDays: 21,
      leaves: 2,
      basicSalary: 5000,
      allowances: 1500,
      deductions: 700,
      netSalary: 5800,
      status: "Paid",
      paidOn: "30 Mar 2025",
    },
    {
      month: "February 2025",
      workingDays: 20,
      presentDays: 18,
      leaves: 2,
      basicSalary: 5000,
      allowances: 1500,
      deductions: 700,
      netSalary: 5800,
      status: "Paid",
      paidOn: "28 Feb 2025",
    }
  ];

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">View your salary slips and payment history</p>
        </div>
        
        {/* Latest Salary Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Latest Salary</CardTitle>
            <CardDescription>April 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">₹5,800</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Basic Salary</div>
                <div>₹5,000</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Allowances</div>
                <div>₹1,500</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Deductions</div>
                <div>₹700</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Paid On</div>
                <div>30 Apr 2025</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Year Selector and Payslips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Salary History</CardTitle>
              <CardDescription>View and download your salary slips</CardDescription>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md divide-y">
              {payrollData.map((payroll, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{payroll.month}</div>
                      <div className="text-sm text-muted-foreground">
                        Net Salary: ₹{payroll.netSalary}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
            <CardDescription>View detailed salary components</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="april">
              <TabsList className="mb-4">
                <TabsTrigger value="april">April 2025</TabsTrigger>
                <TabsTrigger value="march">March 2025</TabsTrigger>
                <TabsTrigger value="february">February 2025</TabsTrigger>
              </TabsList>
              
              <TabsContent value="april" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Basic Salary</span>
                          <span>₹5,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">HRA</span>
                          <span>₹1,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transport Allowance</span>
                          <span>₹500</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-medium">
                          <span>Total Earnings</span>
                          <span>₹6,500</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Income Tax</span>
                          <span>₹400</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Professional Tax</span>
                          <span>₹200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Provident Fund</span>
                          <span>₹100</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-medium">
                          <span>Total Deductions</span>
                          <span>₹700</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Attendance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="text-lg font-medium">22</div>
                        <div className="text-sm text-muted-foreground">Working Days</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="text-lg font-medium">20</div>
                        <div className="text-sm text-muted-foreground">Present Days</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="text-lg font-medium">2</div>
                        <div className="text-sm text-muted-foreground">Leave Days</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="march" className="text-center p-4 text-muted-foreground">
                March 2025 payslip details will appear here
              </TabsContent>
              
              <TabsContent value="february" className="text-center p-4 text-muted-foreground">
                February 2025 payslip details will appear here
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PayrollPage;
