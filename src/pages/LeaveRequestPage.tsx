
import React, { useState } from "react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockDataServices } from "@/services/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LeaveRequestPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [leaveType, setLeaveType] = useState<string>("sick");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Leave balance - would come from API in a real app
  const leaveBalance = {
    sick: 8,
    casual: 5,
    paid: 12
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !leaveType) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (endDate < startDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we'd send this to Supabase
      await mockDataServices.createLeaveRequest({
        employeeId: user?.id || "",
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        type: leaveType,
        reason: reason,
      });
      
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      
      // Reset form
      setReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">Submit and manage your leave requests</p>
        </div>
        
        {/* Leave Balance Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sick Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.sick} days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Casual Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.casual} days</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Paid Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveBalance.paid} days</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Leave Request Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Request Leave</CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="border rounded-md">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="border rounded-md">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < startDate!}
                      initialFocus
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select
                  value={leaveType}
                  onValueChange={setLeaveType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="paid">Paid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe the reason for your leave request"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Leave History */}
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>Your previous leave requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md divide-y">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">Sick Leave</div>
                  <div className="text-sm text-muted-foreground">May 10 - May 12, 2025</div>
                </div>
                <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">Pending</div>
              </div>
              
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">Casual Leave</div>
                  <div className="text-sm text-muted-foreground">Apr 5 - Apr 6, 2025</div>
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Approved</div>
              </div>
              
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">Paid Leave</div>
                  <div className="text-sm text-muted-foreground">Mar 15 - Mar 20, 2025</div>
                </div>
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LeaveRequestPage;
