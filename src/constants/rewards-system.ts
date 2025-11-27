/**
 * Rewards System and Safety Score Strategy
 * Defines how points accumulate, safety score calculation, and insurance premium discounts
 */

export interface PointsTier {
  minPoints: number;
  maxPoints: number;
  tierName: string;
  insuranceDiscount: number; // Percentage discount
  description: string;
}

export const POINTS_TIERS: PointsTier[] = [
  {
    minPoints: 0,
    maxPoints: 99,
    tierName: "Starter",
    insuranceDiscount: 0,
    description: "Begin your safety journey"
  },
  {
    minPoints: 100,
    maxPoints: 249,
    tierName: "Bronze",
    insuranceDiscount: 2,
    description: "2% discount on insurance premiums"
  },
  {
    minPoints: 250,
    maxPoints: 499,
    tierName: "Silver",
    insuranceDiscount: 5,
    description: "5% discount on insurance premiums"
  },
  {
    minPoints: 500,
    maxPoints: 999,
    tierName: "Gold",
    insuranceDiscount: 8,
    description: "8% discount on insurance premiums"
  },
  {
    minPoints: 1000,
    maxPoints: 1999,
    tierName: "Platinum",
    insuranceDiscount: 12,
    description: "12% discount on insurance premiums"
  },
  {
    minPoints: 2000,
    maxPoints: Infinity,
    tierName: "Diamond",
    insuranceDiscount: 15,
    description: "15% discount on insurance premiums"
  }
];

export interface TaskPointsConfig {
  category: string;
  basePoints: number;
  frequencyMultiplier: {
    monthly: number;
    quarterly: number;
    annually: number;
    as_needed: number;
  };
  verificationBonus: {
    photo: number;
    receipt: number;
    document: number;
    both: number;
  };
}

/**
 * Points are awarded based on:
 * 1. Base points (task importance/insurance impact)
 * 2. Frequency multiplier (more frequent = slightly lower per occurrence)
 * 3. Verification bonus (receipts/professional services get bonus)
 * 4. Completion streak bonus (consecutive months)
 */
export const POINTS_CALCULATION = {
  // Base points from task (1-10)
  basePoints: (taskPoints: number) => taskPoints * 10,
  
  // Frequency multiplier
  frequencyMultiplier: {
    monthly: 1.0,      // Full points for monthly tasks
    quarterly: 1.1,    // 10% bonus for quarterly (less frequent)
    annually: 1.2,     // 20% bonus for annual (professional services)
    as_needed: 1.0     // Full points for as-needed tasks
  },
  
  // Verification type bonus
  verificationBonus: {
    photo: 0,          // No bonus for photo-only
    receipt: 5,        // 5 point bonus for professional service receipts
    document: 0,       // No bonus for documents
    both: 10           // 10 point bonus for photo + receipt
  },
  
  // Streak bonus (consecutive months completing same task)
  streakBonus: (consecutiveMonths: number) => {
    if (consecutiveMonths >= 12) return 20; // 20 point bonus for 12+ month streak
    if (consecutiveMonths >= 6) return 10;  // 10 point bonus for 6+ month streak
    if (consecutiveMonths >= 3) return 5;   // 5 point bonus for 3+ month streak
    return 0;
  },
  
  // Early completion bonus (completed before due date)
  earlyCompletionBonus: (daysEarly: number) => {
    if (daysEarly >= 7) return 5;  // 5 points for completing 7+ days early
    if (daysEarly >= 3) return 3;  // 3 points for completing 3+ days early
    return 0;
  }
};

/**
 * Safety Score Calculation
 * Base score: 100
 * Deducted for: Overdue tasks, missed tasks
 * Added for: Completed tasks, streaks, early completions
 */
