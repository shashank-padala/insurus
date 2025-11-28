import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "../auth/route";

export async function GET() {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServiceRoleClient();

    // Get all statistics in parallel
    const [
      usersResult,
      propertiesResult,
      tasksResult,
      pointsResult,
      activeUsersResult,
    ] = await Promise.all([
      // Total registered users
      supabase.from("users").select("id", { count: "exact", head: true }),
      // Total properties
      supabase.from("properties").select("id", { count: "exact", head: true }),
      // Tasks statistics
      supabase
        .from("tasks")
        .select("status", { count: "exact" }),
      // Total points earned
      supabase
        .from("users")
        .select("total_points_earned")
        .then((result) => {
          if (result.error) return { data: null, error: result.error };
          const total = result.data?.reduce(
            (sum, user) => sum + (user.total_points_earned || 0),
            0
          ) || 0;
          return { data: total, error: null };
        }),
      // Active users (last 30 days)
      supabase
        .from("users")
        .select("id")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        )
        .then((result) => ({
          data: result.data?.length || 0,
          error: result.error,
        })),
    ]);

    // Count completed and pending tasks
    const allTasks = tasksResult.data || [];
    const completedTasks = allTasks.filter(
      (task: any) => task.status === "completed" || task.status === "verified"
    ).length;
    const pendingTasks = allTasks.filter(
      (task: any) => task.status === "pending"
    ).length;

    const stats = {
      totalUsers: usersResult.count || 0,
      totalProperties: propertiesResult.count || 0,
      totalCompletedTasks: completedTasks,
      totalPendingTasks: pendingTasks,
      totalPointsEarned: pointsResult.data || 0,
      activeUsersLast30Days: activeUsersResult.data || 0,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

