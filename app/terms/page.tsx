import { Footer } from '@/components/ssl/footer';
import { Navbar } from '@/components/ssl/navbar';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SSL Certificate Checker',
  description: 'Terms of Service for SSL Certificate Checker',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
  <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
  <p className="text-sm text-slate-500 mb-8">
    Last updated: {new Date().toLocaleDateString()}
  </p>

  <section className="space-y-6 text-slate-700 leading-relaxed">
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        1. Acceptance of Terms
      </h2>
      <p>
        By accessing or using the Codeeit SSL Generator, you agree to be bound
        by these Terms of Service. If you do not agree with these Terms, please
        discontinue using the Service immediately.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        2. Description of the Service
      </h2>
      <p>
        The Service provides tools for generating, validating, and managing
        SSL/TLS certificates and related cryptographic assets for websites and
        servers. The Service is intended for legitimate website administration,
        development, and educational purposes.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        3. Permitted Use
      </h2>
      <p>You agree to use the Service only on systems you own or are authorized to manage.</p>

      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Generate and manage SSL certificates for authorized domains.</li>
        <li>Verify domain ownership during certificate issuance.</li>
        <li>Troubleshoot SSL/TLS configuration issues.</li>
        <li>Use the Service in compliance with applicable laws.</li>
      </ul>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        4. Prohibited Activities
      </h2>

      <p>You agree not to:</p>

      <ul className="list-disc list-inside mt-2 space-y-1">
        <li>Generate certificates for domains you do not own or control.</li>
        <li>Perform unauthorized security testing or reconnaissance.</li>
        <li>Abuse, overload, or disrupt the Service.</li>
        <li>Circumvent rate limits or security mechanisms.</li>
        <li>Use the Service for illegal or malicious activities.</li>
      </ul>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        5. User Responsibilities
      </h2>

      <p>
        You are responsible for safeguarding your private keys, certificates,
        and server configurations. Codeeit cannot recover lost private keys or
        be held responsible for improper installation or management of issued
        certificates.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        6. Service Availability
      </h2>

      <p>
        We strive to provide a reliable service but cannot guarantee continuous
        availability. Maintenance, infrastructure failures, network issues, or
        third-party service interruptions may temporarily affect functionality.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        7. Third-Party Services
      </h2>

      <p>
        Our Service may rely on third-party providers such as certificate
        authorities, DNS providers, hosting services, or APIs. We are not
        responsible for the availability, performance, or policies of these
        external services.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        8. Disclaimer of Warranties
      </h2>

      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot;
        without warranties of any kind. While we strive for accuracy and
        reliability, we do not guarantee uninterrupted availability, successful
        certificate issuance, or error-free diagnostics.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        9. Limitation of Liability
      </h2>

      <p>
        To the fullest extent permitted by law, Codeeit shall not be liable for
        any direct, indirect, incidental, or consequential damages resulting
        from certificate expiration, server misconfiguration, downtime, data
        loss, security incidents, or reliance on information provided by the
        Service.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        10. Changes to These Terms
      </h2>

      <p>
        We reserve the right to modify these Terms at any time. Continued use of
        the Service after changes are published constitutes acceptance of the
        updated Terms.
      </p>
    </div>

    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        11. Contact
      </h2>

      <p>
        If you have any questions regarding these Terms of Service, please
        contact the Codeeit team through our official support channels.
      </p>
    </div>
  </section>
</main>
    <Footer/>
    </div>
  );
}