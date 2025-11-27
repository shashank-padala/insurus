import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getCurrentTier } from "@/constants/rewards-system";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get current tier
    const currentTier = getCurrentTier((userProfile as any).total_points_earned || 0);

    // Get rewards stats
    const { data: rewards } = await supabase
      .from("rewards")
      .select("points_earned")
      .eq("user_id", user.id);

    const totalPointsEarned = rewards?.reduce(
      (sum, r) => sum + (r.points_earned || 0),
      0
    ) || 0;

    // Get completed tasks count
    // First get user's properties
    const { data: userProperties } = await supabase
      .from("properties")
      .select("id")
      .eq("user_id", user.id);

    const propertyIds = userProperties?.map((p) => p.id) || [];

    // Then get checklists for those properties
    const { data: checklists } = await supabase
      .from("task_checklists")
      .select("id")
      .in("property_id", propertyIds);

    const checklistIds = checklists?.map((c) => c.id) || [];

    // Finally get completed tasks
    const { count: completedTasksCount } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "verified")
      .in("checklist_id", checklistIds);

    // Get active properties count
    const { count: propertiesCount } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return NextResponse.json({
      user: {
        totalPointsEarned: userProfile.total_points_earned,
        currentTier: userProfile.current_tier,
      },
      tier: currentTier,
      stats: {
        totalPointsEarned,
        completedTasks: completedTasksCount || 0,
        activeProperties: propertiesCount || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch reward statistics" },
      { status: 500 }
    );
  }
}

