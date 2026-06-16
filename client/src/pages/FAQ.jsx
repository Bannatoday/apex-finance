import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const categories = ['All', 'General', 'Application Process', 'Loan Types', 'Repayment', 'Documents Required'];

const faqs = [
  { q: 'What is Apex Finance?', a: 'Apex Finance is a licensed loan brokerage firm that connects borrowers with qualified lenders. We are not a direct lender — we help you find the best loan options from our network of trusted lending partners.', cat: 'General' },
  { q: 'Is Apex Finance a direct lender?', a: 'No, Apex Finance is a loan brokerage. We work with a network of lenders to find you the best rates and terms. This means you benefit from multiple offers rather than being limited to a single lender.', cat: 'General' },
  { q: 'How do I apply for a loan?', a: 'Simply click "Apply Now" on our website and complete the 4-step application form. You\'ll need to provide personal information, loan details, financial information, and upload supporting documents. The entire process takes less than 10 minutes.', cat: 'Application Process' },
  { q: 'How long does the approval process take?', a: 'Most applications receive a decision within 24-48 business hours. Complex applications (business loans, large mortgages) may take slightly longer due to additional verification requirements.', cat: 'Application Process' },
  { q: 'What credit score do I need?', a: 'Minimum credit score requirements vary by loan type. Generally, a score of 580+ is needed for basic eligibility, while scores of 700+ qualify for the best rates. We work with lenders who cater to various credit profiles.', cat: 'Application Process' },
  { q: 'What types of loans do you offer?', a: 'We offer Personal Loans, Business Loans, Mortgage Loans, Auto Loans, Student Loans, and Debt Consolidation loans. Each loan type has different terms, rates, and eligibility requirements detailed on our Loan Products page.', cat: 'Loan Types' },
  { q: 'What are the interest rates?', a: 'Interest rates vary based on loan type, amount, credit score, and other factors. Personal loans start from 5.99% APR, mortgages from 4.99% APR, and auto loans from 3.99% APR. Use our EMI Calculator for estimates.', cat: 'Loan Types' },
  { q: 'What is the maximum loan amount?', a: 'Maximum loan amounts vary by type: Personal Loans up to $50,000, Business Loans up to $500,000, Mortgages up to $500,000, Auto Loans up to $100,000, and Student Loans up to $150,000.', cat: 'Loan Types' },
  { q: 'How do I make loan repayments?', a: 'Repayment terms are set by your lending partner. Most lenders offer automatic bank deductions, online payments, and check payments. Your lender will provide specific repayment instructions upon loan disbursement.', cat: 'Repayment' },
  { q: 'Are there prepayment penalties?', a: 'Most of our lending partners do not charge prepayment penalties. You can pay off your loan early without additional fees. However, terms vary by lender, so review your loan agreement for specific details.', cat: 'Repayment' },
  { q: 'What happens if I miss a payment?', a: 'Missing a payment may result in late fees and could negatively impact your credit score. Contact your lender immediately if you anticipate difficulty making a payment — many lenders offer hardship programs.', cat: 'Repayment' },
  { q: 'What documents do I need to apply?', a: 'Typically you\'ll need: Government-issued photo ID (front and back), recent pay stubs or proof of income, bank statements from the last 3 months, and depending on the loan type, additional documents may be required.', cat: 'Documents Required' },
  { q: 'What file formats are accepted?', a: 'We accept PDF, JPG, and PNG files. Each document must be under 5MB in size. Please ensure documents are clear and legible for faster processing.', cat: 'Documents Required' },
  { q: 'Is my personal information secure?', a: 'Absolutely. We use 256-bit SSL encryption to protect your data. We are fully compliant with federal privacy laws and never share your information with unauthorized third parties. See our Privacy Policy for details.', cat: 'General' },
];

export default function FAQ() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [openIdx, setOpenIdx] = useState(null);

  const filtered = faqs.filter(f => {
    const matchCat = category === 'All' || f.cat === category;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Frequently Asked Questions</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">Find quick answers to common questions about our services.</p>
            <div className="max-w-xl mx-auto relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
                placeholder="Search questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map(c => (
              <button key={c} onClick={() => { setCategory(c); setOpenIdx(null); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === c ? 'bg-primary text-white' : 'bg-light text-muted hover:bg-primary/5 hover:text-primary'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && <p className="text-center text-muted py-10">No questions found matching your search.</p>}
            {filtered.map((faq, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white rounded-xl border border-border/50 overflow-hidden">
                <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-light/50 transition-colors">
                  <span className="font-semibold text-dark pr-4">{faq.q}</span>
                  {openIdx === idx ? <HiChevronUp className="w-5 h-5 text-primary shrink-0" /> : <HiChevronDown className="w-5 h-5 text-muted shrink-0" />}
                </button>
                {openIdx === idx && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-6 pb-5">
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-muted leading-relaxed mt-3">{faq.a}</p>
                      <span className="inline-block mt-3 text-xs text-primary bg-primary/5 px-3 py-1 rounded-full">{faq.cat}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
