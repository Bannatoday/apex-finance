import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiPhotograph, HiX } from 'react-icons/hi';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../api';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: 'loan-tips',
    tags: '', author: 'Apex Finance Team', status: 'draft',
    metaTitle: '', metaDescription: ''
  });

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const res = await api.get('/blog');
          const post = res.data.posts.find(p => p._id === id);
          if (post) {
            setForm({
              title: post.title, content: post.content, excerpt: post.excerpt,
              category: post.category, tags: post.tags?.join(', ') || '',
              author: post.author, status: post.status,
              metaTitle: post.seo?.metaTitle || '', metaDescription: post.seo?.metaDescription || ''
            });
            if (post.featuredImage) {
              setImagePreview(`/uploads/${post.featuredImage}`);
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchPost();
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WebP images are allowed.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Use FormData for multipart upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('excerpt', form.excerpt);
      formData.append('category', form.category);
      formData.append('tags', form.tags);
      formData.append('author', form.author);
      formData.append('status', form.status);
      formData.append('seo', JSON.stringify({ metaTitle: form.metaTitle, metaDescription: form.metaDescription }));

      if (imageFile) {
        formData.append('featuredImage', imageFile);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (isEdit) {
        await api.put(`/blog/${id}`, formData, config);
      } else {
        await api.post('/blog', formData, config);
      }
      navigate('/admin/blog');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'link', 'image'],
      ['clean']
    ]
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/blog')} className="flex items-center gap-2 text-sm text-muted hover:text-primary mb-6"><HiArrowLeft className="w-4 h-4" /> Back to Blog</button>
      <h2 className="text-2xl font-heading font-bold text-dark mb-6">{isEdit ? 'Edit Post' : 'New Blog Post'}</h2>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-dark mb-2">Title</label>
              <input required className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Post title" />
            </div>

            {/* Featured Image Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-dark mb-3">Featured Image / Thumbnail</label>
              
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-xl border border-gray-200" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-muted mt-2">Hover over image and click ✕ to remove</p>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-56 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <HiPhotograph className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-muted">Click to upload featured image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP • Max 5MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-dark mb-2">Content</label>
              <ReactQuill theme="snow" value={form.content} onChange={(val) => setForm(f => ({ ...f, content: val }))} modules={quillModules} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-medium text-dark mb-2">Excerpt</label>
              <textarea required rows="3" maxLength="300" className={inputClass} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Brief summary (max 300 chars)" />
              <p className="text-xs text-muted mt-1">{form.excerpt.length}/300</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-dark mb-4">Publish</h3>
              <select className={inputClass + ' mb-4'} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button type="submit" disabled={saving} className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50">
                {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-dark">Details</h3>
              <div><label className="block text-xs font-medium text-muted mb-1">Category</label>
                <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="loan-tips">Loan Tips</option>
                  <option value="credit-score">Credit Score</option>
                  <option value="business-financing">Business Financing</option>
                  <option value="market-updates">Market Updates</option>
                  <option value="first-time-borrowers">First-Time Borrowers</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-muted mb-1">Tags (comma separated)</label><input className={inputClass} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g., loans, tips" /></div>
              <div><label className="block text-xs font-medium text-muted mb-1">Author</label><input className={inputClass} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} /></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="font-semibold text-dark">SEO</h3>
              <div><label className="block text-xs font-medium text-muted mb-1">Meta Title</label><input className={inputClass} value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} placeholder="SEO title" /></div>
              <div><label className="block text-xs font-medium text-muted mb-1">Meta Description</label><textarea rows="2" className={inputClass} value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} placeholder="SEO description" /></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
