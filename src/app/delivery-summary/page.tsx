import type { Metadata } from "next";
import { Shield, CheckCircle, Link as LinkIcon, Database, Code, Zap, Brain, Award, Lock, Smartphone, Globe } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insurus Project Delivery Summary - Complete Feature List & Documentation",
  description: "Comprehensive delivery summary for Insurus Protect2Earn platform. Features, routes, tech stack, environment setup, and complete documentation.",
  keywords: "Insurus, Protect2Earn, home safety, blockchain, VeChain, AI verification, project delivery, documentation",
  openGraph: {
    title: "Insurus Project Delivery Summary",
    description: "Complete feature list and documentation for Insurus Protect2Earn platform",
    type: "website",
  },
};

export default function DeliverySummaryPage() {
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

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Project Delivery Summary
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete documentation of all features, routes, and technical implementation 
            for the Insurus Protect2Earn home safety platform
          </p>
        </section>

        {/* Features Delivered */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Features Delivered
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                Core Features
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>User authentication (signup/login) with Supabase Auth</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Property registration with dynamic state/province selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI-generated personalized safety checklists (12-month timeline)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Task management with monthly grouping and filters</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AI photo verification for task completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Points and rewards system with tier progression</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Safety score calculation (property-level, 0-100%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Blockchain transaction recording (VeChain testnet)</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-accent" />
                Advanced Features
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mobile-first dashboard with bottom navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Optimistic UI updates for better UX</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Loading dialogs during property/task creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Task grouping by month with headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Photo/receipt upload with progress indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Points earned display after task completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Property management (edit/delete with confirmation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Profile management with stats</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-card p-6 rounded-xl shadow-card">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              Admin Dashboard Features
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Password-protected admin authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Comprehensive statistics dashboard (users, properties, tasks, points)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Promotional banner management (create, edit, hide/show, delete)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Admin task creation that pushes tasks to all users with deadlines</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Promotional banners displayed on authenticated pages</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Session-based admin authentication with HTTP-only cookies</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Application Routes */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <LinkIcon className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Application Routes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Public Pages
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/</code>
                  <span className="text-muted-foreground">Landing page</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/login</code>
                  <span className="text-muted-foreground">User login</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/register</code>
                  <span className="text-muted-foreground">User registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/how-it-works</code>
                  <span className="text-muted-foreground">How it works</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/privacy</code>
                  <span className="text-muted-foreground">Privacy policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/terms</code>
                  <span className="text-muted-foreground">Terms of service</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Protected Pages
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/dashboard</code>
                  <span className="text-muted-foreground">Main dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/properties</code>
                  <span className="text-muted-foreground">Properties list</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/properties/new</code>
                  <span className="text-muted-foreground">Add property</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/tasks</code>
                  <span className="text-muted-foreground">Tasks list</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/rewards</code>
                  <span className="text-muted-foreground">Rewards dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/profile</code>
                  <span className="text-muted-foreground">User profile</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Admin Pages
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/admin/login</code>
                  <span className="text-muted-foreground">Admin login (password-protected)</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/admin/dashboard</code>
                  <span className="text-muted-foreground">Admin dashboard (stats, banners, tasks)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-card p-6 rounded-xl shadow-card">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
              API Routes
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Properties</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/properties</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/properties</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">PATCH /api/properties/[id]</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">DELETE /api/properties/[id]</code></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Tasks</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/tasks</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/tasks/[id]</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/tasks/[id]/complete</code></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Other</h4>
                <div className="space-y-1 text-muted-foreground">
                  <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/storage/upload</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/blockchain/publish</code></div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/rewards/stats</code></div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Admin API Routes
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Authentication</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/admin/auth</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">DELETE /api/admin/auth</code></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Banners</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/admin/banners</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/admin/banners</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">PATCH /api/admin/banners</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">DELETE /api/admin/banners</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/admin/banners/list</code></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Admin Operations</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/admin/stats</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/admin/tasks</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">POST /api/admin/tasks</code></div>
                    <div><code className="bg-muted px-1 py-0.5 rounded">GET /api/admin/categories</code></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Code className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Tech Stack
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Frontend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Next.js 16 (App Router)</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Radix UI</li>
                <li>• Lucide React Icons</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Backend</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Supabase (PostgreSQL)</li>
                <li>• Supabase Auth</li>
                <li>• Supabase Storage</li>
                <li>• Next.js API Routes</li>
                <li>• Row-Level Security (RLS)</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">Integrations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• OpenAI GPT-4 Vision</li>
                <li>• VeChain Testnet</li>
                <li>• date-fns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Environment Variables */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Environment Variables
            </h2>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card">
            <p className="text-muted-foreground mb-4">
              Create a <code className="bg-muted px-2 py-1 rounded">.env.local</code> file in the root directory with the following variables:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Supabase</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">OpenAI (for AI verification)</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>OPENAI_API_KEY=your_openai_api_key</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">VeChain Blockchain (Testnet)</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>VECHAIN_NETWORK=testnet</div>
                  <div>VECHAIN_TESTNET_URL=https://testnet.vechain.org</div>
                  <div>VECHAIN_PRIVATE_KEY=your_testnet_wallet_private_key</div>
                  <div>VECHAIN_WALLET_ADDRESS=your_testnet_wallet_address</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Admin Dashboard</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>ADMIN_PASSWORD=your_admin_password</div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Password for accessing the admin dashboard at <code className="bg-muted px-1 py-0.5 rounded">/admin/login</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Database Setup */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Database Setup
            </h2>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
              Required Migrations
            </h3>
            <p className="text-muted-foreground mb-4">
              Run these migrations in order in your Supabase SQL Editor:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><code className="bg-muted px-2 py-1 rounded">001_initial_schema.sql</code> - Core database schema</li>
              <li><code className="bg-muted px-2 py-1 rounded">002_functions.sql</code> - Database functions and triggers</li>
              <li><code className="bg-muted px-2 py-1 rounded">003_storage_bucket.sql</code> - Storage buckets</li>
              <li><code className="bg-muted px-2 py-1 rounded">004_add_users_insert_policy.sql</code> - RLS policy for users</li>
              <li><code className="bg-muted px-2 py-1 rounded">005_add_tasks_insert_policy.sql</code> - RLS policy for tasks</li>
              <li><code className="bg-muted px-2 py-1 rounded">006_move_safety_score_to_properties.sql</code> - Safety score migration</li>
              <li><code className="bg-muted px-2 py-1 rounded">007_add_task_evidence_bucket.sql</code> - Task evidence bucket</li>
              <li><code className="bg-muted px-2 py-1 rounded">008_add_verifications_insert_policy.sql</code> - RLS policy for verifications</li>
              <li><code className="bg-muted px-2 py-1 rounded">009_update_blockchain_transactions.sql</code> - Blockchain transactions update</li>
              <li><code className="bg-muted px-2 py-1 rounded">010_create_promotional_banners.sql</code> - Promotional banners table</li>
              <li><code className="bg-muted px-2 py-1 rounded">011_create_admin_tasks.sql</code> - Admin tasks and user admin tasks tables</li>
            </ol>
          </div>
        </section>

        {/* Key Business Logic */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Key Business Logic
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Points System
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Base Points: 1-10 per task (no multipliers)</li>
                <li>• Tiers: Starter → Bronze (10pts) → Silver (25pts) → Gold (50pts) → Platinum (100pts) → Diamond (200pts)</li>
                <li>• Redemption: Insurance discounts, home improvement products</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Safety Score
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Calculation: (Completed Tasks / Total Tasks) × 100</li>
                <li>• Range: 0-100% (percentage)</li>
                <li>• Scope: Per property (not user-level)</li>
                <li>• Initial Value: 0% (increases as tasks are completed)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Getting Started
            </h2>
          </div>

          <div className="bg-card p-6 rounded-xl shadow-card">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">1. Install Dependencies</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  npm install
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Set Up Environment Variables</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  cp .env.local.example .env.local<br />
                  # Edit .env.local with your credentials
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Run Database Migrations</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Run all migrations in <code className="bg-muted px-1 py-0.5 rounded">supabase/migrations/</code> in Supabase SQL Editor
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Start Development Server</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  npm run dev
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-8 rounded-xl border border-accent/30">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
              Quick Links
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/"
                className="bg-card p-4 rounded-lg hover:bg-muted transition-colors text-center"
              >
                <div className="font-semibold text-foreground">Home</div>
                <div className="text-sm text-muted-foreground">Landing page</div>
              </Link>
              <Link
                href="/how-it-works"
                className="bg-card p-4 rounded-lg hover:bg-muted transition-colors text-center"
              >
                <div className="font-semibold text-foreground">How It Works</div>
                <div className="text-sm text-muted-foreground">Platform overview</div>
              </Link>
              <Link
                href="/dashboard"
                className="bg-card p-4 rounded-lg hover:bg-muted transition-colors text-center"
              >
                <div className="font-semibold text-foreground">Dashboard</div>
                <div className="text-sm text-muted-foreground">User dashboard</div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Insurus - Protect Your Home. Earn Rewards.</p>
          <p className="mt-2">Built with Next.js, Supabase, OpenAI, and VeChain</p>
        </div>
      </footer>
    </div>
  );
}


