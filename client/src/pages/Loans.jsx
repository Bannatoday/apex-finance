import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandshake, FaBuilding, FaUniversity, FaCar, FaGraduationCap, FaCreditCard } from 'react-icons/fa';
import { HiArrowRight as Arrow, HiCheckCircle } from 'react-icons/hi';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const loans = [
  {
    title: 'Personal Loan',
    icon: FaHandshake,
    color: 'from-blue-500 to-blue-600',
    amount: '$1,000 — $50,000',
    rate: '5.99% — 24.99%',
    tenure: '12 — 60 months',
    eligibility: 'Credit score 600+, verifiable income',
    features: ['No collateral required', 'Fixed interest rates', 'Quick disbursement within 48 hours', 'Flexible repayment terms', 'No prepayment penalty'],
    desc: 'Our personal loans cover any need — from medical bills and home improvements to weddings and vacations. Enjoy competitive rates with no collateral required.'
  },
  {
    title: 'Business Loan',
    icon: FaBuilding,
    color: 'from-emerald-500 to-emerald-600',
    amount: '$10,000 — $500,000',
    rate: '6.49% — 19.99%',
    tenure: '12 — 84 months',
    eligibility: '1+ year in business, $100K+ annual revenue',
    features: ['Working capital financing', 'Equipment purchases', 'Business expansion funding', 'Line of credit options', 'SBA loan assistance'],
    desc: 'Fuel your business growth with our competitive financing options. Whether you need working capital, equipment financing, or expansion funds.'
  },
  {
    title: 'Mortgage Loan',
    icon: FaUniversity,
    color: 'from-purple-500 to-purple-600',
    amount: '$50,000 — $500,000',
    rate: '4.99% — 8.99%',
    tenure: '120 — 360 months',
    eligibility: 'Credit score 620+, 3% minimum down payment',
    features: ['Fixed & adjustable rates', 'FHA & VA loan options', 'First-time buyer programs', 'Refinancing available', 'Rate lock guarantee'],
    desc: 'Make your dream home a reality. We offer fixed and adjustable-rate mortgages with competitive terms for first-time and experienced buyers.'
  },
  {
    title: 'Auto Loan',
    icon: FaCar,
    color: 'from-orange-500 to-orange-600',
    amount: '$5,000 — $100,000',
    rate: '3.99% — 15.99%',
    tenure: '24 — 84 months',
    eligibility: 'Credit score 580+, valid driver\'s license',
    features: ['New & used vehicle financing', 'Competitive dealer rates', 'Pre-approval available', 'No down payment options', 'Trade-in assistance'],
    desc: 'Get behind the wheel with affordable auto loans. We offer financing for new and used vehicles with pre-approval options.'
  },
  {
    title: 'Student Loan',
    icon: FaGraduationCap,
    color: 'from-pink-500 to-pink-600',
    amount: '$1,000 — $150,000',
    rate: '3.49% — 12.99%',
    tenure: '60 — 240 months',
    eligibility: 'Enrolled in accredited institution, cosigner may be required',
    features: ['Undergraduate & graduate loans', 'Deferred payment options', 'Income-driven repayment', 'Student loan refinancing', 'No origination fees'],
    desc: 'Invest in your future with student loans that offer low rates, deferred payments, and flexible repayment options.'
  },
  {
    title: 'Debt Consolidation',
    icon: FaCreditCard,
    color: 'from-teal-500 to-teal-600',
    amount: '$5,000 — $100,000',
    rate: '5.99% — 21.99%',
    tenure: '24 — 84 months',
    eligibility: 'Credit score 580+, existing debt obligations',
    features: ['Combine multiple debts', 'Lower overall interest rate', 'Single monthly payment', 'Fixed repayment schedule', 'Credit score improvement'],
    desc: 'Simplify your finances by combining multiple debts into one manageable monthly payment with a potentially lower interest rate.'
  },
];

export default function Loans() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Our Products</span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Loan Products</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Comprehensive financing solutions tailored to your goals. Compare our loan products and find the one that's right for you.</p>
          </motion.div>
        </div>
      </section>

      {/* Loan Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="space-y-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {loans.map(({ title, icon: Icon, color, amount, rate, tenure, eligibility, features, desc }, idx) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="grid lg:grid-cols-3">
                  <div className="p-8 lg:p-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-white mb-5`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-dark mb-3">{title}</h2>
                    <p className="text-muted leading-relaxed mb-6">{desc}</p>
                    <Link
                      to="/apply"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondary-light text-dark font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm"
                    >
                      Apply Now <Arrow className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="p-8 lg:p-10 bg-light/50 border-l border-border/30">
                    <h3 className="font-heading font-semibold text-dark mb-4 text-sm uppercase tracking-wider">Loan Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted uppercase tracking-wider">Loan Amount</p>
                        <p className="font-semibold text-dark">{amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted uppercase tracking-wider">Interest Rate (APR)</p>
                        <p className="font-semibold text-dark">{rate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted uppercase tracking-wider">Tenure</p>
                        <p className="font-semibold text-dark">{tenure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted uppercase tracking-wider">Eligibility</p>
                        <p className="font-semibold text-dark">{eligibility}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 border-l border-border/30">
                    <h3 className="font-heading font-semibold text-dark mb-4 text-sm uppercase tracking-wider">Key Features</h3>
                    <ul className="space-y-3">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <HiCheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-body">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">Not Sure Which Loan Is Right for You?</h2>
          <p className="text-dark/70 text-lg mb-8">Our loan advisors are here to help you find the perfect financing solution.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/apply" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors">Apply Now</Link>
            <Link to="/contact" className="px-8 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-lg transition-shadow">Talk to an Advisor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
