"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Home } from "lucide-react";
import { US_STATES } from "@/constants/usa-states";
import { CANADA_PROVINCES } from "@/constants/canada-provinces";
import { createClient } from "@/lib/supabase/client";

export default function NewPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "USA",
    propertyType: "",
  });

  const handleCountryChange = (country: string) => {
    setFormData({ ...formData, country, state: "" }); // Reset state when country changes
  };

  const getStateOptions = () => {
    return formData.country === "USA" ? US_STATES : CANADA_PROVINCES;
  };
  const [safetyDevices, setSafetyDevices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const deviceOptions = [
    "Smoke Detectors",
    "Fire Alarm System",
    "Security System",
    "Sump Pump",
    "Generator",
    "Fire Extinguishers",
    "Carbon Monoxide Detectors",
  ];

  const toggleDevice = (device: string) => {
    setSafetyDevices((prev) =>
      prev.includes(device)
        ? prev.filter((d) => d !== device)
        : [...prev, device]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: apiError } = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          safetyDevices,
        }),
      }).then((res) => res.json());

      if (apiError) throw new Error(apiError);

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-accent mb-4">
              <Home className="w-6 h-6" />
              <span className="font-heading font-bold text-2xl">Add Property</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Register Your Property
            </h1>
            <p className="text-muted-foreground">
              Add your property details to start earning rewards
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

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
                  disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                <Label htmlFor="country">Country *</Label>
                <select
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                </select>
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
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select property type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="rental">Rental Property</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Safety Devices (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select all safety devices you have in your property
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {deviceOptions.map((device) => (
                    <label
                      key={device}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={safetyDevices.includes(device)}
                        onChange={() => toggleDevice(device)}
                        disabled={loading}
                        className="rounded border-input"
                      />
                      <span className="text-sm">{device}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={loading}>
                  {loading ? "Creating..." : "Register Property"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

