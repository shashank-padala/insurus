"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  POINTS_TIERS,
  INSURANCE_DISCOUNTS,
} from "@/constants/rewards-system";

export default function RewardsTiersPage() {
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
            Points Tiers & Insurance Discounts
          </h1>
          <p className="text-muted-foreground">
            View all tiers and their insurance premium discounts
          </p>
        </div>

        <div className="bg-card p-6 sm:p-8 rounded-xl shadow-card mb-6">
          <p className="text-base sm:text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            As you accumulate points, you unlock higher tiers with increasing insurance premium
            discounts. These discounts are automatically applied when you share your Insurus
            profile with participating insurance providers.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {POINTS_TIERS.map((tier, index) => {
              const discount = INSURANCE_DISCOUNTS.find(d => d.tier === tier.tierName);
              return (
                <div
                  key={tier.tierName}
                  className={`bg-muted/30 p-4 sm:p-6 rounded-xl shadow-card hover:shadow-glow transition-all ${
                    index === 0 ? "border-2 border-muted" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl sm:text-2xl font-heading font-bold text-card-foreground">
                      {tier.tierName}
                    </h3>
                    {tier.insuranceDiscount > 0 && (
                      <div className="text-2xl sm:text-3xl font-bold text-accent">
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
                    <div className="border-t border-border pt-4">
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
    </DashboardLayout>
  );
}

