
import React, { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useCamera } from "@/hooks/useCamera";
import { mockDataServices } from "@/services/mockData";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Clock, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { videoRef, photo, isLoading, takePhoto, resetPhoto, startCamera, stopCamera } = useCamera();
  const [attendanceMode, setAttendanceMode] = useState<'check-in' | 'check-out' | null>(null);
  const [processingAttendance, setProcessingAttendance] = useState(false);
  const { toast } = useToast();
  const [todayAttendance, setTodayAttendance] = useState<{
    checkedIn: boolean;
    checkedOut: boolean;
    checkInTime: string | null;
  }>({
    checkedIn: false,
    checkedOut: false,
    checkInTime: null,
  });

  // Attendance statistics - would come from API in a real app
  const attendanceStats = {
    present: 18,
    absent: 2,
    leave: 1,
    late: 3,
  };

  // Performance stats - would come from API in a real app
  const performanceStats = {
    completedTasks: 37,
    pendingTasks: 5,
    projectsCompleted: 4,
  };

  const handleStartAttendance = (mode: 'check-in' | 'check-out') => {
    setAttendanceMode(mode);
    startCamera();
  };

  const handleCancelAttendance = () => {
    stopCamera();
    resetPhoto();
    setAttendanceMode(null);
  };

  const handleSubmitAttendance = async () => {
    if (!photo || !user?.id) return;
    
    setProcessingAttendance(true);
    
    try {
      // In a real app, we'd upload the photo to Supabase storage
      // and create an attendance record in the database
      await mockDataServices.markAttendance(user.id, attendanceMode!, photo);
      
      if (attendanceMode === 'check-in') {
        setTodayAttendance({
          checkedIn: true,
          checkedOut: false,
          checkInTime: format(new Date(), 'HH:mm'),
        });
      } else {
        setTodayAttendance(prev => ({
          ...prev,
          checkedOut: true,
        }));
      }
      
      toast({
        title: "Success",
        description: `${attendanceMode === 'check-in' ? 'Checked in' : 'Checked out'} successfully`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${attendanceMode}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingAttendance(false);
      stopCamera();
      resetPhoto();
      setAttendanceMode(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
          <div className="text-sm text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </div>
        </div>
        
        {/* Attendance Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Attendance</CardTitle>
              <CardDescription>Mark your attendance for today</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceMode === null ? (
                <div className="space-y-4">
                  <div className="flex items-center mb-4 text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Current Time: {format(new Date(), "h:mm a")}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      onClick={() => handleStartAttendance('check-in')}
                      disabled={todayAttendance.checkedIn}
                    >
                      <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                      Check In
                      {todayAttendance.checkInTime && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {todayAttendance.checkInTime}
                        </span>
                      )}
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      onClick={() => handleStartAttendance('check-out')}
                      disabled={!todayAttendance.checkedIn || todayAttendance.checkedOut}
                      variant={todayAttendance.checkedIn && !todayAttendance.checkedOut ? "default" : "outline"}
                    >
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                      Check Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!photo ? (
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                      ) : (
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          muted 
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                      <img src={photo} alt="Capture" className="h-full w-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {!photo ? (
                      <Button 
                        onClick={takePhoto}
                        className="flex-1 record-button"
                        variant="outline"
                        disabled={isLoading}
                      >
                        <div className="z-10 h-3 w-3 rounded-full bg-destructive" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSubmitAttendance}
                        className="flex-1 gap-2"
                        disabled={processingAttendance}
                      >
                        <Check size={18} />
                        Submit
                      </Button>
                    )}
                    <Button 
                      onClick={handleCancelAttendance}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Monthly Attendance</CardTitle>
              <CardDescription>Your attendance this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-3 bg-muted/50 rounded-md">
                  <span className="text-3xl font-bold text-green-500">{attendanceStats.present}</span>
                  <span className="text-sm text-muted-foreground">Present Days</span>
                </div>
                <div className="flex flex-col p-3 bg-muted/50 rounded-md">
                  <span className="text-3xl font-bold text-red-500">{attendanceStats.absent}</span>
                  <span className="text-sm text-muted-foreground">Absent Days</span>
                </div>
                <div className="flex flex-col p-3 bg-muted/50 rounded-md">
                  <span className="text-3xl font-bold text-amber-500">{attendanceStats.late}</span>
                  <span className="text-sm text-muted-foreground">Late Days</span>
                </div>
                <div className="flex flex-col p-3 bg-muted/50 rounded-md">
                  <span className="text-3xl font-bold text-blue-500">{attendanceStats.leave}</span>
                  <span className="text-sm text-muted-foreground">Leave Days</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/attendance"}>
                <Calendar size={16} className="mr-2" />
                View Calendar
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Leave Balance</CardTitle>
              <CardDescription>Your available leave days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">Sick Leave</span>
                  <span className="text-lg font-medium">8 days</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">Casual Leave</span>
                  <span className="text-lg font-medium">5 days</span>
                </div>
                <div className="flex justify-between p-3 bg-muted/50 rounded-md">
                  <span className="text-sm">Paid Leave</span>
                  <span className="text-lg font-medium">12 days</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/leave"}>
                Apply for Leave
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Check size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceStats.completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks Completed</div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceStats.pendingTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks Pending</div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <User size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{performanceStats.projectsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
