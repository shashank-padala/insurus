"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Shield,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  SAFETY_SCORE_CALCULATION,
  POINTS_CALCULATION,
} from "@/constants/rewards-system";

export default function RewardsCalculationPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rewards
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            How Rewards Are Calculated
          </h1>
          <p className="text-muted-foreground">
            Understand how points and safety scores are calculated
          </p>
        </div>

        {/* Safety Score Explanation */}
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">
              Understanding Your Safety Score
            </h2>
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Your Safety Score is a comprehensive measure of how well you're protecting your
            property. It starts at 100 and adjusts based on your task completion history.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Score Increases
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    <strong>Completed Tasks:</strong> +{SAFETY_SCORE_CALCULATION.completedTaskBonus(10)} points per task (based on importance)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    <strong>Completion Streaks:</strong> +{SAFETY_SCORE_CALCULATION.streakBonus(3)} to +{SAFETY_SCORE_CALCULATION.streakBonus(12)} bonus points
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>
                    <strong>Early Completion:</strong> Bonus points for completing tasks ahead of schedule
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-destructive" />
                Score Decreases
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-destructive mr-2">•</span>
                  <span>
                    <strong>Overdue Tasks:</strong> -{Math.abs(SAFETY_SCORE_CALCULATION.overdueTaskPenalty(7))} to -{Math.abs(SAFETY_SCORE_CALCULATION.overdueTaskPenalty(30))} points
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-destructive mr-2">•</span>
                  <span>
                    <strong>Missed Tasks:</strong> -{Math.abs(SAFETY_SCORE_CALCULATION.missedTaskPenalty)} points per missed task
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-destructive mr-2">•</span>
                  <span>
                    <strong>Monthly Reset:</strong> Score carries over at 80% to encourage continuous improvement
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Score Range:</strong> {SAFETY_SCORE_CALCULATION.minScore} - {SAFETY_SCORE_CALCULATION.maxScore} points
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              A higher safety score demonstrates to insurance providers that you're actively
              maintaining your property, which can lead to better rates and coverage options.
            </p>
          </div>
        </div>

        {/* Points System */}
        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold">
              How Points Accumulate
            </h2>
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Points are awarded when you complete verified safety tasks. The number of points
            you earn depends on several factors:
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-accent pl-4 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-3">
                1. Base Points (Task Importance)
              </h3>
              <p className="text-muted-foreground mb-2">
                Each task has a base point value (1-10) based on its importance for insurance
                risk reduction:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 9-10 points: Critical safety tasks (smoke detectors, CO detectors, electrical)</li>
                <li>• 7-8 points: Important prevention tasks (water heater, security systems)</li>
                <li>• 5-6 points: Regular maintenance tasks (tree trimming, emergency kits)</li>
                <li>• 3-4 points: Routine checks (lighting, contact lists)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                Base points are multiplied by 10, so a task worth 8 points = 80 base points.
              </p>
            </div>
            
            <div className="border-l-4 border-accent pl-4 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-3">
                2. Frequency Multiplier
              </h3>
              <p className="text-muted-foreground mb-2">
                Less frequent tasks earn bonus multipliers:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Monthly tasks: 1.0x (standard)</li>
                <li>• Quarterly tasks: 1.1x (+10% bonus)</li>
                <li>• Annual tasks: 1.2x (+20% bonus for professional services)</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-accent pl-4 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-3">
                3. Verification Bonus
              </h3>
              <p className="text-muted-foreground mb-2">
                Professional services and comprehensive verification earn bonus points:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Photo only: No bonus</li>
                <li>• Receipt (professional service): +{POINTS_CALCULATION.verificationBonus.receipt} points</li>
                <li>• Photo + Receipt: +{POINTS_CALCULATION.verificationBonus.both} points</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-accent pl-4 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-3">
                4. Completion Streak Bonus
              </h3>
              <p className="text-muted-foreground mb-2">
                Consistent task completion earns streak bonuses:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 3+ consecutive months: +{POINTS_CALCULATION.streakBonus(3)} points</li>
                <li>• 6+ consecutive months: +{POINTS_CALCULATION.streakBonus(6)} points</li>
                <li>• 12+ consecutive months: +{POINTS_CALCULATION.streakBonus(12)} points</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-accent pl-4 sm:pl-6">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-3">
                5. Early Completion Bonus
              </h3>
              <p className="text-muted-foreground mb-2">
                Complete tasks ahead of schedule for bonus points:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 3+ days early: +{POINTS_CALCULATION.earlyCompletionBonus(3)} points</li>
                <li>• 7+ days early: +{POINTS_CALCULATION.earlyCompletionBonus(7)} points</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-accent/10 p-4 sm:p-6 rounded-lg mt-6 sm:mt-8">
            <h4 className="font-heading font-bold text-card-foreground mb-2">
              Example Point Calculation
            </h4>
            <p className="text-sm text-muted-foreground">
              Task: Fire Alarm System Inspection (8 base points, annual, receipt verification, 12-month streak)
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Calculation: (8 × 10) × 1.2 + {POINTS_CALCULATION.verificationBonus.receipt} + {POINTS_CALCULATION.streakBonus(12)} = 96 + 5 + 20 = <strong>121 points</strong>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

