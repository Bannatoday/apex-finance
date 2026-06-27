import { motion } from 'framer-motion';
import { HiShieldCheck, HiHeart, HiLightBulb, HiUserGroup, HiGlobe, HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const values = [
  { icon: HiShieldCheck, title: 'Integrity', desc: 'We operate with complete transparency and honesty in everything we do.' },
  { icon: HiHeart, title: 'Client-First', desc: 'Your financial well-being is at the heart of every decision we make.' },
  { icon: HiLightBulb, title: 'Innovation', desc: 'We leverage technology to make loan applications faster and simpler.' },
  { icon: HiUserGroup, title: 'Inclusivity', desc: 'We believe everyone deserves access to fair and equitable financing.' },
  { icon: HiGlobe, title: 'Community', desc: 'We give back to communities through financial literacy programs.' },
  { icon: HiStar, title: 'Excellence', desc: 'We strive for the highest standards of service and professionalism.' },
];

const team = [
  { name: 'Robert Mitchell', title: 'CEO & Founder', bio: '20+ years in financial services' },
  { name: 'Sarah Chen', title: 'Chief Operations Officer', bio: 'Former VP at Wells Fargo' },
  { name: 'James Rodriguez', title: 'Head of Lending', bio: 'Expert in residential & commercial loans' },
  { name: 'Emily Thompson', title: 'Client Relations Director', bio: 'Dedicated to client satisfaction' },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">About Us</span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Our Story & Mission</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">Building bridges between borrowers and lenders since 2019. We're on a mission to make financing accessible, transparent, and fair for everyone.</p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Who We Are</span>
              <h2 className="text-3xl font-heading font-bold text-dark mb-6">Empowering Financial Futures</h2>
              <div className="space-y-4 text-muted leading-relaxed text-base">
                <p>Founded in 2019, Apex Finance was born from a simple belief: the loan process shouldn't be complicated, opaque, or intimidating. Our founder, Robert Mitchell, spent two decades in traditional banking and saw firsthand how the system failed everyday borrowers.</p>
                <p>Today, we've helped over 1,000 clients secure more than $50 million in loans. From first-time homebuyers to established business owners, we connect people with the right lenders and competitive terms.</p>
                <p>As a licensed loan matching service, we work with a network of trusted lenders across the United States, helping our clients access competitive rates and flexible terms tailored to their unique financial situations.</p>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <p className="text-3xl font-heading font-bold text-primary">$50M+</p>
                  <p className="text-sm text-muted mt-1">Loans Funded</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <p className="text-3xl font-heading font-bold text-primary">1,000+</p>
                  <p className="text-sm text-muted mt-1">Happy Clients</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <p className="text-3xl font-heading font-bold text-primary">95%</p>
                  <p className="text-sm text-muted mt-1">Approval Rate</p>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <p className="text-3xl font-heading font-bold text-primary">50+</p>
                  <p className="text-sm text-muted mt-1">Lending Partners</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-4">What Drives Us</h2>
          </motion.div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {values.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeInUp} className="bg-light rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-dark text-lg mb-2">{title}</h3>
                <p className="text-muted">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-dark mb-4">Meet the Experts</h2>
          </motion.div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {team.map(({ name, title, bio }) => (
              <motion.div key={name} variants={fadeInUp} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-heading font-bold mx-auto mb-4">
                  {name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-heading font-bold text-dark">{name}</h3>
                <p className="text-secondary text-sm font-medium mb-2">{title}</p>
                <p className="text-muted text-sm">{bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Licenses */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HiShieldCheck className="w-16 h-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Licensed & Regulated</h2>
          <p className="text-gray-300 mb-6">Apex Finance is fully licensed and compliant with all federal and state lending regulations.</p>
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-xl px-8 py-4 border border-white/20">
            <p className="text-xl font-heading font-bold text-secondary">Federally & State Compliant</p>
          </div>
          <p className="text-gray-400 text-sm mt-4 max-w-lg mx-auto">
            Not a lender. Apex Finance LLC is a loan matching service that connects borrowers with licensed lenders. We do not make credit decisions or issue loans. Not all applicants will qualify.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-dark mb-4">Ready to Work With Us?</h2>
          <p className="text-muted mb-8">Let our team of experts help you find the perfect loan for your needs.</p>
          <Link to="/apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary to-secondary-light text-dark font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
}
