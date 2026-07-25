import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - SSL Certificate Checker',
  description: 'Terms of Service for SSL Certificate Checker',
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-6 text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using this SSL Certificate Checker, you agree to be bound by these Terms of Service.
            If you do not agree, please refrain from using the tool.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Permitted Use</h2>
          <p>
            This tool is provided for administrative, educational, and troubleshooting purposes. You agree not to:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Automate excessive requests that degrade service quality for others (rate limiting applies).</li>
            <li>Use the service for malicious domain scanning or unauthorized security auditing.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Disclaimer of Warranties</h2>
          <p>
            The service is provided &quot;as is&quot; without warranties of any kind. While we aim for high accuracy,
            we do not guarantee uninterrupted availability or completely error-free SSL status reporting.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">4. Limitation of Liability</h2>
          <p>
            Under no circumstances shall the operators of this tool be liable for any damages resulting from
            expired certificates, service downtime, or reliance on reported diagnostics.
          </p>
        </div>
      </section>
    </main>
  );
}