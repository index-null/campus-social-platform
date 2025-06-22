import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getStats,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword
} from '../controllers/adminController';

const router = express.Router();

// 所有管理员路由都需要认证
router.use(authenticate);

// 获取统计数据
router.get('/stats', getStats);

// 用户管理
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/password', resetUserPassword);

export default router; 