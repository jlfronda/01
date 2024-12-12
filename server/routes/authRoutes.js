import express from 'express'
import { login, signup, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/authController.js'
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth)
router.post('/LoginSignup', async (req, res) => {
    const { email, password, name } = req.body;
    if (name) {
      await signup(req, res);
    } else {
      await login(req, res);
    }
  });
  
router.post('/logout', logout);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router