import express from 'express';
import { signup, login, logout, getMe, googleLogin } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

export default router;