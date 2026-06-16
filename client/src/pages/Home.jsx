import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiClock, HiCurrencyDollar, HiUserGroup, HiClipboardCheck, HiEye, HiArrowRight } from 'react-icons/hi';
import { FaCalculator, FaHandshake, FaUniversity, FaCar, FaGraduationCap, FaCreditCard, FaBuilding, FaChartLine } from 'react-icons/fa';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const stats = [
  { value: '$50M+', label: 'Loans Funded', icon: HiCurrencyDollar },
  { value: '1,000+', label: 'Happy Clients', icon: HiUserGroup },
  { value: '95%', label: 'Approval Rate', icon: HiClipboardCheck },
  { value: '5+', label: 'Years in Business', icon: HiClock },
];

const loanProducts = [
  { title: 'Personal Loan', desc: 'Flexible personal loans for any need — medical bills, vacations, home improvements, and more.', icon: FaHandshake, color: 'from-blue-500 to-blue-600' },
  { title: 'Business Loan', desc: 'Fuel your business growth with competitive financing for expansion, equipment, and working capital.', icon: FaBuilding, color: 'from-emerald-500 to-emerald-600' },
  { title: 'Mortgage Loan', desc: 'Make your dream home a reality with our competitive mortgage rates and flexible terms.', icon: FaUniversity, color: 'from-purple-500 to-purple-600' },
  { title: 'Auto Loan', desc: 'Get behind the wheel with affordable auto loans for new and used vehicles.', icon: FaCar, color: 'from-orange-500 to-orange-600' },
  { title: 'Student Loan', desc: 'Invest in your future with student loans that offer low rates and flexible repayment options.', icon: FaGraduationCap, color: 'from-pink-500 to-pink-600' },
  { title: 'Debt Consolidation', desc: 'Simplify your finances by combining multiple debts into one manageable monthly payment.', icon: FaCreditCard, color: 'from-teal-500 to-teal-600' },
];

const trustPoints = [
  { title: 'Licensed & Regulated', desc: 'Fully compliant with all federal and state lending regulations.', icon: HiShieldCheck },
  { title: 'Fast Approval', desc: 'Get a decision within 24-48 hours. No weeks of waiting.', icon: HiClock },
  { title: 'Competitive Rates', desc: 'We partner with top lenders to get you the best rates available.', icon: FaChartLine },
  { title: 'Dedicated Support', desc: 'Personal loan advisors available 7 days a week to guide you.', icon: HiUserGroup },
  { title: 'Transparent Process', desc: 'No surprises. Clear terms, straightforward process from start to finish.', icon: HiEye },
  { title: 'No Hidden Fees', desc: 'What you see is what you get. Zero hidden charges or origination fees.', icon: HiCurrencyDollar },
];

const videoTestimonials = [
  {
    name: 'James Rodriguez',
    location: 'Miami, FL',
    loanType: 'Business Loan',
    youtubeUrl: 'https://youtu.be/E38JTm_AzsY',
    title: 'How Apex Finance helped me fund my restaurant',
  },
  {
    name: 'Lisa Thompson',
    location: 'Dallas, TX',
    loanType: 'Mortgage Loan',
    youtubeUrl: 'https://youtu.be/skhsLLdWjcA',
    title: 'From renting to owning — our home buying story',
  },
  {
    name: 'Robert Kim',
    location: 'Seattle, WA',
    loanType: 'Debt Consolidation',
    youtubeUrl: 'https://youtu.be/_4q60v6ui7k',
    title: 'Paying off $40K in debt with one simple loan',
  },
  {
    name: 'Maria Santos',
    location: 'Houston, TX',
    loanType: 'Personal Loan',
    youtubeUrl: 'https://youtu.be/txbiCQ_acpI',
    title: 'Emergency funds when I needed them most',
  },
  {
    name: 'Marcus Johnson',
    location: 'New York, NY',
    loanType: 'Mortgage Loan',
    youtubeUrl: 'https://youtu.be/o19zLEznleM',
    title: 'First-time homebuyer approved in 48 hours',
  },
  {
    name: 'Sarah Williams',
    location: 'Los Angeles, CA',
    loanType: 'Auto Loan',
    youtubeUrl: 'https://youtu.be/UyyB3ylDpbA',
    title: 'Got my dream car with an amazing rate',
  },
];

