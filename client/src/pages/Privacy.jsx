import { motion } from 'framer-motion';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Privacy() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 sm:p-12 prose max-w-none">
            <h2 className="font-heading text-dark">1. Introduction</h2>
            <p>Apex Finance LLC ("Company," "we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our loan matching services. Apex Finance LLC is not a lender. We are a free loan matching service that connects borrowers with a network of licensed lenders.</p>

            <h2 className="font-heading text-dark">2. Information We Collect</h2>
            <h3 className="font-heading text-dark">Personal Information</h3>
            <p>We collect personal information that you voluntarily provide when applying for a loan or contacting us, including:</p>
            <ul>
              <li>Full name, email address, phone number, date of birth</li>
              <li>Social Security Number (last 4 digits only)</li>
              <li>Residential address, city, state, ZIP code</li>
              <li>Employment information and income details</li>
              <li>Credit score range (self-reported)</li>
              <li>Government-issued identification documents</li>
              <li>Financial documents (pay stubs, bank statements)</li>
            </ul>

            <h3 className="font-heading text-dark">Automatically Collected Information</h3>
            <p>When you visit our website, we may automatically collect certain information including your IP address, browser type, operating system, referring URLs, and browsing behavior through cookies and similar technologies.</p>

            <h2 className="font-heading text-dark">3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Process and evaluate your loan application</li>
              <li>Connect you with qualified lending partners</li>
              <li>Communicate with you about your application status</li>
              <li>Improve our website and services</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Prevent fraud and ensure security</li>
              <li>Send relevant financial education content (with your consent)</li>
            </ul>

            <h2 className="font-heading text-dark">4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Lending Partners:</strong> To process your loan application. By submitting an application, you consent to your personal and financial information being shared with one or more third-party lending partners in our network for the purpose of evaluating your eligibility for loan products. Each lending partner has their own privacy policy governing how they use your data.</li>
              <li><strong>Service Providers:</strong> Third parties who assist in operating our business</li>
              <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>We will never sell your personal information to third parties for marketing purposes.</p>

            <h2 className="font-heading text-dark">5. Data Security</h2>
            <p>We implement industry-standard security measures including 256-bit SSL encryption, secure data storage, access controls, and regular security audits to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

            <h2 className="font-heading text-dark">6. Your Rights</h2>
            <p>Under applicable laws (including CCPA for California residents), you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of certain data sharing</li>
              <li>Non-discrimination for exercising your rights</li>
            </ul>

            <h2 className="font-heading text-dark">7. Cookies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences.</p>

            <h2 className="font-heading text-dark">8. Children's Privacy</h2>
            <p>Our services are not directed to individuals under 18. We do not knowingly collect information from children.</p>

            <h2 className="font-heading text-dark">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.</p>

            <h2 className="font-heading text-dark">10. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at:</p>
            <p>Apex Finance<br />123 Financial District, Suite 500<br />New York, NY 10004<br />Email: privacy@apexfinancellc.com<br />Phone: (212) 555-1234</p>
          </div>
        </div>
      </section>
    </div>
  );
}
