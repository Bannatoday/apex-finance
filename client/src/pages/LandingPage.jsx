import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

/* ─── icons (inline SVGs to avoid external deps) ─── */
const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
);
const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1"><path d="M8 5v14l11-7z" /></svg>
);

/* ─── data ─── */
const painPoints = [
  { icon: '💰', text: '"I need to save up 20% before I can even think about buying." — You probably don\'t. Many programs require far less than what most people assume.' },
  { icon: '📊', text: '"My credit score isn\'t good enough." — More buyers qualify than they expect. Several programs are designed specifically for imperfect credit.' },
  { icon: '🤷', text: '"I have no idea where to start or who to trust." — The mortgage process feels overwhelming because no one walks you through it in plain English.' },
  { icon: '🏠', text: '"Homeownership is for people who have it all figured out — not me." — Most first-time buyers felt exactly the same way before they started.' },
];

const steps = [
  { num: '01', title: 'Tell Us About Your Situation', desc: 'Answer a few quick questions — things like your income type, general credit range, and what kind of home you\'re looking for. Takes about two minutes.', icon: '📋' },
  { num: '02', title: 'A Licensed Advisor Reviews Your Profile', desc: 'A real person — not a bot — reviews your information and identifies which loan programs match your situation. No credit pull at this stage.', icon: '👤' },
  { num: '03', title: 'Get Your Options, Clearly Explained', desc: 'Your advisor walks you through what you qualify for in plain English. No pressure, no obligation. Just clarity on your real options.', icon: '✅' },
];

const videoUrls = [
  'https://youtu.be/E38JTm_AzsY',
  'https://youtu.be/skhsLLdWjcA',
  'https://youtu.be/_4q60v6ui7k',
  'https://youtu.be/txbiCQ_acpI',
  'https://youtu.be/o19zLEznleM',
  'https://youtu.be/UyyB3ylDpbA',
];

const buyerTypes = [
  { icon: '🏡', label: 'First-Time Buyer' },
  { icon: '💼', label: 'Self-Employed' },
  { icon: '🔧', label: 'Credit Needs Work' },
  { icon: '🐖', label: 'Thought You Needed More Saved' },
  { icon: '🎖️', label: 'Active Military or Veteran' },
  { icon: '🔑', label: 'Currently Renting, Ready to Own' },
];

const trustBadges = [
  { icon: '🛡️', label: 'Federally Licensed', sub: 'Fully Compliant' },
  { icon: '🏘️', label: 'Equal Housing', sub: 'Lender' },
  { icon: '⭐', label: 'BBB Accredited', sub: 'A+ Rating' },
  { icon: '📄', label: '1,000+', sub: 'Loans Closed' },
  { icon: '📅', label: '5+ Years', sub: 'In Business' },
  { icon: '🗺️', label: '48 States', sub: 'Licensed' },
];

const faqData = [
  { q: 'Will checking my options affect my credit score?', a: 'No. When you submit your information through this page, we do a soft review of your situation — not a hard credit pull. Your credit score will not be affected. A formal credit inquiry only happens later, if and when you choose to move forward with a specific lender and loan program. At this stage, we\'re simply helping you understand what may be available to you.' },
  { q: 'What if my credit score isn\'t great?', a: 'Many buyers with less-than-perfect credit still qualify for home loan programs. There are options specifically designed for borrowers who are still building or rebuilding their credit. Your advisor will help you understand which programs fit your current profile and, if needed, what steps could improve your position.' },
  { q: 'How is this different from going directly to a bank?', a: 'When you go to a single bank, you only see what that one institution offers. We work with a network of lenders, which means we can match you with programs across multiple sources — often uncovering options you wouldn\'t find on your own. Think of us as your guide through the entire landscape, not just one corner of it.' },
  { q: 'Is there really no cost to get started?', a: 'Correct. There is no fee to submit your information, speak with an advisor, or receive your loan options. Our service is free to you at this stage. If you choose to move forward with a loan, your lender will disclose all costs and fees before you commit to anything.' },
  { q: 'What happens after I submit my information?', a: 'A licensed loan advisor will review your profile and reach out to you — typically within one business day. They\'ll walk you through your options, answer your questions, and help you understand your next steps. There\'s no obligation to proceed.' },
  { q: 'What loan programs are available for first-time buyers?', a: 'Several. Government-backed programs like FHA, VA, and USDA loans are designed to make homeownership more accessible. Many of these allow lower down payments, more flexible credit requirements, and some even offer down payment assistance. Your advisor will explain which ones apply to your situation.' },
];


