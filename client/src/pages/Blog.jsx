import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch, HiClock, HiArrowRight } from 'react-icons/hi';
import api from '../api';

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cats = ['all', 'loan-tips', 'credit-score', 'business-financing', 'market-updates', 'first-time-borrowers'];
const catLabels = { 'all': 'All', 'loan-tips': 'Loan Tips', 'credit-score': 'Credit Score', 'business-financing': 'Business Financing', 'market-updates': 'Market Updates', 'first-time-borrowers': 'First-Time Borrowers' };

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const category = searchParams.get('category') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 6 };
        if (category !== 'all') params.category = category;
        if (search) params.search = search;
        const res = await api.get('/blog/public', { params });
        setPosts(res.data.posts);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category, page, search]);

  const setCategory = (cat) => setSearchParams({ category: cat, page: 1 });
  const setPage = (p) => setSearchParams({ category, page: p });

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Financial Insights Blog</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">Tips, guides, and insights to help you make smarter financial decisions.</p>
            <div className="max-w-xl mx-auto relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-dark text-sm focus:outline-none shadow-lg" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {cats.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === c ? 'bg-primary text-white' : 'bg-light text-muted hover:bg-primary/5'}`}>
                {catLabels[c]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
                  <div className="h-48 skeleton" />
                  <div className="p-6 space-y-3"><div className="h-4 skeleton w-1/4" /><div className="h-6 skeleton w-3/4" /><div className="h-4 skeleton w-full" /><div className="h-4 skeleton w-2/3" /></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20"><p className="text-muted text-lg">No posts found.</p></div>
          ) : (
            <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              {posts.map(post => (
                <motion.div key={post._id} variants={fadeInUp}>
                  <Link to={`/blog/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl transition-all h-full">
                    {post.featuredImage ? (
                      <img src={`/uploads/${post.featuredImage}`} alt={post.title} className="h-48 w-full object-cover" />
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <span className="text-4xl font-heading font-bold text-primary/20">{post.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="p-6">
                      <span className="inline-block text-xs font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-3">{catLabels[post.category] || post.category}</span>
                      <h3 className="text-lg font-heading font-bold text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{post.author}</span>
                        <div className="flex items-center gap-1"><HiClock className="w-3 h-3" />{post.readTime} min read</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${pagination.page === i + 1 ? 'bg-primary text-white' : 'bg-light text-muted hover:bg-primary/5'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
