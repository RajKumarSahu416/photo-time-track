
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LeaveBalanceCard: React.FC = () => {
  return (
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
  );
};

export default LeaveBalanceCard;
