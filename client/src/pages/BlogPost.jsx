import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiClock, HiCalendar, HiArrowLeft, HiShare, HiArrowRight } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaShieldAlt } from 'react-icons/fa';
import api from '../api';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const catLabels = { 'loan-tips': 'Loan Tips', 'credit-score': 'Credit Score', 'business-financing': 'Business Financing', 'market-updates': 'Market Updates', 'first-time-borrowers': 'First-Time Borrowers', 'personal-finance': 'Personal Finance', 'debt-consolidation': 'Debt Consolidation' };

// CTA Component for debt consolidation posts
const DebtConsolidationCTA = () => (
  <div style={{
    background: 'linear-gradient(135deg, #1B3A6B 0%, #0D2340 100%)',
    borderRadius: '16px',
    padding: '40px 32px',
    marginTop: '40px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(201, 168, 76, 0.3)',
  }}>
    <div style={{
      position: 'absolute', top: 0, right: 0, width: '200px', height: '200px',
      background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
    }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <FaShieldAlt style={{ color: '#C9A84C', fontSize: '18px' }} />
        <span style={{ color: '#C9A84C', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Free · No Credit Impact · 60 Seconds</span>
      </div>
      <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, lineHeight: 1.3, margin: '0 0 12px' }}>
        See How Much You Could Save on Your Credit Card Debt
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '480px' }}>
        Check your eligibility in under 60 seconds. No hard credit pull — your score stays untouched.
      </p>
      <Link
        to="/debt-consolidation"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #C9A84C, #B8943F)',
          color: '#0D2340', padding: '14px 28px', borderRadius: '10px',
          fontWeight: 700, fontSize: '15px', textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,168,76,0.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(201,168,76,0.3)'; }}
      >
        Check My Options <HiArrowRight style={{ fontSize: '16px' }} />
      </Link>
    </div>
  </div>
);

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blog/public/${slug}`);
        setPost(res.data.post);
        setRelated(res.data.relatedPosts);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-24 space-y-4">
        <div className="h-8 skeleton w-1/4" /><div className="h-12 skeleton w-3/4" /><div className="h-4 skeleton w-1/3" />
        <div className="mt-8 space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-4 skeleton" />)}</div>
      </div>
    </div>
  );

  if (!post) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="text-2xl font-heading font-bold text-dark mb-4">Post Not Found</h2><Link to="/blog" className="text-primary font-medium">← Back to Blog</Link></div>
    </div>
  );

  const shareUrl = window.location.href;

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <Link to="/blog" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-6 transition-colors"><HiArrowLeft className="w-4 h-4" /> Back to Blog</Link>
            <span className="inline-block text-xs font-medium text-dark bg-secondary px-3 py-1 rounded-full mb-4">{catLabels[post.category] || post.category}</span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span>{post.author}</span>
              <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" /> {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1"><HiClock className="w-4 h-4" /> {post.readTime} min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-12">
            <motion.div className="lg:col-span-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-8 sm:p-10">
                <div className="blog-content prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* CTA for debt consolidation posts */}
                {(post.tags?.some(t => t.toLowerCase().includes('debt consolidation')) || post.category === 'personal-finance' || post.category === 'debt-consolidation') && (
                  <DebtConsolidationCTA />
                )}
              </div>

              {/* Share */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm font-semibold text-dark">Share:</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity"><FaFacebookF className="w-4 h-4" /></a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity"><FaTwitter className="w-4 h-4" /></a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${post.title}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-80 transition-opacity"><FaLinkedinIn className="w-4 h-4" /></a>
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="space-y-6">
              {post.tags?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6">
                  <h3 className="font-heading font-semibold text-dark mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">{post.tags.map(t => <span key={t} className="text-xs bg-light text-muted px-3 py-1 rounded-full">{t}</span>)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-bold text-dark mb-8">Related Posts</h2>
              <div className="grid sm:grid-cols-3 gap-8">
                {related.map(r => (
                  <Link key={r._id} to={`/blog/${r.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all">
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"><span className="text-3xl font-heading font-bold text-primary/20">{r.title.charAt(0)}</span></div>
                    <div className="p-5">
                      <h3 className="font-heading font-semibold text-dark text-sm group-hover:text-primary transition-colors line-clamp-2">{r.title}</h3>
                      <p className="text-xs text-muted mt-2">{r.readTime} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
