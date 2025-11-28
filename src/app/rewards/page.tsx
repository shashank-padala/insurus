"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Award,
  Loader2,
  ChevronRight,
  Home,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { POINTS_TIERS } from "@/constants/rewards-system";

type TimeFilter = "week" | "month" | "year" | "all";

export default function RewardsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<any>(null);
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [timeFilter]);

  const [user, setUser] = useState<any>(null);

  const loadData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);
      
      if (!authUser) {
        setLoading(false);
        return;
      }

      // Fetch user stats
      const statsResponse = await fetch("/api/rewards/stats");
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setUserStats(stats);
      }

      // Fetch property count
      const { count } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setPropertyCount(count || 0);

      // Fetch points history
      const historyResponse = await fetch("/api/rewards?limit=50");
      if (historyResponse.ok) {
        const data = await historyResponse.json();
        let history = data.rewards || [];
        
        // Filter by time period
        if (timeFilter !== "all") {
          const now = new Date();
          const cutoff = new Date();
          
          switch (timeFilter) {
            case "week":
              cutoff.setDate(now.getDate() - 7);
              break;
            case "month":
              cutoff.setMonth(now.getMonth() - 1);
              break;
            case "year":
              cutoff.setFullYear(now.getFullYear() - 1);
              break;
          }
          
          history = history.filter((r: any) => {
            const created = new Date(r.created_at);
            return created >= cutoff;
          });
        }
        
        setPointsHistory(history);
      }
    } catch (error) {
      console.error("Error loading rewards data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTier = () => {
    if (!userStats) return null;
    const points = userStats.user?.totalPointsEarned || 0;
    return POINTS_TIERS.find(
      (tier) => points >= tier.minPoints && (tier.maxPoints === Infinity || points <= tier.maxPoints)
    ) || POINTS_TIERS[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    if (!currentTier) return null;
    const currentIndex = POINTS_TIERS.findIndex((t) => t.tierName === currentTier.tierName);
    if (currentIndex < POINTS_TIERS.length - 1) {
      return POINTS_TIERS[currentIndex + 1];
    }
    return null;
  };

  const getTierProgress = () => {
    if (!userStats) return { progress: 0, pointsToNext: 0 };
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    
    if (!currentTier || !nextTier) {
      return { progress: 100, pointsToNext: 0 };
    }
    
    const points = userStats.user?.totalPointsEarned || 0;
    const currentTierPoints = points - currentTier.minPoints;
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    const progress = (currentTierPoints / tierRange) * 100;
    const pointsToNext = nextTier.minPoints - points;
    
    return { progress: Math.min(100, Math.max(0, progress)), pointsToNext: Math.max(0, pointsToNext) };
  };

  // Show public rewards information page if not logged in
  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Rewards & Safety Score
            </h1>
            <p className="text-xl text-muted-foreground">
              Earn points by completing safety tasks and unlock insurance discounts
            </p>
          </div>

          {/* Public Rewards Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-accent" />
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Points System
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Earn 1-10 points for each verified safety task completion. Points accumulate to unlock higher tiers with better rewards.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Base points: 1-10 per task (no multipliers)</li>
                <li>• Simple and transparent system</li>
                <li>• Points never expire</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-accent" />
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Safety Score
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Each property has its own Safety Score (0-100%) based on completed tasks. Higher scores unlock better insurance discounts.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Calculated per property</li>
                <li>• Simple formula: (Completed / Total) × 100</li>
                <li>• Starts at 0% and increases with completions</li>
              </ul>
            </div>
          </div>

          {/* Tiers Preview */}
          <div className="bg-card p-6 rounded-xl shadow-card mb-12">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              Points Tiers
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {POINTS_TIERS.slice(0, 5).map((tier) => (
                <div key={tier.tierName} className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-2">{tier.tierName}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {tier.minPoints}+ points
                  </div>
                  {tier.insuranceDiscount > 0 && (
                    <div className="text-lg font-semibold text-foreground">
                      {tier.insuranceDiscount}% off
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Learn More Links */}
          <div className="bg-card p-6 rounded-xl shadow-card mb-12">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">
              Learn More
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/rewards/calculation"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">How Rewards Are Calculated</h3>
                <p className="text-sm text-muted-foreground">
                  Understand the points and safety score system
                </p>
              </Link>
              <Link
                href="/rewards/tiers"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">Points Tiers</h3>
                <p className="text-sm text-muted-foreground">
                  View all tiers and insurance discounts
                </p>
              </Link>
              <Link
                href="/rewards/redemption"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">Redemption Options</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to redeem your points
                </p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-8 rounded-xl border border-accent/30 text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-muted-foreground mb-6">
              Sign up to start earning points and improving your safety score
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const tierProgress = getTierProgress();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Rewards & Safety Score
          </h1>
          <p className="text-muted-foreground">
            Track your points, safety score, and tier progress
          </p>
        </div>

        {/* User Stats Section */}
        {userStats && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.user?.totalPointsEarned || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userStats.user?.currentTier || "Starter"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Properties</p>
                  <p className="text-2xl font-bold text-foreground">
                    {propertyCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier Progress */}
        {currentTier && nextTier && (
          <div className="bg-card p-6 rounded-xl shadow-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground mb-1">
                  {currentTier.tierName} Tier
                </h2>
                <p className="text-sm text-muted-foreground">
                  {tierProgress.pointsToNext > 0 
                    ? `${tierProgress.pointsToNext} points to ${nextTier.tierName}`
                    : "You've reached the highest tier!"}
                </p>
              </div>
              {currentTier.insuranceDiscount > 0 && (
                <div className="text-right">
                  <p className="text-3xl font-bold text-accent">
                    {currentTier.insuranceDiscount}%
                  </p>
                  <p className="text-xs text-muted-foreground">Insurance Discount</p>
                </div>
              )}
            </div>
            
            {tierProgress.pointsToNext > 0 && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-accent h-3 rounded-full transition-all"
                    style={{ width: `${tierProgress.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{currentTier.minPoints} pts</span>
                  <span>{nextTier.minPoints} pts</span>
                </div>
              </div>
            )}

            {nextTier && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Next Tier: {nextTier.tierName}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  {nextTier.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/rewards/tiers">View All Tiers</Link>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Points History */}
        <div className="bg-card p-6 rounded-xl shadow-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold text-foreground">
              Points History
            </h2>
            <Tabs value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
              <TabsList>
                <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {pointsHistory.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No points earned yet. Complete tasks to start earning!
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {pointsHistory.map((reward: any) => {
                const task = Array.isArray(reward.tasks)
                  ? reward.tasks[0]
                  : reward.tasks;
                
                return (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {task?.task_name || "Task Completed"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(reward.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-accent">
                        +{reward.points_earned || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reference Links Section */}
        <div className="bg-card p-6 rounded-xl shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-heading font-bold text-foreground">
              Learn More
            </h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/rewards/calculation"
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div>
                <p className="font-medium text-foreground group-hover:text-accent">
                  How Rewards Are Calculated
                </p>
                <p className="text-sm text-muted-foreground">
                  Understand how points and safety scores are calculated
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            </Link>

            <Link
              href="/rewards/tiers"
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div>
                <p className="font-medium text-foreground group-hover:text-accent">
                  Points Tiers & Insurance Discounts
                </p>
                <p className="text-sm text-muted-foreground">
                  View all tiers and their insurance premium discounts
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            </Link>

            <Link
              href="/rewards/redemption"
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div>
                <p className="font-medium text-foreground group-hover:text-accent">
                  Redemption Options
                </p>
                <p className="text-sm text-muted-foreground">
                  Learn how to redeem your points for rewards
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
