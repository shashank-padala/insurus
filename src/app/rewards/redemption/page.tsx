"use client";

import { DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { POINTS_REDEMPTION_OPTIONS } from "@/constants/rewards-system";

export default function RewardsRedemptionPage() {
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
            Redemption Options
          </h1>
          <p className="text-muted-foreground">
            Learn how to redeem your points for rewards
          </p>
        </div>

        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card">
          <p className="text-base sm:text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            In addition to automatic insurance discounts, you can redeem points for valuable
            rewards and services.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {POINTS_REDEMPTION_OPTIONS.map((option) => (
              <div key={option.id} className="bg-muted/30 p-4 sm:p-6 rounded-xl shadow-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold text-card-foreground mb-2">
                      {option.name}
                    </h3>
                    <p className="text-muted-foreground">{option.description}</p>
                  </div>
                  {option.pointsCost > 0 && (
                    <div className="text-xl sm:text-2xl font-bold text-accent">
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
    </div>
  );
}

