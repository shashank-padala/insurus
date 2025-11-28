"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { US_STATES } from "@/constants/usa-states";
import { CANADA_PROVINCES } from "@/constants/canada-provinces";
import Link from "next/link";
import { AuthModal } from "@/components/AuthModal";
import { createClient } from "@/lib/supabase/client";

export const Hero = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "USA",
    propertyType: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleCountryChange = (country: string) => {
    setFormData({ ...formData, country, state: "" }); // Reset state when country changes
  };

  const getStateOptions = () => {
    return formData.country === "USA" ? US_STATES : CANADA_PROVINCES;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user is logged in, they shouldn't be here (auto-redirect handles this)
    // But just in case, redirect them
    if (user) {
      window.location.href = "/dashboard";
      return;
    }

    // Validate form data
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.state || !formData.propertyType) {
      return;
    }

    // Open auth modal with pre-filled data
    setAuthModalOpen(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero">
      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 text-primary-foreground">
            <div className="inline-flex items-center gap-2 text-accent">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Insurus</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
              Protect Your Home.{" "}
              <span className="text-accent">Earn Rewards.</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl">
              Complete monthly safety checks, submit photo proof, and earn
              blockchain-verified rewards.{" "}
              <Link href="/how-it-works" className="text-accent hover:underline font-medium">
                Learn how it works
              </Link>{" "}
              or{" "}
              <Link href="/rewards" className="text-accent hover:underline font-medium">
                explore rewards
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-accent">1000+</div>
                <div className="text-sm text-primary-foreground/70">
                  Homes Protected
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">95%</div>
                <div className="text-sm text-primary-foreground/70">
                  Safety Score
                </div>
              </div>
            </div>
          </div>
          {/* Right Form */}
          <div className="bg-background rounded-2xl p-8 shadow-card">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Start Earning Today
                </h2>
                <p className="text-muted-foreground">
                  Get your personalized home safety plan in 2 minutes
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main St"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="New York"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province *</Label>
                    <select
                      id="state"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select {formData.country === "USA" ? "state" : "province"}</option>
                      {getStateOptions().map((item) => (
                        <option key={item.abbreviation} value={item.abbreviation}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <select
                    id="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={(e) =>
                      setFormData({ ...formData, propertyType: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select property type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="rental">Rental Property</option>
                  </select>
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Get Your Safety Plan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="signup"
        prefillData={{
          fullName: formData.name,
          email: formData.email,
          property: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            propertyType: formData.propertyType,
          },
        }}
      />
    </section>
  );
};

