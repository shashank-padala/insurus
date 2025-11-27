import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, CheckCircle, Clock, XCircle, Camera, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TaskCard } from "@/components/tasks/TaskCard";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch checklist with tasks
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/checklists/${id}`,
    {
      headers: {
        Cookie: (await import("next/headers")).cookies().toString(),
      },
    }
  );

  if (!response.ok) {
    redirect("/dashboard");
  }

  const checklist = await response.json();

  const checklistDate = new Date(checklist.checklist_month);
  const monthName = format(checklistDate, "MMMM yyyy");

  const tasks = checklist.tasks || [];
  const completedCount = tasks.filter((t: any) => t.status === "verified").length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-accent mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {monthName} Safety Checklist
                </h1>
                <p className="text-muted-foreground">
                  Due: {format(new Date(checklist.due_date), "MMM d, yyyy")}
                </p>
              </div>
              <span
                className={`text-sm px-3 py-1 rounded ${
                  checklist.status === "completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : checklist.status === "in_progress"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {checklist.status}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-card p-6 rounded-xl shadow-card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-card-foreground">
                Progress
              </h2>
              <span className="text-2xl font-bold text-accent">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-4">
              <div
                className="bg-accent h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">
                  {completedCount} completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-muted-foreground">
                  {tasks.filter((t: any) => t.status === "pending").length} pending
                </span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-muted-foreground">
                  {tasks.filter((t: any) => t.status === "rejected").length} rejected
                </span>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              Tasks
            </h2>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-xl shadow-card text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                  No Tasks Yet
                </h3>
                <p className="text-muted-foreground">
                  Tasks will appear here once the checklist is generated
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

