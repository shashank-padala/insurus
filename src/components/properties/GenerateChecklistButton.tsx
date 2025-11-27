"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GenerateChecklistButton({
  propertyId,
  month,
}: {
  propertyId: string;
  month: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checklists/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          month,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to generate checklist");
      }
    } catch (error) {
      alert("Failed to generate checklist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="hero" onClick={handleGenerate} disabled={loading}>
      {loading ? "Generating..." : "Generate Checklist"}
    </Button>
  );
}

