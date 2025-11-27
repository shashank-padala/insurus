import {
  POINTS_CALCULATION,
  calculateTaskPoints,
} from "@/constants/rewards-system";

export interface PointsBreakdown {
  basePoints: number;
  frequencyMultiplier: number;
  verificationBonus: number;
  streakBonus: number;
  earlyCompletionBonus: number;
  totalPoints: number;
}

/**
 * Calculate points for a completed task
 */
export function calculatePointsForTask(
  basePoints: number,
  frequency: "monthly" | "quarterly" | "annually" | "as_needed",
  verificationType: "photo" | "receipt" | "document" | "both",
  consecutiveMonths: number = 0,
  daysEarly: number = 0
): PointsBreakdown {
  const base = POINTS_CALCULATION.basePoints(basePoints);
  const frequencyMult = POINTS_CALCULATION.frequencyMultiplier[frequency];
  const verificationBonus =
    POINTS_CALCULATION.verificationBonus[verificationType];
  const streakBonus = POINTS_CALCULATION.streakBonus(consecutiveMonths);
  const earlyBonus = POINTS_CALCULATION.earlyCompletionBonus(daysEarly);

  const totalPoints = Math.floor(
    base * frequencyMult + verificationBonus + streakBonus + earlyBonus
  );

  return {
    basePoints: base,
    frequencyMultiplier: frequencyMult,
    verificationBonus,
    streakBonus,
    earlyCompletionBonus: earlyBonus,
    totalPoints,
  };
}

/**
 * Calculate safety score change for a task
 */
export function calculateSafetyScoreChange(
  taskPoints: number,
  isCompleted: boolean,
  daysOverdue: number = 0,
  isMissed: boolean = false
): number {
  if (isCompleted) {
    // Add points based on task importance (1.5x multiplier)
    return Math.floor(taskPoints * 1.5);
  } else if (isMissed) {
    // Deduct 5 points for missed tasks
    return -5;
  } else if (daysOverdue > 0) {
    // Deduct points based on how overdue
    if (daysOverdue > 30) return -10;
    if (daysOverdue > 14) return -5;
    if (daysOverdue > 7) return -3;
  }
  return 0;
}

