import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, Home, Award, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user properties
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch recent rewards
  const { data: recentRewards } = await supabase
    .from("rewards")
    .select(`
      *,
      tasks(
        task_name,
        base_points_value
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch active checklists
  const currentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString().split("T")[0];

  const { data: activeChecklists } = await supabase
    .from("task_checklists")
    .select(`
      *,
      properties!inner(user_id, address, city, state)
    `)
    .eq("properties.user_id", user.id)
    .gte("checklist_month", currentMonth)
    .in("status", ["pending", "in_progress"])
    .order("checklist_month", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
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
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-card-foreground mb-1">
                {userProfile?.safety_score || 100}
              </div>
              <div className="text-sm text-muted-foreground">Safety Score</div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-card-foreground mb-1">
                {userProfile?.total_points_earned || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold text-card-foreground mb-1">
                {userProfile?.current_tier || "Starter"}
              </div>
              <div className="text-sm text-muted-foreground">Current Tier</div>
            </div>
          </div>

          {/* Properties Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Your Properties
              </h2>
              <Button variant="hero" asChild>
                <Link href="/properties/new">Add Property</Link>
              </Button>
            </div>

            {properties && properties.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Home className="w-6 h-6 text-accent" />
                      </div>
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded capitalize">
                        {property.property_type}
                      </span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-card-foreground mb-2">
                      {property.address}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {property.city}, {property.state} {property.country}
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/properties/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card p-12 rounded-xl shadow-card text-center">
                <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                  No Properties Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Register your first property to start earning rewards
                </p>
                <Button variant="hero" asChild>
                  <Link href="/properties/new">Add Your First Property</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Active Checklists */}
          {activeChecklists && activeChecklists.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                Active Checklists
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {activeChecklists.map((checklist: any) => {
                  const property = Array.isArray(checklist.properties)
                    ? checklist.properties[0]
                    : checklist.properties;
                  return (
                    <Link
                      key={checklist.id}
                      href={`/checklists/${checklist.id}`}
                    >
                      <div className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all">
                        <h3 className="text-lg font-heading font-bold text-card-foreground mb-2">
                          {new Date(checklist.checklist_month).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {property?.address}, {property?.city}, {property?.state}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            checklist.status === "in_progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {checklist.status}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Rewards */}
          {recentRewards && recentRewards.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Recent Rewards
                </h2>
                <Button variant="outline" asChild>
                  <Link href="/rewards">View All</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {recentRewards.map((reward: any) => {
                  const task = Array.isArray(reward.tasks)
                    ? reward.tasks[0]
                    : reward.tasks;
                  return (
                    <div
                      key={reward.id}
                      className="bg-card p-4 rounded-xl shadow-card"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-card-foreground">
                            {task?.task_name || "Task"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(reward.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-accent">
                            +{reward.points_earned}
                          </p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-card p-6 rounded-xl shadow-card">
            <h3 className="text-xl font-heading font-bold text-card-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <Link href="/rewards">View Rewards</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/how-it-works">How It Works</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/properties/new">Add Property</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

