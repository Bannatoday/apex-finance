import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Disclaimer() {
  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">Disclaimer</h1>
            <p className="text-gray-300">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 sm:p-12 prose max-w-none">
            <h2 className="font-heading text-dark">Non-Lender Disclosure</h2>
            <p><strong>Apex Finance LLC is not a lender.</strong> We are a free loan matching service that connects borrowers with a network of licensed, independent lenders. We do not make credit decisions, set interest rates, determine loan terms, or issue loans. All loan approval decisions, rates, fees, and terms are determined solely by the lender you are matched with.</p>
            <p>Not all applicants will qualify for a loan. Qualification depends on your creditworthiness, income, debt-to-income ratio, and other factors determined by the lender.</p>

            <h2 className="font-heading text-dark">APR Disclosure</h2>
            <p>APR (Annual Percentage Rate) for loans available through our network of lenders typically ranges from <strong>5.99% to 35.99%</strong>. The APR you receive will depend on your credit profile, loan amount, loan term, and the individual lender's criteria.</p>
            <p>The APR represents the annualized cost of borrowing, including interest and certain fees. The rates and terms advertised on this website are for informational purposes only and are not guaranteed. Your actual offer may differ from any examples shown.</p>

            <h2 className="font-heading text-dark">Loan Terms</h2>
            <p>Loan amounts, repayment terms, and availability vary by lender and applicant qualification. Typical loan amounts range from $1,000 to $500,000. Repayment terms typically range from 12 to 360 months, depending on loan type and lender.</p>
            <p>Example: A $10,000 personal loan with a 36-month term at 11.99% APR would result in a monthly payment of approximately $332. Total amount repaid would be approximately $11,952, including $1,952 in interest. This is an example only — your actual terms may vary.</p>

            <h2 className="font-heading text-dark">Credit Checks</h2>
            <p>When you submit an application through Apex Finance LLC, an initial soft credit inquiry may be performed. <strong>Soft inquiries do not affect your credit score.</strong> If you are matched with a lender and choose to proceed with a formal application, the lender may perform a hard credit inquiry, which may impact your credit score.</p>

            <h2 className="font-heading text-dark">No Guarantee of Savings or Results</h2>
            <p>Apex Finance LLC does not guarantee any specific savings, interest rate reductions, loan amounts, or approval outcomes. Any testimonials, examples, or case studies on this website represent individual results and are not indicative of future performance or typical outcomes.</p>

            <h2 className="font-heading text-dark">Third-Party Lenders</h2>
            <p>The lenders in our network are independent, licensed financial institutions. Apex Finance LLC does not endorse, guarantee, or assume responsibility for any lender's products, services, practices, or policies. Once you are connected with a lender, your relationship is directly with that lender, and their own terms of service and privacy policy will apply.</p>

            <h2 className="font-heading text-dark">Not Financial Advice</h2>
            <p>The content on this website is for informational and educational purposes only and does not constitute financial, legal, or tax advice. You should consult with a qualified financial professional, attorney, or tax advisor before making any financial decisions.</p>

            <h2 className="font-heading text-dark">State Licensing</h2>
            <p>Apex Finance LLC operates in compliance with applicable federal and state regulations. Services may not be available in all states. Loan products and availability may vary by state.</p>

            <h2 className="font-heading text-dark">Contact</h2>
            <p>For questions about this disclaimer or our services:</p>
            <p>
              Apex Finance LLC<br />
              1900 N. Akard Street, 5th Floor<br />
              Dallas, TX 75201<br />
              Email: legal@apexfinancellc.com<br />
              Phone: (845) 241-2429
            </p>

            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-sm text-muted">
                See also: <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