export const SAFETY_SCORE_CALCULATION = {
  baseScore: 0, // Safety scores start at 0 for each property
  
  // Deductions
  overdueTaskPenalty: (daysOverdue: number) => {
    if (daysOverdue > 30) return -10;  // -10 points for 30+ days overdue
    if (daysOverdue > 14) return -5;   // -5 points for 14+ days overdue
    if (daysOverdue > 7) return -3;    // -3 points for 7+ days overdue
    return 0;
  },
  
  missedTaskPenalty: -5,  // -5 points per missed task
  
  // Additions
  completedTaskBonus: (taskPoints: number) => {
    // Safety score increases based on task importance
    return Math.floor(taskPoints * 1.5); // 1.5x task points added to safety score
  },
  
  streakBonus: (consecutiveMonths: number) => {
    if (consecutiveMonths >= 12) return 10;
    if (consecutiveMonths >= 6) return 5;
    if (consecutiveMonths >= 3) return 2;
    return 0;
  },
  
  // Monthly reset with carryover
  monthlyReset: (currentScore: number) => {
    // Keep 80% of score, reset 20% to encourage continuous improvement
    return Math.floor(currentScore * 0.8);
  },
  
  // Maximum and minimum bounds
  maxScore: 1000,
  minScore: 0
};

/**
 * Insurance Premium Discount System
 * Discounts are tiered based on total points earned
 * Users can claim discounts through insurance partner integrations
 */
export interface InsuranceDiscount {
  tier: string;
  discountPercentage: number;
  pointsRequired: number;
  benefits: string[];
  partnerEligible: boolean; // Whether insurance partners honor this discount
}

export const INSURANCE_DISCOUNTS: InsuranceDiscount[] = [
  {
    tier: "Bronze",
    discountPercentage: 2,
    pointsRequired: 100,
    benefits: [
      "2% discount on annual premium",
      "Priority customer support",
      "Monthly safety report"
    ],
    partnerEligible: true
  },
  {
    tier: "Silver",
    discountPercentage: 5,
    pointsRequired: 250,
    benefits: [
      "5% discount on annual premium",
      "Priority customer support",
      "Monthly safety report",
      "Free annual property inspection"
    ],
    partnerEligible: true
  },
  {
    tier: "Gold",
    discountPercentage: 8,
    pointsRequired: 500,
    benefits: [
      "8% discount on annual premium",
      "Priority customer support",
      "Monthly safety report",
      "Free annual property inspection",
      "Dedicated account manager"
    ],
    partnerEligible: true
  },
  {
    tier: "Platinum",
    discountPercentage: 12,
    pointsRequired: 1000,
    benefits: [
      "12% discount on annual premium",
      "Priority customer support",
      "Monthly safety report",
      "Free annual property inspection",
      "Dedicated account manager",
      "Exclusive insurance partner offers"
    ],
    partnerEligible: true
  },
  {
    tier: "Diamond",
    discountPercentage: 15,
    pointsRequired: 2000,
    benefits: [
      "15% discount on annual premium",
      "Priority customer support",
      "Monthly safety report",
      "Free annual property inspection",
      "Dedicated account manager",
      "Exclusive insurance partner offers",
      "VIP rewards program access"
    ],
    partnerEligible: true
  }
];

/**
 * Points Redemption Options
 * Users can redeem points for various benefits
 */
export interface PointsRedemption {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  category: "insurance" | "services" | "products" | "cashback";
}

export const POINTS_REDEMPTION_OPTIONS: PointsRedemption[] = [
  {
    id: "insurance_discount",
    name: "Insurance Premium Discount",
    pointsCost: 0, // Automatic based on tier
    description: "Automatic discount applied based on your tier",
    category: "insurance"
  },
  {
    id: "professional_inspection",
    name: "Free Professional Inspection",
    pointsCost: 500,
    description: "Redeem for a free professional property inspection",
    category: "services"
  },
  {
    id: "safety_equipment",
    name: "Safety Equipment Voucher",
    pointsCost: 300,
    description: "$50 voucher for safety equipment (smoke detectors, fire extinguishers, etc.)",
    category: "products"
  },
  {
    id: "cashback_50",
    name: "$50 Cashback",
    pointsCost: 1000,
    description: "Redeem points for $50 cashback",
    category: "cashback"
  },
  {
    id: "cashback_100",
    name: "$100 Cashback",
    pointsCost: 2000,
    description: "Redeem points for $100 cashback",
    category: "cashback"
  }
];

