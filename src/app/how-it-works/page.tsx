import { Shield, FileText, Camera, Target } from "lucide-react";
import { RISK_CATEGORY_INFO, TASK_CATEGORY_INFO, TASK_TEMPLATES, RiskCategory, TaskCategory } from "@/constants/task-strategy";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              How We Create Your Safety Checklist
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
              Our AI-powered system analyzes your property and generates personalized safety tasks
              based on USA home insurance industry standards
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              Our 4-Step Process
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-card p-8 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">1</span>
                </div>
                <Shield className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-3">
                  Property Analysis
                </h3>
                <p className="text-muted-foreground">
                  We analyze your property's natural, geographic, and human risk factors based on
                  your address, property type, and location-specific hazards.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">2</span>
                </div>
                <FileText className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-3">
                  Custom Tasks
                </h3>
                <p className="text-muted-foreground">
                  Get personalized risk reduction tasks based on your property's specific profile,
                  aligned with insurance industry best practices.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <Camera className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-3">
                  Submit Evidence
                </h3>
                <p className="text-muted-foreground">
                  Upload photos, receipts, or documents showing task completion. Our AI verifies
                  your submissions using GPT-4 Vision technology.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl shadow-card">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">4</span>
                </div>
                <Target className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-2xl font-heading font-bold text-card-foreground mb-3">
                  Earn Rewards
                </h3>
                <p className="text-muted-foreground">
                  Get points, unlock achievements, and redeem valuable offers. All verified tasks
                  are immutably recorded on VeChain blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
              Risk Categories
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We evaluate your property across three main risk categories based on USA home
              insurance industry standards
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(RISK_CATEGORY_INFO).map(([key, info]) => {
                const category = key as RiskCategory;
                const colorClasses = {
                  green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                  yellow: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                  pink: "bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800",
                };
                return (
                  <div
                    key={key}
                    className={`p-6 rounded-xl border-2 ${colorClasses[info.color as keyof typeof colorClasses]}`}
                  >
                    <div className="text-4xl mb-4">{info.icon}</div>
                    <h3 className="text-xl font-heading font-bold mb-2">{info.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{info.description}</p>
                    <ul className="space-y-2">
                      {info.examples.map((example, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <span className="text-accent mr-2">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Task Categories */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
              Task Categories
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tasks are organized into categories that align with home insurance coverage areas
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(TASK_CATEGORY_INFO).map(([key, info]) => {
                const taskCategory = key as TaskCategory;
                const riskInfo = RISK_CATEGORY_INFO[info.riskCategory];
                return (
                  <div
                    key={key}
                    className="bg-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all"
                  >
                    <h3 className="text-lg font-heading font-bold text-card-foreground mb-2">
                      {info.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                    <div className="text-xs text-accent">
                      {riskInfo.name} Category
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Example Tasks */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
              Example Tasks
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Here are examples of tasks you might receive, with different verification types
            </p>
            <div className="space-y-6">
              {TASK_TEMPLATES.slice(0, 6).map((task) => {
                const categoryInfo = TASK_CATEGORY_INFO[task.category];
                const riskInfo = RISK_CATEGORY_INFO[task.riskCategory];
                return (
                  <div key={task.id} className="bg-card p-6 rounded-xl shadow-card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-card-foreground mb-2">
                          {task.name}
                        </h3>
                        <p className="text-muted-foreground mb-3">{task.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                            {categoryInfo.name}
                          </span>
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                            {riskInfo.name}
                          </span>
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            {task.frequency}
                          </span>
                          <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded">
                            {task.pointsValue} points
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold mb-2">Verification Type:</p>
                      <p className="text-sm text-muted-foreground mb-3 capitalize">
                        {task.verificationType === "both"
                          ? "Photo or Receipt"
                          : task.verificationType}
                      </p>
                      <p className="text-sm font-semibold mb-2">Example Evidence:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {task.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm font-semibold mt-3 mb-2">Insurance Relevance:</p>
                      <p className="text-sm text-muted-foreground">{task.insuranceRelevance}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto gradient-hero rounded-2xl p-12 shadow-card text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Ready to Get Your Personalized Checklist?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Register your property and let our AI create a custom safety plan based on your
              specific risks and insurance industry standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link href="/">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

