const BlogPost = require('../models/BlogPost');
const slugify = require('slugify');

// Get all published posts (public)
exports.getPublicPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;

    const filter = { status: 'published' };
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort('-publishedAt')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-content');

    res.json({
      posts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get public posts error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single post by slug (public)
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Get related posts
    const relatedPosts = await BlogPost.find({
      _id: { $ne: post._id },
      status: 'published',
      category: post.category
    })
      .sort('-publishedAt')
      .limit(3)
      .select('-content');

    res.json({ post, relatedPosts });
  } catch (error) {
    console.error('Get post by slug error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all posts (admin)
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await BlogPost.countDocuments();
    const posts = await BlogPost.find()
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      posts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create post (admin)
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, author, status, seo } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = await BlogPost.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A post with this title already exists.' });
    }

    const post = new BlogPost({
      title,
      slug,
      content,
      excerpt,
      category,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [],
      author: author || 'Apex Finance Team',
      status: status || 'draft',
      featuredImage: req.file ? req.file.filename : '',
      seo: seo ? (typeof seo === 'string' ? JSON.parse(seo) : seo) : {}
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully.', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update post (admin)
exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    const { title, content, excerpt, category, tags, author, status, seo } = req.body;

    if (title && title !== post.title) {
      post.title = title;
      post.slug = slugify(title, { lower: true, strict: true });
    }
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (category) post.category = category;
    if (tags) post.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    if (author) post.author = author;
    if (status) post.status = status;
    if (seo) post.seo = typeof seo === 'string' ? JSON.parse(seo) : seo;
    if (req.file) post.featuredImage = req.file.filename;

    await post.save();
    res.json({ message: 'Post updated successfully.', post });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete post (admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get recent posts (for homepage)
exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' })
      .sort('-publishedAt')
      .limit(3)
      .select('-content');
    res.json(posts);
  } catch (error) {
    console.error('Get recent posts error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
