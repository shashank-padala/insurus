import { Shield } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="gradient-hero text-primary-foreground">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Brand */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-accent">
              <Shield className="w-6 h-6" />
              <span className="font-heading font-bold text-xl">Insurus</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Protect your home while earning rewards through verified safety
              practices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/rewards"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Rewards & Safety Score
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© {new Date().getFullYear()} Insurus. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="hover:text-accent transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="hover:text-accent transition-colors"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

