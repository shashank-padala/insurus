"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Home, Plus, Loader2, Calendar, ListChecks } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { PropertyMenu } from "@/components/properties/PropertyMenu";

export default function PropertiesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertyStats, setPropertyStats] = useState<Record<string, { activeTasks: number; lastChecklist: string | null }>>({});

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");
        return;
      }

      // Fetch properties
      const { data: props } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setProperties(props || []);

      // Fetch stats for each property
      const stats: Record<string, { activeTasks: number; lastChecklist: string | null }> = {};
      
      for (const property of props || []) {
        // Get active tasks count
        const currentMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        ).toISOString().split("T")[0];

        const { data: checklists } = await supabase
          .from("task_checklists")
          .select("id, checklist_month")
          .eq("property_id", property.id)
          .gte("checklist_month", currentMonth)
          .order("checklist_month", { ascending: false })
          .limit(1);

        const lastChecklist = checklists && checklists.length > 0 ? checklists[0].checklist_month : null;

        // Count active tasks
        if (checklists && checklists.length > 0) {
          const { count } = await supabase
            .from("tasks")
            .select("*", { count: "exact", head: true })
            .eq("checklist_id", checklists[0].id)
            .in("status", ["pending", "in_progress", null]);

          stats[property.id] = {
            activeTasks: count || 0,
            lastChecklist: lastChecklist,
          };
        } else {
          stats[property.id] = {
            activeTasks: 0,
            lastChecklist: null,
          };
        }
      }

      setPropertyStats(stats);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Properties
            </h1>
            <p className="text-muted-foreground">
              Manage your properties and view safety checklists
            </p>
          </div>
          <Button variant="hero" size="lg" className="hidden sm:flex" asChild>
            <Link href="/properties/new">
              <Plus className="w-5 h-5 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <div className="bg-card p-12 rounded-xl shadow-card text-center">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
              No Properties Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Register your first property to start earning rewards
            </p>
            <Button variant="hero" asChild>
              <Link href="/properties/new">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Property
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map((property) => {
              const stats = propertyStats[property.id] || { activeTasks: 0, lastChecklist: null };
              
              return (
                <div
                  key={property.id}
                  className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all relative"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded capitalize">
                        {property.property_type}
                      </span>
                      <PropertyMenu property={property} />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-heading font-bold text-card-foreground mb-2 line-clamp-2">
                    {property.address}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {property.city}, {property.state} {property.country}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    {stats.activeTasks > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <ListChecks className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">
                          <span className="font-semibold text-foreground">{stats.activeTasks}</span> active tasks
                        </span>
                      </div>
                    )}
                    {stats.lastChecklist && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Last checklist: {format(parseISO(stats.lastChecklist), "MMM yyyy")}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href={`/properties/${property.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Action Button (Mobile) */}
        <Link
          href="/properties/new"
          className="fixed bottom-20 right-4 sm:hidden z-40 bg-accent text-accent-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
          style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </DashboardLayout>
  );
}

