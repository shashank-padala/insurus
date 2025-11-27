import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import Link from "next/link";

export const CTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto gradient-hero rounded-2xl p-12 shadow-card text-center">
          <div className="inline-flex items-center gap-2 text-accent mb-6">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-heading font-bold text-primary-foreground">Insurus</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Ready to Protect Your Home?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who are earning rewards while keeping
            their properties safe. Get started in just 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8" asChild>
              <Link href="/">Get Started Today</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-background text-foreground" asChild>
              <Link href="/rewards">Learn About Rewards</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

