import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validation';

const router = Router();

// 公开路由
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// 需要认证的路由
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router; 