export default function Home() {
  const [emiAmount, setEmiAmount] = useState(50000);
  const [emiRate, setEmiRate] = useState(8);
  const [emiTenure, setEmiTenure] = useState(36);
  const [playingVideo, setPlayingVideo] = useState(null);

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const calculateEMI = () => {
    const p = emiAmount;
    const r = emiRate / 12 / 100;
    const n = emiTenure;
    if (r === 0) return (p / n).toFixed(2);
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi.toFixed(2);
  };

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary via-primary-dark to-dark overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-light rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <HiShieldCheck className="w-4 h-4" />
                Licensed & Regulated | Trusted by Thousands
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
                Fast, Trusted Loans for{' '}
                <span className="text-secondary">Every Need</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                From personal loans to mortgages, we connect you with top lenders offering competitive rates. Apply in minutes, get approved in hours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/apply"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary to-secondary-light text-dark font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Apply Now
                  <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/calculator"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <FaCalculator className="w-4 h-4" />
                  Calculate EMI
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Floating cards */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="text-center mb-6">
                    <p className="text-gray-300 text-sm mb-1">You could borrow up to</p>
                    <p className="text-5xl font-heading font-bold text-white">$500,000</p>
                    <p className="text-secondary text-sm mt-2">Starting at 4.99% APR</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">24hr</p>
                      <p className="text-xs text-gray-300">Fast Approval</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">0</p>
                      <p className="text-xs text-gray-300">Hidden Fees</p>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -top-6 -right-6 bg-accent text-white px-4 py-2 rounded-xl shadow-lg font-semibold text-sm"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ✓ 95% Approval Rate
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeInUp} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-primary mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-3xl font-heading font-bold text-primary">{value}</p>
                <p className="text-sm text-muted mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LOAN PRODUCTS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Our Products</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-4">Loan Solutions for Every Goal</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Whether you're buying a home, starting a business, or consolidating debt, we have the right loan for you.</p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {loanProducts.map(({ title, desc, icon: Icon, color }) => (
              <motion.div key={title} variants={fadeInUp}>
                <Link
                  to="/loans"
                  className="group block bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-border/50 hover:border-primary/20 transition-all duration-300 h-full"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-dark mb-3 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-muted leading-relaxed mb-4">{desc}</p>
                  <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm">
                    Learn More <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MINI EMI CALCULATOR */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Quick Calculator</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Calculate Your Monthly Payment</h2>
              <p className="text-gray-300 text-lg mb-8">Get an instant estimate of your monthly EMI. Adjust the sliders to see how different loan amounts and terms affect your payment.</p>
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
              >
                See Full Calculator with Amortization Table <HiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Loan Amount</span>
                    <span className="text-white font-semibold">${Number(emiAmount).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={emiAmount}
                    onChange={(e) => setEmiAmount(Number(e.target.value))}
                    className="w-full accent-secondary"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Interest Rate</span>
                    <span className="text-white font-semibold">{emiRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={emiRate}
                    onChange={(e) => setEmiRate(Number(e.target.value))}
                    className="w-full accent-secondary"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Tenure</span>
                    <span className="text-white font-semibold">{emiTenure} months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="360"
                    step="6"
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Number(e.target.value))}
                    className="w-full accent-secondary"
                  />
                </div>

                <div className="bg-white/10 rounded-xl p-6 text-center mt-4">
                  <p className="text-gray-300 text-sm mb-1">Your Estimated Monthly EMI</p>
                  <p className="text-4xl font-heading font-bold text-secondary">${Number(calculateEMI()).toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mt-2">*This is an estimate. Actual EMI may vary.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-4">The Apex Finance Advantage</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">We're committed to making the loan process simple, transparent, and stress-free.</p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {trustPoints.map(({ title, desc, icon: Icon }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="flex items-start gap-4 p-6 rounded-2xl bg-light hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark mb-1">{title}</h3>
                  <p className="text-muted leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section className="py-24 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-4">What Our Clients Say</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Real stories from real people who achieved their financial goals with Apex Finance.</p>
          </motion.div>

          {/* Video Testimonials */}
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {videoTestimonials.map((vt, idx) => {
              const videoId = getYouTubeId(vt.youtubeUrl);
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-video bg-dark">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                      title={`Testimonial ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-secondary to-secondary-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-4">Ready to Get Your Loan Approved?</h2>
            <p className="text-dark/70 text-lg mb-8 max-w-2xl mx-auto">Take the first step toward your financial goals. Apply now and get a decision within 24-48 hours.</p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:bg-primary-dark transition-all duration-300"
            >
              Start Your Application <HiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PARTNERS & ACCREDITATIONS */}
      <section className="py-12 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <HiShieldCheck className="w-6 h-6 text-primary" />
              <span>Fully Licensed</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <HiShieldCheck className="w-6 h-6 text-primary" />
              <span>BBB A+ Rating</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <HiShieldCheck className="w-6 h-6 text-primary" />
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <HiShieldCheck className="w-6 h-6 text-primary" />
              <span>Equal Housing Lender</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted">
              <HiShieldCheck className="w-6 h-6 text-primary" />
              <span>FDIC Insured Partners</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
