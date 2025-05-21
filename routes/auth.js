const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getMe, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const { 
  loginLimiter, 
  forgotPasswordLimiter, 
  registerLimiter 
} = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPasswordLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
