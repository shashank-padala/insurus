"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Camera,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Home,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { format, isPast, parseISO } from "date-fns";

type TaskFilter = "all" | "pending" | "in_progress" | "completed" | "overdue";

export default function TasksPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");
        return;
      }

      const response = await fetch(`/api/tasks?filter=${filter}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (task: any) => {
    const dueDate = task.due_date ? parseISO(task.due_date) : null;
    const isOverdue = dueDate && isPast(dueDate) && task.status !== "verified" && task.status !== "completed";
    
    if (task.status === "verified" || task.status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="w-3 h-3" />
          Overdue
        </span>
      );
    }
    
    if (task.status === "in_progress") {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Clock className="w-3 h-3" />
          In Progress
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const getVerificationIcon = (type: string) => {
    if (type === "photo") return <Camera className="w-4 h-4" />;
    if (type === "receipt") return <FileText className="w-4 h-4" />;
    if (type === "both") return (
      <div className="flex gap-0.5">
        <Camera className="w-3 h-3" />
        <FileText className="w-3 h-3" />
      </div>
    );
    return <Camera className="w-4 h-4" />;
  };

  const getPropertyName = (task: any) => {
    const checklist = Array.isArray(task.task_checklists) 
      ? task.task_checklists[0] 
      : task.task_checklists;
    const property = Array.isArray(checklist?.properties)
      ? checklist.properties[0]
      : checklist?.properties;
    return property?.address || "Unknown Property";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Tasks
          </h1>
          <p className="text-muted-foreground">
            Complete safety tasks to earn points and improve your safety score
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as TaskFilter)} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm">In Progress</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs sm:text-sm">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="bg-card p-12 rounded-xl shadow-card text-center">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
              No {filter !== "all" ? filter.replace("_", " ") : ""} tasks
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === "all" 
                ? "You don't have any tasks yet. Add a property to get started."
                : `You don't have any ${filter.replace("_", " ")} tasks at the moment.`}
            </p>
            {filter === "all" && (
              <Button variant="hero" asChild>
                <Link href="/properties/new">Add Property</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: any) => {
              const dueDate = task.due_date ? parseISO(task.due_date) : null;
              const isOverdue = dueDate && isPast(dueDate) && task.status !== "verified" && task.status !== "completed";
              const canComplete = task.status === "pending" || task.status === null || task.status === "in_progress";
              
              return (
                <div
                  key={task.id}
                  className="bg-card p-4 sm:p-6 rounded-xl shadow-card hover:shadow-glow transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Task Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-heading font-bold text-card-foreground mb-1">
                            {task.task_name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                        </div>
                        {getStatusBadge(task)}
                      </div>

                      {/* Task Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Home className="w-4 h-4" />
                          <span>{getPropertyName(task)}</span>
                        </div>
                        {dueDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
                              {format(dueDate, "MMM d, yyyy")}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          {getVerificationIcon(task.verification_type || "photo")}
                          <span className="capitalize">
                            {task.verification_type === "both" ? "Photo or Receipt" : task.verification_type || "Photo"}
                          </span>
                        </div>
                        {task.base_points_value && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-accent">
                              +{task.base_points_value * 10} pts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Button */}
                    {canComplete && (
                      <div className="flex sm:flex-col gap-2 sm:min-w-[140px]">
                        <Button
                          variant="hero"
                          size="lg"
                          className="w-full sm:w-auto min-h-[44px]"
                          asChild
                        >
                          <Link href={`/tasks/${task.id}/complete`}>
                            <Camera className="w-5 h-5 mr-2" />
                            Complete Task
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pull to Refresh Indicator */}
        {refreshing && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-card px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              <span className="text-sm">Refreshing...</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

