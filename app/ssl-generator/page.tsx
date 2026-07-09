import { Navbar } from "@/components/ssl/navbar"
import { HeroSection } from "@/components/ssl/hero-section"
import { FeaturesSection } from "@/components/ssl/features-section"
import { SSLGeneratorSection } from "@/components/ssl/ssl-generator-section"
import { SSLCheckerSection } from "@/components/ssl/ssl-checker-section"
import { InstallationGuides } from "@/components/ssl/installation-guides"
import { CTASection } from "@/components/ssl/cta-section"
import { Footer } from "@/components/ssl/footer"

export default function SSLGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <SSLGeneratorSection />
        <SSLCheckerSection />
        <InstallationGuides />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
