const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { blogImageUpload } = require('../middleware/upload');

// Public routes
router.get('/public', blogController.getPublicPosts);
router.get('/recent', blogController.getRecentPosts);
router.get('/public/:slug', blogController.getPostBySlug);

// Admin routes
router.get('/', auth, blogController.getAllPosts);
router.post('/', auth, blogImageUpload, blogController.createPost);
router.put('/:id', auth, blogImageUpload, blogController.updatePost);
router.delete('/:id', auth, blogController.deletePost);

module.exports = router;
