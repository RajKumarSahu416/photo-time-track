
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Mock leave requests - would come from API in a real app
const leaveRequests = [
  { 
    id: "1", 
    employeeName: "John Employee", 
    employeeId: "2",
    leaveType: "Sick Leave",
    startDate: "2025-05-10",
    endDate: "2025-05-12",
    reason: "Not feeling well, need rest",
    status: "pending",
    appliedOn: "2025-05-08",
  },
  { 
    id: "2", 
    employeeName: "Jane Smith", 
    employeeId: "3",
    leaveType: "Casual Leave",
    startDate: "2025-05-15",
    endDate: "2025-05-16",
    reason: "Family function",
    status: "pending",
    appliedOn: "2025-05-07",
  },
  { 
    id: "3", 
    employeeName: "Alex Johnson", 
    employeeId: "4",
    leaveType: "Paid Leave",
    startDate: "2025-05-20",
    endDate: "2025-05-25",
    reason: "Vacation",
    status: "approved",
    appliedOn: "2025-05-05",
  },
  { 
    id: "4", 
    employeeName: "Sarah Williams", 
    employeeId: "5",
    leaveType: "Sick Leave",
    startDate: "2025-05-01",
    endDate: "2025-05-02",
    reason: "Fever",
    status: "rejected",
    appliedOn: "2025-04-30",
  }
];

const AdminLeavePage: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  const filteredLeaves = leaveRequests.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === "all" || leave.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleApprove = (leaveId: string) => {
    // In a real app, send this to Supabase
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully",
    });
  };
  
  const handleReject = (leaveId: string) => {
    // In a real app, send this to Supabase
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected",
    });
    setRejectReason("");
    setIsViewDetailsOpen(false);
  };
  
  const viewDetails = (leave: any) => {
    setSelectedLeave(leave);
    setIsViewDetailsOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Review and manage employee leave requests</p>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leave requests..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Review and manage employee leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell className="font-medium">{leave.employeeName}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>
                      {format(new Date(leave.startDate), "dd MMM yyyy")} - {format(new Date(leave.endDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{format(new Date(leave.appliedOn), "dd MMM yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => viewDetails(leave)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      {leave.status === "pending" && (
                        <>
                          <Button variant="ghost" size="sm" className="ml-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700" 
                            onClick={() => handleApprove(leave.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button variant="ghost" size="sm" className="ml-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            onClick={() => viewDetails(leave)}>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Requires your attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Total 15 days of leave</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Rejected This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Total 2 days of leave</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Leave Details Dialog */}
      {selectedLeave && (
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Leave Request Details</DialogTitle>
              <DialogDescription>
                Review the leave request details and take action
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Employee</h4>
                  <p className="font-medium">{selectedLeave.employeeName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Leave Type</h4>
                  <p className="font-medium">{selectedLeave.leaveType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">From</h4>
                  <p className="font-medium">{format(new Date(selectedLeave.startDate), "dd MMM yyyy")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">To</h4>
                  <p className="font-medium">{format(new Date(selectedLeave.endDate), "dd MMM yyyy")}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Applied On</h4>
                  <p className="font-medium">{format(new Date(selectedLeave.appliedOn), "dd MMM yyyy")}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                  <p>{selectedLeave.reason}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <div className="mt-1">{getStatusBadge(selectedLeave.status)}</div>
                </div>
              </div>
              
              {selectedLeave.status === "pending" && (
                <div className="pt-2">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Rejection Reason (Optional)</h4>
                    <Textarea 
                      placeholder="Provide a reason for rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-2 justify-end">
                    <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Cancel</Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleReject(selectedLeave.id)}
                    >
                      Reject Leave
                    </Button>
                    <Button 
                      onClick={() => handleApprove(selectedLeave.id)}
                    >
                      Approve Leave
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default AdminLeavePage;
