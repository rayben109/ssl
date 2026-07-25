import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - SSL Certificate Checker',
  description: 'Privacy Policy for SSL Certificate Checker',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="space-y-6 text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
          <p>
            When you use our SSL Certificate Checker service, we process the domain names you input
            solely to inspect their SSL/TLS configurations. We do not store or associate this query data
            with personal identifiers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">2. Usage Data</h2>
          <p>
            We may collect standard, non-identifiable web traffic metrics (such as IP addresses, browser types,
            and timestamps) to monitor service availability and improve performance.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">3. Cookies</h2>
          <p>
            Our application uses essential cookies only when necessary for session integrity and user analytics
            where applicable.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">4. Contact Us</h2>
          <p>
            If you have questions about this policy, please reach out through our official platform or support channels.
          </p>
        </div>
      </section>
    </main>
  );
}