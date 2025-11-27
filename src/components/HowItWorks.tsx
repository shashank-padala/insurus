import { Shield, Camera, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Shield,
      title: "Register Home",
      description: "Add your property details and safety devices",
    },
    {
      number: 2,
      icon: Camera,
      title: "Complete Checks",
      description: "Monthly safety tasks with photo verification",
    },
    {
      number: 3,
      icon: CheckCircle,
      title: "Blockchain Verified",
      description: "Immutable proof logged on VeChain",
    },
    {
      number: 4,
      icon: Award,
      title: "Earn Rewards",
      description: "Get tokens and build safety score",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            4 simple steps to protect your home and earn rewards
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl font-bold text-accent">
                  {step.number}
                </span>
              </div>
              <step.icon className="w-10 h-10 text-accent mb-4 mx-auto" />
              <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/how-it-works">
              Learn More About How It Works
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

