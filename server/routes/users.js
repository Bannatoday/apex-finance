const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const { applicationUpload } = require('../middleware/upload');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (requires user login)
router.get('/me', userAuth, userController.getMe);
router.get('/applications', userAuth, userController.getMyApplications);
router.post('/applications/:applicationId/documents', userAuth, applicationUpload, userController.uploadDocuments);

module.exports = router;
