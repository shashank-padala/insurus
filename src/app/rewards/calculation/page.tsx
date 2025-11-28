"use client";

import { Button } from "@/components/ui/button";
import {
  Shield,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function RewardsCalculationPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
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
            Each property has its own Safety Score, which is a simple percentage (0-100%) showing
            how many tasks you've completed for that property. The formula is simple:
          </p>
          
          <div className="bg-accent/10 p-4 sm:p-6 rounded-lg mb-6">
            <p className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-2">
              Safety Score = (Completed Tasks / Total Tasks) × 100%
            </p>
            <p className="text-sm text-muted-foreground">
              For example: If you have 20 tasks and completed 15, your safety score is 75%.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-2">
                  How It Works
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Safety score starts at 0% when you first add a property</li>
                  <li>• Each completed task increases your completion percentage</li>
                  <li>• Score is automatically recalculated when you complete or add tasks</li>
                  <li>• Score range: 0% (no tasks completed) to 100% (all tasks completed)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Why It Matters:</strong> A higher safety score demonstrates to insurance providers that you're actively
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
            Points are awarded when you complete verified safety tasks. We keep it simple - 
            each task is worth its base point value (1-10 points), with no multipliers or bonuses.
          </p>
          
          <div className="bg-accent/10 p-4 sm:p-6 rounded-lg mb-6">
            <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-3">
              Simple Points System
            </h3>
            <p className="text-muted-foreground mb-4">
              Each task has a base point value (1-10) based on its importance for insurance risk reduction:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>9-10 points:</strong> Critical safety tasks (smoke detectors, CO detectors, electrical inspections)</li>
              <li>• <strong>7-8 points:</strong> Important prevention tasks (water heater checks, security systems)</li>
              <li>• <strong>5-6 points:</strong> Regular maintenance tasks (gutter cleaning, tree trimming)</li>
              <li>• <strong>3-4 points:</strong> Routine checks (lighting, emergency kits)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>That's it!</strong> The base points (1-10) are the final points you earn. 
              No multipliers, no bonuses - just simple, easy-to-understand points.
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 sm:p-6 rounded-lg">
            <h4 className="font-heading font-bold text-card-foreground mb-2">
              Example
            </h4>
            <p className="text-sm text-muted-foreground">
              Task: Smoke Detector Test (10 base points)
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Points Earned: <strong>10 points</strong> (simple and straightforward!)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

