const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, authController.login);
router.get('/verify', auth, authController.verifyToken);
router.put('/change-password', auth, authController.changePassword);

module.exports = router;
