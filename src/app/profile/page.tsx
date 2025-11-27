"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, LogOut } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push("/");
        return;
      }

      setUser(authUser);

      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) throw profileError;

      setProfile(userProfile);
      setFormData({
        fullName: userProfile?.full_name || "",
        email: authUser.email || "",
      });

      // Fetch property count
      const { count } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("user_id", authUser.id);
      
      setPropertyCount(count || 0);
    } catch (error: any) {
      console.error("Error loading user data:", error);
      setError(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: formData.fullName,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });

        if (emailError) throw emailError;
      }

      setSuccess("Profile updated successfully!");
      await loadUserData();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Stats Section */}
        {profile && (
          <div className="bg-card p-6 rounded-xl shadow-card mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground mb-6">
              Your Stats
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="text-muted-foreground text-sm">Total Points</Label>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {profile.total_points_earned || 0}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Current Tier</Label>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {profile.current_tier || "Starter"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Properties</Label>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {propertyCount}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Details Form */}
        <div className="bg-card p-6 rounded-xl shadow-card mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-6">
            Profile Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-accent/10 text-accent text-sm p-3 rounded-md">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={saving}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="hero"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-card p-6 rounded-xl shadow-card">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">
            Account Actions
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h3 className="font-semibold text-foreground">Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={signingOut}
              >
                {signingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

