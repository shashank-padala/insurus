import { Shield } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing and using Insurus ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              2. Use License
            </h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily use Insurus for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on Insurus</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              3. User Accounts
            </h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              4. Safety Tasks and Verification
            </h2>
            <p className="text-muted-foreground">
              Insurus provides AI-generated safety checklists and photo verification services. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Tasks are generated using AI and may not cover all safety requirements</li>
              <li>Photo verification is performed by AI and may have limitations</li>
              <li>You are responsible for ensuring your property meets all local safety regulations</li>
              <li>Insurus is not liable for any damages resulting from incomplete or inaccurate task lists</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              5. Rewards and Points
            </h2>
            <p className="text-muted-foreground">
              Points and rewards earned through the Platform are subject to the following terms:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Points have no cash value and cannot be exchanged for money</li>
              <li>Insurance discounts are subject to partner insurance company terms and conditions</li>
              <li>We reserve the right to modify or discontinue the rewards program at any time</li>
              <li>Points may expire or be forfeited under certain conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              6. Blockchain Transactions
            </h2>
            <p className="text-muted-foreground">
              Task completions may be recorded on the VeChain blockchain. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Blockchain transactions are irreversible</li>
              <li>Transaction fees may apply</li>
              <li>We are not responsible for blockchain network issues or delays</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              7. Disclaimer
            </h2>
            <p className="text-muted-foreground">
              The materials on Insurus are provided on an 'as is' basis. Insurus makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              8. Limitations
            </h2>
            <p className="text-muted-foreground">
              In no event shall Insurus or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Insurus, even if Insurus or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              9. Revisions
            </h2>
            <p className="text-muted-foreground">
              Insurus may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-4">
              10. Contact Information
            </h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

