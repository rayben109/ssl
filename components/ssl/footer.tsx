import Image from "next/image"
import Link from "next/link"
import { Shield } from "lucide-react"

const footerLinks = {
  product: [
    { label: "SSL Generator", href: "/ssl-generator#generator" },
    { label: "SSL Checker", href: "/ssl-generator#checker" },
    { label: "Installation Guides", href: "/ssl-generator#guides" },
    { label: "Features", href: "/ssl-generator#features" },
  ],
  company: [
    { label: "About Codeeit", href: "https://codeeit.co.tz" },
    { label: "Contact", href: "mailto:support@codeeit.co.tz" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/ssl-generator" className="flex items-center gap-3">
              <Image
                src="/images/codeeit-logo.png"
                alt="Codeeit Technologies Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-lg font-semibold text-foreground">
                Codeeit <span className="text-accent">Technologies</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Empowering businesses with secure, reliable, and accessible SSL
              certificate solutions. Trusted infrastructure for the modern web.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="size-4 text-accent" />
              <span>Your security is our priority</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Product
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Codeeit Technologies. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            SSL certificates are issued by trusted Certificate Authorities. This tool facilitates the process.
          </p>
        </div>
      </div>
    </footer>
  )
}
