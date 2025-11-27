"use client";

import { CheckCircle, Clock, XCircle, Camera, FileText, Award } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: {
    id: string;
    task_name: string;
    description: string;
    status: string;
    base_points_value: number;
    frequency: string;
    verification_type: string;
    due_date: string;
    points_earned?: number;
    task_categories?: { name: string; code: string };
    risk_categories?: { name: string; code: string };
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
      label: "Pending",
    },
    completed: {
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      label: "Completed",
    },
    verified: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      label: "Verified",
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900/20",
      label: "Rejected",
    },
  };

  const verificationConfig = {
    photo: { icon: Camera, label: "Photo" },
    receipt: { icon: FileText, label: "Receipt" },
    document: { icon: FileText, label: "Document" },
    both: { icon: Camera, label: "Photo or Receipt" },
  };

  const StatusIcon = statusConfig[task.status as keyof typeof statusConfig]?.icon || Clock;
  const VerificationIcon =
    verificationConfig[task.verification_type as keyof typeof verificationConfig]?.icon || Camera;

  const isOverdue =
    task.status === "pending" &&
    new Date(task.due_date) < new Date() &&
    new Date(task.due_date).toDateString() !== new Date().toDateString();

  return (
    <div
      className={cn(
        "bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all",
        isOverdue && "border-2 border-destructive"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-heading font-bold text-card-foreground">
              {task.task_name}
            </h3>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded flex items-center gap-1",
                statusConfig[task.status as keyof typeof statusConfig]?.bg,
                statusConfig[task.status as keyof typeof statusConfig]?.color
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig[task.status as keyof typeof statusConfig]?.label}
            </span>
            {isOverdue && (
              <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded">
                Overdue
              </span>
            )}
          </div>
          <p className="text-muted-foreground mb-3">{task.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {task.task_categories && (
              <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                {task.task_categories.name}
              </span>
            )}
            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded capitalize">
              {task.frequency}
            </span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded flex items-center gap-1">
              <Award className="w-3 h-3" />
              {task.base_points_value} pts
            </span>
            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded flex items-center gap-1">
              <VerificationIcon className="w-3 h-3" />
              {verificationConfig[task.verification_type as keyof typeof verificationConfig]?.label}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <span>Due: {format(new Date(task.due_date), "MMM d, yyyy")}</span>
            {task.points_earned && (
              <span className="ml-4 text-accent font-semibold">
                Earned: {task.points_earned} points
              </span>
            )}
          </div>
        </div>
      </div>

      {task.status === "pending" && (
        <Button variant="hero" className="w-full" asChild>
          <Link href={`/tasks/${task.id}/complete`}>Complete Task</Link>
        </Button>
      )}

      {task.status === "completed" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-muted-foreground">
          Task completed, awaiting verification...
        </div>
      )}

      {task.status === "verified" && (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm text-muted-foreground">
          ✓ Task verified and points awarded!
        </div>
      )}

      {task.status === "rejected" && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-muted-foreground">
          Task verification was rejected. Please review and resubmit.
        </div>
      )}
    </div>
  );
}

