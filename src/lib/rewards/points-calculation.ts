import {
  POINTS_CALCULATION,
} from "@/constants/rewards-system";

export interface PointsBreakdown {
  basePoints: number;
  totalPoints: number;
}

/**
 * Calculate points for a completed task
 * Simplified: Just returns base points (1-10)
 */
export function calculatePointsForTask(
  basePoints: number,
  frequency: "monthly" | "quarterly" | "annually" | "as_needed",
  verificationType: "photo" | "receipt" | "document" | "both",
  consecutiveMonths: number = 0,
  daysEarly: number = 0
): PointsBreakdown {
  const totalPoints = POINTS_CALCULATION.basePoints(basePoints);

  return {
    basePoints: totalPoints,
    totalPoints,
  };
}

/**
 * Calculate safety score as a percentage (0-100)
 * Formula: (Completed Tasks / Total Tasks) × 100
 * This function recalculates the entire safety score for a property
 */
export async function calculateSafetyScorePercentage(
  supabase: any,
  propertyId: string
): Promise<number> {
  // Get all checklists for this property
  const { data: checklists } = await supabase
    .from("task_checklists")
    .select("id")
    .eq("property_id", propertyId);

  if (!checklists || checklists.length === 0) {
    return 0; // No checklists = 0% completion
  }

  const checklistIds = checklists.map((c: any) => c.id);

  // Get all tasks for these checklists
  const { data: allTasks } = await supabase
    .from("tasks")
    .select("id, status")
    .in("checklist_id", checklistIds);

  if (!allTasks || allTasks.length === 0) {
    return 0; // No tasks = 0% completion
  }

  // Count completed tasks (verified or completed status)
  const completedTasks = allTasks.filter(
    (task: any) => task.status === "verified" || task.status === "completed"
  ).length;

  // Calculate percentage
  const percentage = Math.round((completedTasks / allTasks.length) * 100);
  return Math.min(100, Math.max(0, percentage)); // Clamp between 0-100
}