/**
 * Task Validation Rules
 * Ensures AI-generated tasks align with our points system
 */
export const TASK_VALIDATION_RULES = {
  // All tasks must have points assigned
  requirePoints: true,
  
  // Points must be between 1-10 (base value)
  minPoints: 1,
  maxPoints: 10,
  
  // Task must belong to a valid category
  validCategories: [
    "fire_safety",
    "water_damage_prevention",
    "wind_storm_protection",
    "earthquake_preparedness",
    "wildfire_prevention",
    "location_hazards",
    "climate_adaptation",
    "infrastructure_reliability",
    "security",
    "maintenance",
    "emergency_preparedness",
    "equipment_verification"
  ],
  
  // Task must have a valid verification type
  validVerificationTypes: ["photo", "receipt", "document", "both"],
  
  // Task must have a valid frequency
  validFrequencies: ["monthly", "quarterly", "annually", "as_needed"],
  
  // AI-generated tasks must reference existing templates when possible
  preferTemplates: true,
  
  // Custom tasks (not in templates) must be approved before assignment
  requireApprovalForCustom: false // Can be set to true for stricter control
};

/**
 * Helper function to calculate total points for a completed task
 */
export function calculateTaskPoints(
  basePoints: number,
  frequency: "monthly" | "quarterly" | "annually" | "as_needed",
  verificationType: "photo" | "receipt" | "document" | "both",
  consecutiveMonths: number = 0,
  daysEarly: number = 0
): number {
  const base = POINTS_CALCULATION.basePoints(basePoints);
  const frequencyMult = POINTS_CALCULATION.frequencyMultiplier[frequency];
  const verificationBonus = POINTS_CALCULATION.verificationBonus[verificationType];
  const streakBonus = POINTS_CALCULATION.streakBonus(consecutiveMonths);
  const earlyBonus = POINTS_CALCULATION.earlyCompletionBonus(daysEarly);
  
  return Math.floor(
    base * frequencyMult + verificationBonus + streakBonus + earlyBonus
  );
}

/**
 * Helper function to get current tier based on total points
 */
export function getCurrentTier(totalPoints: number): PointsTier {
  return POINTS_TIERS.find(
    tier => totalPoints >= tier.minPoints && totalPoints <= tier.maxPoints
  ) || POINTS_TIERS[0];
}

/**
 * Helper function to validate AI-generated task
 */
export function validateTask(task: {
  pointsValue?: number;
  category?: string;
  verificationType?: string;
  frequency?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!task.pointsValue) {
    errors.push("Task must have pointsValue assigned");
  } else if (task.pointsValue < TASK_VALIDATION_RULES.minPoints || 
             task.pointsValue > TASK_VALIDATION_RULES.maxPoints) {
    errors.push(`Points must be between ${TASK_VALIDATION_RULES.minPoints} and ${TASK_VALIDATION_RULES.maxPoints}`);
  }
  
  if (!task.category || !TASK_VALIDATION_RULES.validCategories.includes(task.category)) {
    errors.push(`Category must be one of: ${TASK_VALIDATION_RULES.validCategories.join(", ")}`);
  }
  
  if (!task.verificationType || !TASK_VALIDATION_RULES.validVerificationTypes.includes(task.verificationType)) {
    errors.push(`Verification type must be one of: ${TASK_VALIDATION_RULES.validVerificationTypes.join(", ")}`);
  }
  
  if (!task.frequency || !TASK_VALIDATION_RULES.validFrequencies.includes(task.frequency)) {
    errors.push(`Frequency must be one of: ${TASK_VALIDATION_RULES.validFrequencies.join(", ")}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

