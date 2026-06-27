import { motion } from 'framer-motion';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Terms() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">Terms & Conditions</h1>
            <p className="text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 sm:p-12 prose max-w-none">
            <h2 className="font-heading text-dark">1. Agreement to Terms</h2>
            <p>By accessing or using the website and services of Apex Finance ("Company"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>

            <h2 className="font-heading text-dark">2. Services Description</h2>
            <p>Apex Finance LLC is a loan matching service that connects borrowers with a network of licensed lending partners. We are NOT a direct lender. We do not make credit decisions or issue loans. Our role is to facilitate the loan process by matching you with lenders based on your financial profile and needs. Loan approval, terms, and rates are determined solely by the lender. Not all applicants will qualify.</p>

            <h2 className="font-heading text-dark">3. Eligibility</h2>
            <p>To use our services, you must be at least 18 years of age, a U.S. resident, and legally capable of entering into binding contracts. You must provide accurate and complete information in your application.</p>

            <h2 className="font-heading text-dark">4. Loan Application</h2>
            <ul>
              <li>Submitting an application does not guarantee loan approval</li>
              <li>All applications are subject to credit checks and lender verification</li>
              <li>You authorize us to share your information with lending partners</li>
              <li>Application processing typically takes 24-48 business hours</li>
              <li>You are limited to 3 applications per day</li>
            </ul>

            <h2 className="font-heading text-dark">5. Fees and Charges</h2>
            <p>Apex Finance LLC does not charge application fees or upfront fees for our loan matching services. Lending partners may charge origination fees, closing costs, or other fees as disclosed in your loan agreement. Always review all fees before accepting a loan offer.</p>

            <h2 className="font-heading text-dark">5b. APR Disclosure</h2>
            <p>APR (Annual Percentage Rate) for loans in our network typically ranges from 5.99% to 35.99%. Actual rates depend on creditworthiness, loan amount, loan term, and lender terms. The APR you receive may differ from advertised rates. Always review your loan offer carefully before accepting.</p>

            <h2 className="font-heading text-dark">6. Accuracy of Information</h2>
            <p>You agree to provide truthful, accurate, and complete information in your loan application. Providing false information may result in application denial and could constitute fraud under federal and state laws.</p>

            <h2 className="font-heading text-dark">7. Document Submission</h2>
            <p>Documents uploaded through our platform are stored securely and shared only with relevant lending partners. Accepted formats include PDF, JPG, and PNG files up to 5MB each. You retain ownership of all submitted documents.</p>

            <h2 className="font-heading text-dark">8. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, and software, is the property of Apex Finance and is protected by U.S. and international copyright laws. You may not reproduce or distribute any content without our written permission.</p>

            <h2 className="font-heading text-dark">9. Limitation of Liability</h2>
            <p>Apex Finance acts as a broker and does not make lending decisions. We are not responsible for the terms, conditions, or performance of any loan offered by our lending partners. Our liability is limited to the maximum extent permitted by law.</p>

            <h2 className="font-heading text-dark">10. Dispute Resolution</h2>
            <p>Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, conducted in New York, NY.</p>

            <h2 className="font-heading text-dark">11. Governing Law</h2>
            <p>These Terms and Conditions are governed by the laws of the State of New York without regard to conflict of law principles.</p>

            <h2 className="font-heading text-dark">12. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes become effective immediately upon posting. Continued use of our services constitutes acceptance of modified terms.</p>

            <h2 className="font-heading text-dark">13. Contact</h2>
            <p>For questions about these Terms and Conditions:</p>
            <p>Apex Finance<br />123 Financial District, Suite 500<br />New York, NY 10004<br />Email: legal@apexfinancellc.com<br />Phone: (845) 241-2429</p>
          </div>
        </div>
      </section>
    </div>
  );
}
