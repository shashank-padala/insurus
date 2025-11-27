import { Shield, Lock, Camera, Award } from "lucide-react";
import Link from "next/link";

export const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "All safety checks are immutably recorded on VeChain blockchain",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely",
    },
    {
      icon: Camera,
      title: "Photo Verification",
      description: "Submit photo proof of completed safety tasks",
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Get tokens and improve your safety score",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Why Choose Insurus
          </h2>
          <p className="text-muted-foreground">
            Protect your home while earning rewards through verified safety
            practices
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const isRewardsFeature = feature.title === "Earn Rewards";
            return (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all"
              >
                <feature.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>
                {isRewardsFeature && (
                  <Link
                    href="/rewards"
                    className="text-sm text-accent hover:underline font-medium"
                  >
                    Learn about rewards →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

