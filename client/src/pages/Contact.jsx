import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import api from '../api';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', message: res.data.message });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-light/50 text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Contact Us</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Have questions? We're here to help. Reach out to our team.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border/50 p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-2xl font-heading font-bold text-dark mb-6">Send Us a Message</h2>
              {status.message && (
                <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>{status.message}</div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-dark mb-2">Full Name *</label><input required className={inputClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" /></div>
                  <div><label className="block text-sm font-medium text-dark mb-2">Email *</label><input required type="email" className={inputClass} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" /></div>
                  <div><label className="block text-sm font-medium text-dark mb-2">Phone</label><input type="tel" className={inputClass} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" /></div>
                  <div><label className="block text-sm font-medium text-dark mb-2">Subject</label><input className={inputClass} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" /></div>
                </div>
                <div><label className="block text-sm font-medium text-dark mb-2">Message *</label><textarea required rows="5" className={inputClass} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us more..." /></div>
                <button type="submit" disabled={sending} className="px-8 py-3 bg-gradient-to-r from-secondary to-secondary-light text-dark font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              <p className="text-xs text-muted mt-4 leading-relaxed">Apex Finance LLC is a loan matching service, not a direct lender. We do not make credit decisions or guarantee loan approval.</p>
            </motion.div>

            <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              {[
                { icon: FaMapMarkerAlt, title: 'Office Address', lines: ['123 Financial District', 'Suite 500', 'New York, NY 10004'] },
                { icon: FaPhone, title: 'Phone', lines: ['(212) 555-1234', 'Mon-Fri, 9am-6pm EST'] },
                { icon: FaEnvelope, title: 'Email', lines: ['info@apexfinancellc.com', 'support@apexfinancellc.com'] },
                { icon: FaClock, title: 'Business Hours', lines: ['Monday–Friday: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 2:00 PM', 'Sunday: Closed'] },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="bg-white rounded-2xl shadow-sm border border-border/50 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Icon className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">{title}</h3>
                      {lines.map((l, i) => <p key={i} className="text-sm text-muted">{l}</p>)}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-2 h-64 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1638811000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '14px' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Office Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
