import { useState, useEffect, useRef } from 'react';
import api from '../api';
import './DebtConsolidation.css';

/* ─── Inline SVG Icons ─── */
const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ width: 20, height: 20, transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : '' }}>
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);
const ArrowLeft = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
);
const CheckSvg = () => (
  <svg viewBox="0 0 20 20" fill="#fff" style={{ width: 12, height: 12 }}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
);

/* ─── Data ─── */
const amountOptions = [
  { label: 'Less than $25,000', value: 'under-25k', icon: '💵', amount: 15000 },
  { label: '$25,000 – $50,000', value: '25k-50k', icon: '💰', amount: 37500 },
  { label: 'More than $50,000', value: 'over-50k', icon: '🏦', amount: 75000 },
];

const debtTypes = [
  { label: 'Credit Cards', icon: '💳' },
  { label: 'Medical Bills', icon: '🏥' },
  { label: 'Personal Loans', icon: '📝' },
  { label: 'Student Loans', icon: '🎓' },
  { label: 'Auto Loans', icon: '🚗' },
  { label: 'Other', icon: '📋' },
];

const howItWorks = [
  { num: '01', icon: '📋', title: 'Answer a Few Questions', desc: 'Tell us about your current debt — amount, types, and your situation. Takes under 60 seconds.' },
  { num: '02', icon: '👤', title: 'Get Matched with Options', desc: 'A licensed advisor reviews your profile and identifies consolidation programs that fit your situation.' },
  { num: '03', icon: '✅', title: 'Simplify Your Payments', desc: 'Choose your plan and replace multiple high-interest payments with one lower monthly payment.' },
];

const benefits = [
  { icon: '🎯', title: 'One Simple Payment', desc: 'Replace 5, 10, or even 15+ payments with just one.' },
  { icon: '📉', title: 'Lower Interest Rate', desc: 'Potentially cut your interest rate in half or more.' },
  { icon: '🗓️', title: 'Debt-Free Date', desc: 'A clear timeline to become completely debt-free.' },
  { icon: '🛡️', title: 'Stop Collection Calls', desc: 'Get relief from creditor harassment and stress.' },
];

const compareData = [
  { metric: 'Monthly Payments', before: '5–15 separate bills', after: '1 simple payment' },
  { metric: 'Average APR', before: '18%–29%', after: '5.99%–21.99%' },
  { metric: 'Payment Tracking', before: 'Multiple due dates', after: 'One due date' },
  { metric: 'Debt-Free Timeline', before: 'Unclear / decades', after: '24–84 months' },
  { metric: 'Monthly Stress', before: 'High', after: 'Under control' },
];

const trustBadges = [
  { icon: '🛡️', label: 'Federally Licensed', sub: 'Fully Compliant' },
  { icon: '🔒', label: '256-bit SSL', sub: 'Encrypted' },
  { icon: '⭐', label: 'BBB Accredited', sub: 'A+ Rating' },
  { icon: '📄', label: '1,000+', sub: 'Clients Helped' },
  { icon: '📅', label: '5+ Years', sub: 'In Business' },
  { icon: '🗺️', label: '48 States', sub: 'Licensed' },
];

const faqData = [
  { q: 'What is debt consolidation?', a: 'Debt consolidation combines multiple debts — like credit cards, medical bills, and personal loans — into a single loan with one monthly payment, often at a lower interest rate. Instead of juggling multiple payments and due dates, you make one payment each month.' },
  { q: 'Will this affect my credit score?', a: 'Checking your options through our questionnaire does not affect your credit score. A formal credit inquiry only happens if you choose to move forward with a specific consolidation program. In fact, successfully consolidating debt and making on-time payments can improve your credit over time.' },
  { q: 'How much can I save with debt consolidation?', a: 'Savings vary based on your current interest rates, total debt, and the consolidation terms you qualify for. Many clients see their effective interest rate cut significantly, saving thousands over the life of the loan. Your advisor will provide exact numbers for your situation.' },
  { q: 'What types of debt can be consolidated?', a: 'Most unsecured debts can be consolidated, including credit card balances, medical bills, personal loans, payday loans, and some other debts. Secured debts like mortgages and auto loans are typically handled separately.' },
  { q: 'Is there a fee to check my options?', a: 'No. It is completely free to submit your information, speak with an advisor, and receive your debt relief options. There is no cost or obligation at this stage.' },
  { q: 'How quickly can I get started?', a: 'After submitting your information, a licensed debt advisor will typically reach out within one business day. From there, many clients have their consolidation plan set up within 1-2 weeks.' },
];


