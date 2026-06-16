import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import api from '../../api';

export default function BlogManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog');
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const catLabels = { 'loan-tips': 'Loan Tips', 'credit-score': 'Credit Score', 'business-financing': 'Business Financing', 'market-updates': 'Market Updates', 'first-time-borrowers': 'First-Time Borrowers' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark">Blog Posts</h2>
        <Link to="/admin/blog/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">
          <HiPlus className="w-4 h-4" /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-muted">Title</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Category</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Author</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Status</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Date</th>
              <th className="px-6 py-3 text-left font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => <tr key={i} className="border-b">{[...Array(6)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 skeleton w-20" /></td>)}</tr>)
            ) : posts.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-10 text-center text-muted">No blog posts yet. Create your first one!</td></tr>
            ) : (
              posts.map(post => (
                <tr key={post._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-dark max-w-xs truncate">{post.title}</td>
                  <td className="px-6 py-4 text-muted">{catLabels[post.category] || post.category}</td>
                  <td className="px-6 py-4 text-muted">{post.author}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{new Date(post.createdAt).toLocaleDateString('en-US')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/blog/edit/${post._id}`} className="p-2 text-primary hover:bg-primary/5 rounded-lg"><HiPencil className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(post._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