/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const formTopRef = useRef(null);
  const formBottomRef = useRef(null);

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // sticky header
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('fullName') || '';
    const email = fd.get('email') || '';
    const phone = fd.get('phone') || '';
    const [firstName = '', ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ');
    navigate(`/apply?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
  };

  const scrollToForm = () => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* ─────────── render ─────────── */
  return (
    <div className="lp-page">
      {/* ── STICKY HEADER ── */}
      <header className={`lp-sticky-header ${scrolled ? 'lp-sticky-visible' : ''}`}>
        <div className="lp-container lp-header-inner">
          <div className="lp-logo-sm">
            <img src="/logo.png" alt="Apex Finance" className="lp-logo-img-sm" />
            <span>Apex Finance</span>
          </div>
          <button onClick={scrollToForm} className="lp-btn lp-btn-sm">Check My Options →</button>
        </div>
      </header>

      {/* ═══ SECTION 1 — HERO ═══ */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-text">
            <h1 className="lp-h1">Find Out Which Home Loan You Qualify&nbsp;For&nbsp;— Free, In&nbsp;Minutes</h1>
            <p className="lp-hero-sub">No credit pull. No obligation. No surprises.<br />Just a clear picture of the loan programs available to you.</p>
            <div className="lp-hero-trust">
              <span>⭐ 4.9/5 Rating</span>
              <span className="lp-dot">•</span>
              <span>1,000+ Families Helped</span>
              <span className="lp-dot">•</span>
              <span>5+ Years in Business</span>
            </div>
          </div>
          <div className="lp-form-card" ref={formTopRef}>
            <h2 className="lp-form-title">Get Your Free Loan Options</h2>
            <p className="lp-form-sub">Takes less than 60 seconds. No credit impact.</p>
            <form onSubmit={handleFormSubmit} className="lp-form">
              <div className="lp-field">
                <label htmlFor="hero-name">Full Name</label>
                <input id="hero-name" name="fullName" type="text" placeholder="John Smith" required />
              </div>
              <div className="lp-field">
                <label htmlFor="hero-email">Email Address</label>
                <input id="hero-email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="lp-field">
                <label htmlFor="hero-phone">Phone Number</label>
                <input id="hero-phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
              </div>
              <button type="submit" className="lp-btn lp-btn-full">Check My Loan Options →</button>
            </form>
            <p className="lp-form-disclaimer">🔒 Your information is secure and never shared without your consent.</p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — PROBLEM AGITATION ═══ */}
      <section className="lp-section lp-section-white">
        <div className="lp-container">
          <h2 className="lp-h2">If Any of This Sounds Familiar, You're Not Alone</h2>
          <div className="lp-pain-list">
            {painPoints.map((p, i) => (
              <div key={i} className="lp-pain-item">
                <span className="lp-pain-icon">{p.icon}</span>
                <p className="lp-pain-text">{p.text}</p>
              </div>
            ))}
          </div>
          <p className="lp-pain-closer">These beliefs hold thousands of qualified buyers back every year. <strong>The truth? You may be closer to owning a home than you think.</strong></p>
        </div>
      </section>

      {/* ═══ SECTION 3 — HOW IT WORKS ═══ */}
      <section className="lp-section lp-section-cream">
        <div className="lp-container">
          <h2 className="lp-h2">Here's How It Works — Simple, Fast, and Risk-Free</h2>
          <div className="lp-steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="lp-step-card">
                <span className="lp-step-num">{s.num}</span>
                <span className="lp-step-icon">{s.icon}</span>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="lp-steps-reassure">Most people get a response within one business day. There's zero risk and zero cost to find out where you stand.</p>
        </div>
      </section>

      {/* ═══ SECTION 4 — VIDEO TESTIMONIALS ═══ */}
      <section className="lp-section lp-section-white">
        <div className="lp-container">
          <h2 className="lp-h2">Real People. Real Results.</h2>
          <p className="lp-section-sub">Hear from homebuyers who started exactly where you are right now.</p>
          <div className="lp-testimonials-grid">
            {videoUrls.map((url, i) => {
              const videoId = getYouTubeId(url);
              return (
                <div key={i} className="lp-testimonial-card">
                  <div className="lp-video-placeholder">
                    {playingVideo === i ? (
                      <iframe
                        className="lp-video-iframe"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                        title={`Testimonial ${i + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setPlayingVideo(i)}
                        className="lp-video-thumb-btn"
                        aria-label={`Play testimonial ${i + 1}`}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt=""
                          className="lp-video-thumb"
                        />
                        <div className="lp-video-overlay" />
                        <div className="lp-play-btn"><PlayIcon /></div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="lp-disclaimer-sm">Results vary. Individual loan eligibility depends on personal financial profile.</p>
        </div>
      </section>

      {/* ═══ SECTION 5 — WHO THIS IS FOR ═══ */}
      <section className="lp-section lp-section-cream">
        <div className="lp-container">
          <h2 className="lp-h2">This Is For You If…</h2>
          <div className="lp-buyer-grid">
            {buyerTypes.map((b, i) => (
              <div key={i} className="lp-buyer-card">
                <span className="lp-buyer-icon">{b.icon}</span>
                <span className="lp-buyer-label">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="lp-buyer-closer">If any of these sound like you, you're in the right place.</p>
        </div>
      </section>

      {/* ═══ SECTION 6 — TRUST ═══ */}
      <section className="lp-section lp-section-navy">
        <div className="lp-container">
          <h2 className="lp-h2 lp-h2-light">Licensed. Trusted. Proven.</h2>
          <div className="lp-trust-grid">
            {trustBadges.map((b, i) => (
              <div key={i} className="lp-trust-item">
                <span className="lp-trust-icon">{b.icon}</span>
                <span className="lp-trust-label">{b.label}</span>
                <span className="lp-trust-sub">{b.sub}</span>
              </div>
            ))}
          </div>
          <p className="lp-trust-text">Your personal information is protected with bank-level encryption and will only be used to match you with loan programs that fit your situation. We will never sell your data.</p>
        </div>
      </section>

      {/* ═══ SECTION 7 — FAQ ═══ */}
      <section className="lp-section lp-section-white">
        <div className="lp-container lp-faq-container">
          <h2 className="lp-h2">Common Questions, Honest Answers</h2>
          <div className="lp-faq-list">
            {faqData.map((faq, i) => (
              <div key={i} className={`lp-faq-item ${openFaq === i ? 'lp-faq-open' : ''}`}>
                <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronIcon open={openFaq === i} />
                </button>
                <div className="lp-faq-a-wrap" style={{ maxHeight: openFaq === i ? '500px' : '0' }}>
                  <p className="lp-faq-a">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8 — FINAL CTA ═══ */}
      <section className="lp-section lp-section-cta">
        <div className="lp-container lp-cta-grid">
          <div className="lp-cta-text">
            <h2 className="lp-h2 lp-h2-cta">Your Home Loan Options Are Waiting. Find Out for Free.</h2>
            <p className="lp-cta-sub">There's no credit pull, no cost, and no obligation. Just a clear, honest look at what's available to you — in minutes.</p>
            <div className="lp-advisor-badge">
              <div className="lp-advisor-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <div>
                <p className="lp-advisor-name">Sarah Mitchell</p>
                <p className="lp-advisor-title">Licensed Loan Advisor</p>
              </div>
            </div>
          </div>
          <div className="lp-form-card lp-form-card-cta" ref={formBottomRef}>
            <h3 className="lp-form-title">Start Here — It's Free</h3>
            <form onSubmit={handleFormSubmit} className="lp-form">
              <div className="lp-field">
                <label htmlFor="cta-name">Full Name</label>
                <input id="cta-name" name="fullName" type="text" placeholder="John Smith" required />
              </div>
              <div className="lp-field">
                <label htmlFor="cta-email">Email Address</label>
                <input id="cta-email" name="email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="lp-field">
                <label htmlFor="cta-phone">Phone Number</label>
                <input id="cta-phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
              </div>
              <button type="submit" className="lp-btn lp-btn-full">Check My Loan Options →</button>
            </form>
            <p className="lp-form-disclaimer">🔒 No credit pull · 100% free · No obligation</p>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-top">
            <div className="lp-logo-sm">
              <img src="/logo.png" alt="Apex Finance" className="lp-logo-img-sm" />
              <span>Apex Finance</span>
            </div>
            <div className="lp-footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
          <div className="lp-footer-disclosures">
            <p>Apex Finance | Federally & State Licensed | Equal Housing Lender</p>
            <p>Not a lender. Apex Finance connects borrowers with qualified lending partners. All loan applications are subject to credit approval by the lending partner. Terms and conditions apply.</p>
            <p>This content is for educational purposes only and does not constitute financial advice. Consult a licensed financial professional for advice specific to your situation.</p>
            <p className="lp-footer-ehl">
              <span className="lp-ehl-icon">⌂</span> Equal Housing Lender
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
