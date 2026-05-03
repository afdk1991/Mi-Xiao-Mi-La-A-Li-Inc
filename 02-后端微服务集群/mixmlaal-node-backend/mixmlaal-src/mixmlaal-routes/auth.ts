import { Router } from 'express';
import {
  sendCode,
  register,
  login,
  thirdPartyLogin,
  getThirdPartyUrl,
  logout,
  bindPhone,
  bindEmail,
  resetPassword,
  getProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/send-code', sendCode);
router.post('/register', register);
router.post('/login', login);
router.post('/third-party-login', thirdPartyLogin);
router.get('/third-party-url', getThirdPartyUrl);
router.post('/logout', logout);
router.post('/bind-phone', authenticateToken, bindPhone);
router.post('/bind-email', authenticateToken, bindEmail);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getProfile);

export default router;