/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function DebtConsolidation() {
  const [scrolled, setScrolled] = useState(false);
  const [quizStep, setQuizStep] = useState(0); // 0 = amount, 1 = debt types, 2 = contact, 3 = thank you
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [appId, setAppId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const quizRef = useRef(null);

  // Sticky header
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToQuiz = () => {
    quizRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Step 1: Select amount → auto advance
  const handleAmountSelect = (opt) => {
    setSelectedAmount(opt);
    setTimeout(() => setQuizStep(1), 300);
  };

  // Step 2: Toggle debt types
  const toggleDebtType = (label) => {
    setSelectedTypes(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  // Step 3: Submit → save lead to backend & show Thank You
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api.post('/applications/submit', {
        personalInfo: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          dob: '',
          ssnLast4: '',
          address: '',
          city: '',
          state: '',
          zip: '',
        },
        loanDetails: {
          type: 'debt-consolidation',
          amount: selectedAmount?.amount || 25000,
          purpose: `Debt Consolidation — ${selectedAmount?.label || 'Not specified'}. Debt types: ${selectedTypes.join(', ') || 'Not specified'}.`,
        },
        financialInfo: {
          monthlyIncome: '',
          employmentStatus: '',
          employer: '',
          creditScore: '',
        },
      });
      setAppId(res.data.applicationId || '');
      setQuizStep(3); // Show Thank You screen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateContact = (key, value) => setContact(prev => ({ ...prev, [key]: value }));

  /* ─────────── RENDER ─────────── */
  return (
    <div className="dc-page">
      {/* ── STICKY HEADER ── */}
      <header className={`dc-sticky-header ${scrolled ? 'dc-sticky-visible' : ''}`}>
        <div className="dc-container dc-header-inner">
          <a href="/" className="dc-logo">
            <img src="/logo.png" alt="Apex Finance" className="dc-logo-img" />
            <span>Apex Finance</span>
          </a>
          <button onClick={scrollToQuiz} className="dc-btn dc-btn-sm">Get Free Quote →</button>
        </div>
      </header>

      {/* ═══ FULL-PAGE QUESTIONNAIRE ═══ */}
      <section className="dc-hero-full" ref={quizRef}>
        {/* Top bar with logo and phone */}
        <div className="dc-topbar">
          <a href="/" className="dc-logo">
            <img src="/logo.png" alt="Apex Finance" className="dc-logo-img" />
            <span>Apex Finance</span>
          </a>
        </div>
        {/* Progress line */}
        <div className="dc-progress-line">
          <div className="dc-progress-fill" style={{ width: `${((quizStep + 1) / 3) * 100}%` }} />
        </div>

        <div className="dc-quiz-center">
          {/* Step 1: Amount */}
          {quizStep === 0 && (
            <div className="dc-quiz-body" key="step-0">
              <h1 className="dc-quiz-headline">Let's check your debt consolidation or loan options.</h1>
              <p className="dc-quiz-sub">How much debt do you owe?</p>
              <div className="dc-pill-options">
                {amountOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`dc-pill-btn ${selectedAmount?.value === opt.value ? 'dc-pill-active' : ''}`}
                    onClick={() => handleAmountSelect(opt)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="dc-quiz-trust-center">
                <span><ShieldIcon /> Checking options won't impact your credit score</span>
                <span><LockIcon /> Your info is protected with advanced encryption technology</span>
              </div>
            </div>
          )}

          {/* Step 2: Debt Types */}
          {quizStep === 1 && (
            <div className="dc-quiz-body" key="step-1">
              <button className="dc-back-link" onClick={() => setQuizStep(0)}>
                <ArrowLeft /> Back
              </button>
              <h1 className="dc-quiz-headline">What type of debt do you have?</h1>
              <p className="dc-quiz-sub">Select all that apply</p>
              <div className="dc-pill-options">
                {debtTypes.map(dt => (
                  <button
                    key={dt.label}
                    className={`dc-pill-btn ${selectedTypes.includes(dt.label) ? 'dc-pill-active' : ''}`}
                    onClick={() => toggleDebtType(dt.label)}
                  >
                    {selectedTypes.includes(dt.label) && <span className="dc-pill-check">✓</span>}
                    {dt.label}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <button
                  className="dc-pill-btn dc-pill-continue"
                  onClick={() => { if (selectedTypes.length > 0) setQuizStep(2); }}
                  style={{ opacity: selectedTypes.length === 0 ? 0.4 : 1, pointerEvents: selectedTypes.length === 0 ? 'none' : 'auto' }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Info */}
          {quizStep === 2 && (
            <div className="dc-quiz-body" key="step-2">
              <button className="dc-back-link" onClick={() => setQuizStep(1)}>
                <ArrowLeft /> Back
              </button>
              <h1 className="dc-quiz-headline">Almost done!</h1>
              <p className="dc-quiz-sub">Where should we send your personalized options?</p>
              <form onSubmit={handleSubmit} className="dc-contact-form">
                <div className="dc-contact-row">
                  <div className="dc-contact-field">
                    <label htmlFor="dc-fn">First Name</label>
                    <input id="dc-fn" type="text" placeholder="John" required value={contact.firstName} onChange={e => updateContact('firstName', e.target.value)} />
                  </div>
                  <div className="dc-contact-field">
                    <label htmlFor="dc-ln">Last Name</label>
                    <input id="dc-ln" type="text" placeholder="Smith" required value={contact.lastName} onChange={e => updateContact('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="dc-contact-field">
                  <label htmlFor="dc-email">Email Address</label>
                  <input id="dc-email" type="email" placeholder="john@example.com" required value={contact.email} onChange={e => updateContact('email', e.target.value)} />
                </div>
                <div className="dc-contact-field">
                  <label htmlFor="dc-phone">Phone Number</label>
                  <input id="dc-phone" type="tel" placeholder="(555) 123-4567" required value={contact.phone} onChange={e => updateContact('phone', e.target.value)} />
                </div>
                {submitError && <p className="dc-error">{submitError}</p>}
                <button type="submit" className="dc-pill-btn dc-pill-continue" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'See My Options →'}
                </button>
              </form>
              <p className="dc-form-disclaimer">🔒 No credit pull · 100% free · No obligation · Your data is never sold</p>
            </div>
          )}

          {/* Step 4: Thank You Screen */}
          {quizStep === 3 && (
            <div className="dc-quiz-body dc-thankyou" key="step-3">
              <div className="dc-thankyou-check">✅</div>
              <h1 className="dc-quiz-headline">You're all set, {contact.firstName}!</h1>
              <p className="dc-quiz-sub">A licensed debt advisor will review your profile and reach out within 1 business day.</p>

              {appId && (
                <div className="dc-ref-box">
                  <span className="dc-ref-label">Reference Number</span>
                  <span className="dc-ref-id">{appId}</span>
                  <span className="dc-ref-hint">Save this for your records</span>
                </div>
              )}

              <div className="dc-next-steps">
                <h3 className="dc-next-title">What happens next?</h3>
                <div className="dc-next-list">
                  <div className="dc-next-item">
                    <span className="dc-next-num">1</span>
                    <div>
                      <strong>We review your debt profile</strong>
                      <p>Our team analyzes your situation to find the best consolidation options.</p>
                    </div>
                  </div>
                  <div className="dc-next-item">
                    <span className="dc-next-num">2</span>
                    <div>
                      <strong>A licensed advisor calls you</strong>
                      <p>You'll receive a call at {contact.phone} to discuss your options.</p>
                    </div>
                  </div>
                  <div className="dc-next-item">
                    <span className="dc-next-num">3</span>
                    <div>
                      <strong>Choose your consolidation plan</strong>
                      <p>Pick the plan that fits your budget — no obligation to proceed.</p>
                    </div>
                  </div>
                </div>
              </div>

              <a href="/" className="dc-pill-btn dc-pill-continue" style={{ textDecoration: 'none', marginTop: 24 }}>
                Return to Homepage
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="dc-section dc-section-cream">
        <div className="dc-container">
          <h2 className="dc-h2">How Debt Consolidation Works</h2>
          <p className="dc-section-sub">Three simple steps to simplify your finances and start saving money.</p>
          <div className="dc-steps-grid">
            {howItWorks.map((s, i) => (
              <div key={i} className="dc-step-card">
                <span className="dc-step-num">{s.num}</span>
                <span className="dc-step-icon">{s.icon}</span>
                <h3 className="dc-step-title">{s.title}</h3>
                <p className="dc-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="dc-section dc-section-white">
        <div className="dc-container">
          <h2 className="dc-h2">Why Consolidate with Apex Finance?</h2>
          <p className="dc-section-sub">Take control of your debt and start breathing easier.</p>
          <div className="dc-benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="dc-benefit-card">
                <span className="dc-benefit-icon">{b.icon}</span>
                <h3 className="dc-benefit-title">{b.title}</h3>
                <p className="dc-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="dc-section dc-section-cream">
        <div className="dc-container">
          <h2 className="dc-h2">Before vs. After Consolidation</h2>
          <p className="dc-section-sub">See the difference debt consolidation can make.</p>
          <div className="dc-compare">
            <table className="dc-compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Before</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                {compareData.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#0D2340' }}>{row.metric}</td>
                    <td className="dc-compare-before">{row.before}</td>
                    <td className="dc-compare-after">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="dc-section dc-section-navy">
        <div className="dc-container">
          <h2 className="dc-h2 dc-h2-light">Licensed. Trusted. Proven.</h2>
          <div className="dc-trust-grid">
            {trustBadges.map((b, i) => (
              <div key={i} className="dc-trust-item">
                <span className="dc-trust-icon">{b.icon}</span>
                <span className="dc-trust-label">{b.label}</span>
                <span className="dc-trust-sub">{b.sub}</span>
              </div>
            ))}
          </div>
          <p className="dc-trust-text">Your personal information is protected with 256-bit SSL encryption and will only be used to match you with debt relief programs that fit your situation. We will never sell your data.</p>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="dc-section dc-section-white">
        <div className="dc-container dc-faq-container">
          <h2 className="dc-h2">Common Questions About Debt Consolidation</h2>
          <div className="dc-faq-list">
            {faqData.map((faq, i) => (
              <div key={i} className={`dc-faq-item ${openFaq === i ? 'dc-faq-open' : ''}`}>
                <button className="dc-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronIcon open={openFaq === i} />
                </button>
                <div className="dc-faq-a-wrap" style={{ maxHeight: openFaq === i ? '500px' : '0' }}>
                  <p className="dc-faq-a">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="dc-cta-section">
        <div className="dc-container dc-cta-inner">
          <h2 className="dc-h2">Ready to Simplify Your Debt?</h2>
          <p className="dc-cta-sub">Find out how much you could save — it's free, takes 60 seconds, and won't affect your credit score.</p>
          <button onClick={scrollToQuiz} className="dc-btn">Get My Free Quote →</button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="dc-footer">
        <div className="dc-container">
          <div className="dc-footer-top">
            <a href="/" className="dc-logo">
              <img src="/logo.png" alt="Apex Finance" className="dc-logo-img" />
              <span>Apex Finance</span>
            </a>
            <div className="dc-footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
          <div className="dc-footer-disclosures">
            <p>Apex Finance | Federally & State Licensed | Loan Matching Service</p>
            <p>Apex Finance LLC is not a lender. We are a free loan matching service that connects borrowers with a network of licensed lenders. We do not make credit decisions or issue loans. Loan approval, terms, and rates are determined solely by the lender. Not all applicants will qualify.</p>
            <p>This content is for educational purposes only and does not constitute financial advice. Consult a licensed financial professional for advice specific to your situation.</p>
            <p>APR ranges from 5.99% to 35.99% depending on creditworthiness, loan amount, and lender terms.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
