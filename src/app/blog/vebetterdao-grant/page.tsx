import type { Metadata } from "next";
import { Shield, Zap, Leaf, Lock, Brain, Award } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insurus & VeChain: Building Protect2Earn for Sustainable Home Safety | VeBetterDAO Grant Application",
  description: "Learn how Insurus leverages VeChain blockchain and AI verification to create a sustainable Protect2Earn model that rewards homeowners for proactive safety maintenance.",
};

export default function VeBetterDAOGrantPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-accent font-bold text-xl">
            <Shield className="w-6 h-6" />
            Insurus
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Insurus & VeChain: Building Protect2Earn for Sustainable Home Safety
          </h1>
          <p className="text-xl text-muted-foreground">
            A VeBetterDAO Grant Application
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>Published: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>Category: Grant Application</span>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              Insurus is revolutionizing home safety through blockchain technology and artificial intelligence. 
              Our <strong>Protect2Earn</strong> model incentivizes homeowners to maintain their properties proactively, 
              reducing insurance claims, preventing disasters, and creating a more sustainable future. 
              Built on VeChain's energy-efficient blockchain, Insurus combines immutable transaction records 
              with AI-powered verification to create a transparent, trustworthy rewards ecosystem.
            </p>
          </div>
        </section>

        {/* Why VeChain */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Why We Chose VeChain
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Energy Efficiency & Sustainability
              </h3>
              <p>
                VeChain's Proof of Authority (PoA) consensus mechanism is significantly more energy-efficient 
                than traditional Proof of Work blockchains. For a platform focused on sustainability and 
                environmental responsibility, this alignment is crucial. VeChain's low energy consumption 
                means our blockchain transactions have minimal environmental impact, reinforcing our mission 
                to create a sustainable home safety ecosystem.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Low Transaction Costs
              </h3>
              <p>
                VeChain's dual-token system (VET and VTHO) provides predictable, low-cost transactions. 
                This is essential for our Protect2Earn model, where we need to record every property 
                registration and task completion on-chain without burdening users with high gas fees. 
                The cost-effective nature of VeChain allows us to scale our platform while maintaining 
                blockchain immutability for all safety records.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Enterprise-Grade Infrastructure
              </h3>
              <p>
                VeChain's enterprise focus and proven track record in supply chain management demonstrate 
                its reliability for production applications. The VeChainThor blockchain offers high throughput, 
                fast finality, and robust security—all critical for a platform handling sensitive home safety 
                data and financial rewards.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                VeBetterDAO Alignment
              </h3>
              <p>
                VeBetterDAO's mission to support projects that improve sustainability and social impact 
                perfectly aligns with Insurus. Our Protect2Earn model creates real-world value by 
                preventing home disasters, reducing insurance claims, and promoting proactive maintenance. 
                By choosing VeChain, we're not just building on a blockchain—we're joining a community 
                committed to positive change.
              </p>
            </div>
          </div>
        </section>

        {/* AI Verification */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              AI-Powered Safety Task Verification
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              At the heart of Insurus is our AI-powered verification system that ensures task completions 
              are legitimate and relevant. Using OpenAI's GPT-4 Vision model, we analyze photos and receipts 
              submitted by homeowners to verify that safety tasks have been completed correctly.
            </p>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                How It Works
              </h3>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Task Assignment:</strong> When a property is registered, our AI generates a 
                  personalized 12-month safety checklist based on property type, location, and existing 
                  safety devices.
                </li>
                <li>
                  <strong>Task Completion:</strong> Homeowners complete safety tasks (e.g., testing smoke 
                  detectors, checking fire extinguishers) and submit photo or receipt evidence.
                </li>
                <li>
                  <strong>AI Verification:</strong> Our GPT-4 Vision model analyzes the submitted image 
                  to verify:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>The image is relevant to the assigned task</li>
                    <li>The task was completed correctly</li>
                    <li>The evidence matches the task requirements</li>
                  </ul>
                </li>
                <li>
                  <strong>Blockchain Recording:</strong> Verified completions are recorded immutably on 
                  VeChain, creating a permanent, tamper-proof record of safety maintenance.
                </li>
                <li>
                  <strong>Rewards Distribution:</strong> Upon verification, users earn points that can be 
                  redeemed for insurance discounts, home improvement products, or other rewards.
                </li>
              </ol>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Why AI Verification Matters
              </h3>
              <p>
                Traditional home safety programs rely on manual inspections or self-reporting, which are 
                time-consuming, expensive, and prone to fraud. Our AI verification system:
              </p>
              <ul className="list-disc list-inside ml-6 mt-3 space-y-2">
                <li>
                  <strong>Scales Efficiently:</strong> Processes thousands of verifications instantly without 
                  human reviewers
                </li>
                <li>
                  <strong>Prevents Fraud:</strong> Strictly verifies that images are relevant to tasks, 
                  rejecting generic or unrelated photos
                </li>
                <li>
                  <strong>Ensures Quality:</strong> Only approves tasks that show genuine completion, 
                  maintaining the integrity of the safety program
                </li>
                <li>
                  <strong>Provides Transparency:</strong> All verification results are stored on-chain, 
                  creating an auditable record
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Protect2Earn Concept */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              The Protect2Earn Model
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Protect2Earn is our innovative X2Earn model that rewards homeowners for proactive safety 
              maintenance. Unlike traditional reward programs that incentivize consumption, Protect2Earn 
              incentivizes prevention—creating value by avoiding disasters rather than generating waste.
            </p>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                How Protect2Earn Works
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Property Registration</h4>
                      <p className="text-sm">Users register their property and receive a personalized safety plan. This registration is recorded on VeChain.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Task Completion</h4>
                      <p className="text-sm">Homeowners complete monthly, quarterly, and annual safety tasks based on their property's needs.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">AI Verification</h4>
                      <p className="text-sm">AI analyzes submitted evidence to verify task completion. Only verified tasks earn rewards.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Blockchain Recording</h4>
                      <p className="text-sm">Verified completions are recorded on VeChain, creating immutable proof of safety maintenance.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Rewards System
              </h3>
              <p className="mb-4">
                Users earn points (1-10 per task) based on task importance. Points can be redeemed for:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li><strong>Insurance Discounts:</strong> Up to 10% off home insurance premiums based on safety score</li>
                <li><strong>Home Improvement Products:</strong> Safety devices, maintenance tools, and more</li>
                <li><strong>Tier Benefits:</strong> Bronze, Silver, Gold, Platinum, and Diamond tiers with increasing benefits</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sustainability Impact */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Sustainability & Environmental Impact
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Insurus creates positive environmental impact through prevention rather than reaction. 
              By incentivizing proactive home maintenance, we reduce the environmental cost of disasters 
              and unnecessary repairs.
            </p>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Disaster Prevention
              </h3>
              <p className="mb-4">
                Regular safety maintenance prevents disasters that have significant environmental consequences:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>
                  <strong>Fire Prevention:</strong> Regular smoke detector and fire extinguisher checks 
                  prevent fires that release toxic emissions and destroy materials
                </li>
                <li>
                  <strong>Water Damage Prevention:</strong> Sump pump and plumbing maintenance prevents 
                  water damage that leads to mold, waste, and material replacement
                </li>
                <li>
                  <strong>Energy Efficiency:</strong> HVAC and insulation maintenance reduces energy 
                  consumption and carbon footprint
                </li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Reduced Insurance Claims
              </h3>
              <p>
                By preventing disasters, Insurus reduces the number of insurance claims. This has a 
                cascading environmental benefit:
              </p>
              <ul className="list-disc list-inside ml-6 mt-3 space-y-2">
                <li>Fewer claims mean less material waste from damaged homes</li>
                <li>Reduced need for emergency services and their associated carbon footprint</li>
                <li>Lower insurance costs enable homeowners to invest in sustainable home improvements</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                VeChain's Energy Efficiency
              </h3>
              <p>
                By building on VeChain's energy-efficient blockchain, Insurus ensures that our platform 
                itself has minimal environmental impact. Unlike energy-intensive Proof of Work blockchains, 
                VeChain's Proof of Authority consensus requires minimal energy, making our blockchain 
                transactions carbon-light.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card border-2 border-accent/20">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Measurable Impact
              </h3>
              <p className="mb-4">
                Every verified safety task completion on Insurus represents:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">1</div>
                  <div className="text-sm">Potential Disaster Prevented</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm">Immutable Record on VeChain</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">∞</div>
                  <div className="text-sm">Long-term Safety Impact</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Technical Implementation
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                Blockchain Integration
              </h3>
              <p className="mb-4">
                Every property registration and verified task completion is recorded on VeChain testnet 
                (upgrading to mainnet for production). Our implementation:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Stores property metadata on-chain at registration</li>
                <li>Records task completion metadata including AI verification confidence scores</li>
                <li>Includes photo/receipt hashes for tamper-proof evidence storage</li>
                <li>Creates immutable audit trail of all safety maintenance activities</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                AI Verification Pipeline
              </h3>
              <p className="mb-4">
                Our AI verification system uses OpenAI's GPT-4 Vision model with strict verification criteria:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>Minimum confidence threshold of 0.7 for verification</li>
                <li>Strict relevance checking to ensure images match assigned tasks</li>
                <li>Automatic rejection of generic or unrelated photos</li>
                <li>Clear feedback messages when verification fails</li>
              </ul>
            </div>
          </div>
        </section>

        {/* VeBetterDAO Alignment */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-8 rounded-xl border border-accent/30">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Alignment with VeBetterDAO Mission
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Insurus aligns perfectly with VeBetterDAO's mission to support projects that create 
                positive social and environmental impact:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-2">
                <li>
                  <strong>Sustainability:</strong> Prevents disasters, reduces waste, and promotes 
                  energy efficiency
                </li>
                <li>
                  <strong>Social Impact:</strong> Makes home safety accessible and rewarding for all 
                  homeowners
                </li>
                <li>
                  <strong>Innovation:</strong> Combines AI and blockchain to solve real-world problems
                </li>
                <li>
                  <strong>Transparency:</strong> Immutable blockchain records create trust and accountability
                </li>
                <li>
                  <strong>Scalability:</strong> Built on VeChain's enterprise-grade infrastructure for 
                  global reach
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mb-12">
          <div className="bg-card p-8 rounded-xl shadow-card text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
              Join the Protect2Earn Revolution
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Insurus is building the future of home safety—one verified task at a time. 
              With VeChain's sustainable blockchain and AI-powered verification, we're creating 
              a transparent, rewarding ecosystem that benefits homeowners, insurers, and the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                Try Insurus
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            Insurus - Protect Your Home. Earn Rewards. Built on VeChain for a Sustainable Future.
          </p>
        </footer>
      </article>
    </div>
  );
}


