import { Shield, TrendingUp, Award, DollarSign, Target, CheckCircle } from "lucide-react";
import {
  POINTS_TIERS,
  INSURANCE_DISCOUNTS,
  POINTS_REDEMPTION_OPTIONS,
  SAFETY_SCORE_CALCULATION,
  POINTS_CALCULATION,
} from "@/constants/rewards-system";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Safety Score & Rewards
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              Earn points, build your safety score, and unlock insurance premium discounts
            </p>
          </div>
        </div>
      </section>

      {/* Safety Score Explanation */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                Understanding Your Safety Score
              </h2>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-card mb-8">
              <p className="text-lg text-muted-foreground mb-6">
                Your Safety Score is a comprehensive measure of how well you're protecting your
                property. It starts at 100 and adjusts based on your task completion history.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-heading font-bold text-card-foreground flex items-center gap-2">
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
                  <h3 className="text-xl font-heading font-bold text-card-foreground flex items-center gap-2">
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
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Score Range:</strong> {SAFETY_SCORE_CALCULATION.minScore} - {SAFETY_SCORE_CALCULATION.maxScore} points
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  A higher safety score demonstrates to insurance providers that you're actively
                  maintaining your property, which can lead to better rates and coverage options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Points System */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                How Points Accumulate
              </h2>
            </div>
            
            <div className="bg-card p-8 rounded-xl shadow-card mb-8">
              <p className="text-lg text-muted-foreground mb-6">
                Points are awarded when you complete verified safety tasks. The number of points
                you earn depends on several factors:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-accent pl-6">
                  <h3 className="text-xl font-heading font-bold text-card-foreground mb-3">
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
                
                <div className="border-l-4 border-accent pl-6">
                  <h3 className="text-xl font-heading font-bold text-card-foreground mb-3">
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
                
                <div className="border-l-4 border-accent pl-6">
                  <h3 className="text-xl font-heading font-bold text-card-foreground mb-3">
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
                
                <div className="border-l-4 border-accent pl-6">
                  <h3 className="text-xl font-heading font-bold text-card-foreground mb-3">
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
                
                <div className="border-l-4 border-accent pl-6">
                  <h3 className="text-xl font-heading font-bold text-card-foreground mb-3">
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
              
              <div className="bg-accent/10 p-6 rounded-lg mt-8">
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
        </div>
      </section>

      {/* Points Tiers */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                Points Tiers & Insurance Discounts
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
              As you accumulate points, you unlock higher tiers with increasing insurance premium
              discounts. These discounts are automatically applied when you share your Insurus
              profile with participating insurance providers.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {POINTS_TIERS.map((tier, index) => {
                const discount = INSURANCE_DISCOUNTS.find(d => d.tier === tier.tierName);
                return (
                  <div
                    key={tier.tierName}
                    className={`bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all ${
                      index === 0 ? "border-2 border-muted" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-heading font-bold text-card-foreground">
                        {tier.tierName}
                      </h3>
                      {tier.insuranceDiscount > 0 && (
                        <div className="text-3xl font-bold text-accent">
                          {tier.insuranceDiscount}%
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tier.minPoints === 0 ? "Starting tier" : `${tier.minPoints}+ points`}
                      {tier.maxPoints !== Infinity && ` - ${tier.maxPoints} points`}
                    </p>
                    <p className="text-muted-foreground mb-4">{tier.description}</p>
                    {discount && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-card-foreground mb-2">Benefits:</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {discount.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-accent mr-2">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Points Redemption */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                Redeem Your Points
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
              In addition to automatic insurance discounts, you can redeem points for valuable
              rewards and services.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {POINTS_REDEMPTION_OPTIONS.map((option) => (
                <div key={option.id} className="bg-card p-6 rounded-xl shadow-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                        {option.name}
                      </h3>
                      <p className="text-muted-foreground">{option.description}</p>
                    </div>
                    {option.pointsCost > 0 && (
                      <div className="text-2xl font-bold text-accent">
                        {option.pointsCost}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      option.category === "insurance" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                      option.category === "services" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      option.category === "products" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" :
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}>
                      {option.category}
                    </span>
                    {option.pointsCost === 0 && (
                      <span className="text-xs text-muted-foreground">Automatic</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Task Generation Assurance */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-card">
              <h2 className="text-2xl font-heading font-bold text-card-foreground mb-4">
                AI Task Generation & Points System
              </h2>
              <p className="text-muted-foreground mb-6">
                Our AI system is designed to only generate tasks that are part of our validated
                points system. Every task must:
              </p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Have assigned points</strong> (1-10 base value) based on insurance
                    risk reduction importance
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Belong to a valid category</strong> aligned with insurance industry
                    standards (fire safety, security, maintenance, etc.)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Have a valid verification method</strong> (photo, receipt, document, or both)
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Reference existing templates</strong> when possible, ensuring consistency
                    and proper point allocation
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Be validated</strong> before assignment to ensure it meets all system
                    requirements
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                This ensures that every task you complete contributes to your points total and
                safety score, and that you're always working toward meaningful insurance premium
                discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto gradient-hero rounded-2xl p-12 shadow-card text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Start Earning Points Today
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Register your property and begin completing safety tasks to build your safety score
              and unlock insurance premium discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link href="/">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-background" asChild>
                <Link href="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

