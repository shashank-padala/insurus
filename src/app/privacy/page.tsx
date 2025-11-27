import { Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent mb-6 hover:underline"
          >
            <Shield className="w-6 h-6" />
            <span className="font-heading font-bold text-xl">Insurus</span>
          </Link>
        </div>

        <h1 className="text-4xl font-heading font-bold text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              1. Introduction
            </h2>
            <p className="text-muted-foreground">
              Insurus ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
              2.1 Personal Information
            </h3>
            <p className="text-muted-foreground">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and email address</li>
              <li>Property address, city, state, and country</li>
              <li>Property type and safety device information</li>
              <li>Account credentials and authentication information</li>
            </ul>

            <h3 className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
              2.2 Usage Information
            </h3>
            <p className="text-muted-foreground">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Task completion history and safety scores</li>
              <li>Photo uploads for task verification</li>
              <li>Points earned and rewards redeemed</li>
              <li>Blockchain transaction records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized safety checklists using AI</li>
              <li>Verify task completion through photo analysis</li>
              <li>Calculate and track your safety score and rewards points</li>
              <li>Publish task completion records to the VeChain blockchain</li>
              <li>Communicate with you about your account and our services</li>
              <li>Send you updates, security alerts, and support messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              4. AI and Third-Party Services
            </h2>
            <h3 className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
              4.1 OpenAI Integration
            </h3>
            <p className="text-muted-foreground">
              We use OpenAI's GPT-4o and GPT-4 Vision APIs to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Generate personalized safety checklists based on your property details</li>
              <li>Analyze and verify photos submitted for task completion</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Photos and property information are sent to OpenAI for processing. OpenAI's use of your data is governed by their privacy policy. We do not use your data to train OpenAI's models.
            </p>

            <h3 className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
              4.2 Supabase
            </h3>
            <p className="text-muted-foreground">
              We use Supabase for data storage, authentication, and file hosting. Your data is stored securely in Supabase's infrastructure, which is compliant with industry security standards.
            </p>

            <h3 className="text-xl font-heading font-bold text-foreground mt-6 mb-3">
              4.3 VeChain Blockchain
            </h3>
            <p className="text-muted-foreground">
              Task completion records may be published to the VeChain blockchain as immutable records. This includes metadata about completed tasks but does not include personal identifying information or photos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              5. Data Storage and Security
            </h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security assessments and updates</li>
              <li>Row-level security policies in our database</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-muted-foreground">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access and update your personal information through your account settings</li>
              <li>Delete your account and associated data</li>
              <li>Request a copy of your data</li>
              <li>Opt out of certain communications</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us through our support channels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              7. Data Retention
            </h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide you services. We may retain certain information for longer periods as required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-muted-foreground">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              10. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

