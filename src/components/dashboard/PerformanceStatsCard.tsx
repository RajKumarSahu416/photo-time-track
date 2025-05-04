
import React from "react";
import { Check, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceStatsProps {
  completedTasks: number;
  pendingTasks: number;
  projectsCompleted: number;
}

const PerformanceStatsCard: React.FC<PerformanceStatsProps> = ({
  completedTasks,
  pendingTasks,
  projectsCompleted
}) => {
  return (
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
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <div className="text-sm text-muted-foreground">Tasks Pending</div>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <User size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">{projectsCompleted}</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceStatsCard;
