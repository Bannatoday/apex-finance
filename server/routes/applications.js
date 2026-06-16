const express = require('express');
const router = express.Router();
const appController = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const { applicationUpload } = require('../middleware/upload');
const { applicationLimiter } = require('../middleware/rateLimiter');

// Public routes
router.post('/submit', applicationLimiter, applicationUpload, appController.submitApplication);
router.post('/track', appController.trackApplication);
router.post('/upload-documents', applicationUpload, appController.uploadDocuments);

// Admin routes
router.get('/', auth, appController.getApplications);
router.get('/stats', auth, appController.getDashboardStats);
router.get('/export', auth, appController.exportCSV);
router.get('/:id', auth, appController.getApplication);
router.put('/:id/status', auth, appController.updateStatus);

module.exports = router;
