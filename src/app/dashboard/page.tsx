"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Home, Award, ListChecks, Calendar, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { format, parseISO, isPast } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        router.push("/");
        return;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      setUserProfile(profile);

      // Fetch user properties
      const { data: props } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });
      setProperties(props || []);

      // Fetch recent completed tasks
      const { data: completedTasks } = await supabase
        .from("tasks")
        .select(`
          *,
          task_checklists!inner(
            properties!inner(user_id)
          )
        `)
        .eq("task_checklists.properties.user_id", authUser.id)
        .eq("status", "verified")
        .order("completed_at", { ascending: false })
        .limit(5);
      setRecentTasks(completedTasks || []);

      // Fetch upcoming tasks (next 3 due soon)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data: upcoming } = await supabase
        .from("tasks")
        .select(`
          *,
          task_checklists!inner(
            properties!inner(user_id, address)
          )
        `)
        .eq("task_checklists.properties.user_id", authUser.id)
        .in("status", ["pending", "in_progress", null])
        .gte("due_date", today.toISOString().split("T")[0])
        .lte("due_date", nextWeek.toISOString().split("T")[0])
        .order("due_date", { ascending: true })
        .limit(3);
      setUpcomingTasks(upcoming || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Welcome back, {userProfile?.full_name || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your properties and track your safety progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-foreground">
                  {userProfile?.total_points_earned || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <p className="text-2xl font-bold text-foreground">
                  {userProfile?.current_tier || "Starter"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Properties</p>
                <p className="text-2xl font-bold text-foreground">
                  {properties.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            <Button variant="hero" className="min-h-[44px]" asChild>
              <Link href="/tasks">
                <ListChecks className="w-4 h-4 mr-2" />
                View Active Tasks
              </Link>
            </Button>
            <Button variant="outline" className="min-h-[44px]" asChild>
              <Link href="/properties/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Link>
            </Button>
            <Button variant="outline" className="min-h-[44px]" asChild>
              <Link href="/rewards">
                <Award className="w-4 h-4 mr-2" />
                View Rewards
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        {recentTasks && recentTasks.length > 0 && (
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-foreground">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tasks">View All</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recentTasks.slice(0, 5).map((task: any) => {
                const checklist = Array.isArray(task.task_checklists)
                  ? task.task_checklists[0]
                  : task.task_checklists;
                const property = Array.isArray(checklist?.properties)
                  ? checklist.properties[0]
                  : checklist?.properties;
                
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        {task.task_name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {property?.address || "Property"} • {task.completed_at ? format(parseISO(task.completed_at), "MMM d, yyyy") : "Recently"}
                      </p>
                    </div>
                    {task.base_points_value && (
                      <div className="text-right ml-4">
                        <p className="text-sm sm:text-base font-bold text-accent">
                          +{task.base_points_value}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks && upcomingTasks.length > 0 && (
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-foreground">
                Upcoming Tasks
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tasks">View All</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task: any) => {
                const checklist = Array.isArray(task.task_checklists)
                  ? task.task_checklists[0]
                  : task.task_checklists;
                const property = Array.isArray(checklist?.properties)
                  ? checklist.properties[0]
                  : checklist?.properties;
                const dueDate = task.due_date ? parseISO(task.due_date) : null;
                const isOverdue = dueDate && isPast(dueDate);
                
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}/complete`}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors block"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        {task.task_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {property?.address || "Property"}
                        </p>
                        {dueDate && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <p className={`text-xs sm:text-sm ${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
                                {format(dueDate, "MMM d")}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <Button variant="hero" size="sm" className="ml-4 min-h-[36px]">
                      Complete
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {(!recentTasks || recentTasks.length === 0) && (!upcomingTasks || upcomingTasks.length === 0) && (
          <div className="bg-card p-8 sm:p-12 rounded-xl shadow-card text-center">
            <ListChecks className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">
              No Tasks Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Add a property and generate a checklist to get started
            </p>
            <Button variant="hero" asChild>
              <Link href="/properties/new">Add Property</Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
