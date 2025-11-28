import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Home, Calendar, CheckCircle, Clock, XCircle, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { GenerateChecklistButton } from "@/components/properties/GenerateChecklistButton";
import { PropertyActions } from "@/components/properties/PropertyActions";

export default async function PropertyPage({
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

  // Fetch property
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!property) {
    redirect("/dashboard");
  }

  // Fetch checklists for this property
  const { data: checklists } = await supabase
    .from("task_checklists")
    .select("*")
    .eq("property_id", id)
    .order("checklist_month", { ascending: false });

  // Get current month checklist or create one
  const currentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const currentMonthStr = currentMonth.toISOString().split("T")[0];

  const currentChecklist =
    checklists?.find(
      (c) => c.checklist_month.split("T")[0].startsWith(currentMonthStr.split("-").slice(0, 2).join("-"))
    ) || null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container px-4 mx-auto">
        <div className="max-w-7xl mx-auto">
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
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-6 h-6 text-accent" />
                  <h1 className="text-3xl font-heading font-bold text-foreground">
                    {property.address}
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {property.city}, {property.state} {property.country}
                </p>
                <span className="inline-block mt-2 text-xs px-2 py-1 bg-muted text-muted-foreground rounded capitalize">
                  {property.property_type}
                </span>
                {property.safety_score !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">Safety Score</span>
                      <span className="text-lg font-bold text-foreground">
                        {Math.round(property.safety_score)}%
                      </span>
                    </div>
                    <div className="w-48 bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, property.safety_score))}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on completed tasks
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <PropertyActions property={property} />
                {!currentChecklist && (
                  <GenerateChecklistButton propertyId={id} month={currentMonthStr} />
                )}
              </div>
            </div>
          </div>

          {/* Checklists */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              Safety Checklists
            </h2>

            {checklists && checklists.length > 0 ? (
              <div className="space-y-4">
                {checklists.map((checklist) => (
                  <ChecklistCard
                    key={checklist.id}
                    checklist={checklist}
                    propertyId={id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-xl shadow-card text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                  No Checklists Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Generate your first safety checklist to get started
                </p>
                <GenerateChecklistButton propertyId={id} month={currentMonthStr} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

async function ChecklistCard({
  checklist,
  propertyId,
}: {
  checklist: any;
  propertyId: string;
}) {
  const supabase = await createClient();

  // Fetch tasks for this checklist
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("checklist_id", checklist.id);

  const completedCount = tasks?.filter((t) => t.status === "verified").length || 0;
  const totalCount = tasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const checklistDate = new Date(checklist.checklist_month);
  const monthName = format(checklistDate, "MMMM yyyy");

  return (
    <Link href={`/checklists/${checklist.id}`}>
      <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-heading font-bold text-card-foreground mb-1">
              {monthName} Checklist
            </h3>
            <p className="text-sm text-muted-foreground">
              Due: {format(new Date(checklist.due_date), "MMM d, yyyy")}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${
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

        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-muted-foreground">
              {completedCount} / {totalCount} tasks
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>{completedCount} completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span>
              {tasks?.filter((t) => t.status === "pending").length || 0} pending
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

