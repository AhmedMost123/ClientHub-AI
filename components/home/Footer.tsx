import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Globe, Users, Settings } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "AI Assistant", href: "#ai" },
    { label: "Dashboard", href: "#dashboard" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "API", href: "#" },
    { label: "Status", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 px-6 py-12 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div
                className="flex size-8 items-center justify-center rounded-lg text-white shadow-md"
                style={{ background: "var(--gradient-brand)" }}
              >
                <span className="text-sm font-bold">CH</span>
              </div>

              <span className="text-lg font-semibold tracking-tight">
                ClientHub AI
              </span>
            </div>

            <p className="mb-5 text-sm text-muted-foreground">
              The all-in-one workspace for freelancers and agencies.
            </p>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="size-4" />
                <span>Built for Freelancers</span>
              </div>

              <div className="flex items-center gap-2">
                <Settings className="size-4" />
                <span>AI-Powered Workflow</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>

            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>

            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>

            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2026 ClientHub AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>

            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </a>

            <a
              href="#"
              aria-label="Website"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Globe className="size-5" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaLinkedin className="size-5" />
            </a>

            <a
              href="#"
              aria-label="GitHub"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <FaGithub className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
