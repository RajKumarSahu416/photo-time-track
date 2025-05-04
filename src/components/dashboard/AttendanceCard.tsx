
import React, { useState } from "react";
import { format } from "date-fns";
import { Clock, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCamera } from "@/hooks/useCamera";
import { mockDataServices } from "@/services/mockData";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AttendanceCard: React.FC = () => {
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
  );
};

export default AttendanceCard;
