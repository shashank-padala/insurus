"use client";

import { useState, useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  description: string;
  affiliate_link: string;
  is_active: boolean;
}

export function PromotionalBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      const response = await fetch("/api/admin/banners");
      if (response.ok) {
        const data = await response.json();
        if (data && data.is_active) {
          setBanner(data);
        }
      }
    } catch (error) {
      console.error("Error loading banner:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !banner) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-accent/20 to-accent/10 border-b border-accent/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-foreground mb-1">
              {banner.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
              {banner.description}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="hero"
              size="sm"
              asChild
              className="text-xs sm:text-sm"
            >
              <a
                href={banner.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Learn More
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

