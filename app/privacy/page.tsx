import { Footer } from '@/components/ssl/footer';
import { Navbar } from '@/components/ssl/navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - SSL Certificate Checker',
  description: 'Privacy Policy for SSL Certificate Checker',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
          <Navbar />
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
  <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
  <p className="text-sm text-slate-500 mb-8">
    Last updated: {new Date().toLocaleDateString()}
  </p>

  <section className="space-y-6 text-slate-700 leading-relaxed">
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        1. Information We Collect
      </h2>
      <p>
        When you use the Codeeit SSL Generator, we may process information such
        as domain names, DNS records, certificate metadata, and technical
        information required to generate, validate, or manage SSL/TLS
        certificates. We only collect information necessary to provide and
        improve the Service.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        2. Technical & Usage Data
      </h2>
      <p>
        We may automatically collect technical information including your IP
        address, browser type, operating system, device information, timestamps,
        and pages visited. This information helps us monitor system health,
        improve performance, detect abuse, and maintain security.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        3. Private Keys & Certificates
      </h2>
      <p>
        Private keys are highly sensitive. We encourage you to securely store
        any private keys or certificates generated through the Service. You are
        responsible for protecting these assets after they have been generated
        or downloaded.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        4. How We Use Information
      </h2>

      <p>We use collected information to:</p>

      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Generate and validate SSL certificates.</li>
        <li>Verify domain ownership.</li>
        <li>Improve service reliability and performance.</li>
        <li>Monitor system security and prevent abuse.</li>
        <li>Diagnose technical issues and provide support.</li>
      </ul>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        5. Cookies
      </h2>

      <p>
        We may use cookies or similar technologies to maintain user sessions,
        remember preferences, enhance security, and collect anonymous analytics.
        You can manage or disable cookies through your browser settings, though
        some features may not function correctly.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        6. Data Security
      </h2>

      <p>
        We implement reasonable administrative and technical safeguards to help
        protect information processed through the Service. However, no online
        service can guarantee absolute security, and users should always follow
        security best practices when handling certificates and private keys.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        7. Third-Party Services
      </h2>

      <p>
        Our Service may interact with trusted third-party providers such as
        certificate authorities, DNS providers, cloud infrastructure, or hosting
        platforms. These providers maintain their own privacy policies governing
        how they process information.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        8. Data Retention
      </h2>

      <p>
        We retain information only for as long as necessary to operate, secure,
        and improve the Service or as required by applicable law. Technical logs
        may be periodically deleted according to our operational policies.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        9. Changes to This Privacy Policy
      </h2>

      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        published on this page with an updated revision date. Continued use of
        the Service after changes are posted constitutes acceptance of the
        revised Privacy Policy.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        10. Contact Us
      </h2>

      <p>
        If you have any questions about this Privacy Policy or our privacy
        practices, please contact the Codeeit team through our official support
        channels.
      </p>
    </div>
  </section>
</main>
    <Footer/>
    </div>
  );
}