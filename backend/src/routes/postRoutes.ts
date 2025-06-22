import { Router } from 'express';
import * as postController from '../controllers/postController';
// import { authMiddleware } from '../middleware/auth'; // 未来需要登录的接口会用到

const router = Router();

// 定义一个公开的路由，用于获取游客可见的动态
// 它会调用我们刚刚在 postController 中创建的 getPublicPosts 函数
// 注意：这个路由前面没有加 authMiddleware，所以不需要登录即可访问
router.get('/public', postController.getPublicPosts);


// 未来您可以像下面这样添加需要登录才能访问的路由
// router.post('/', authMiddleware, postController.createPost);
// router.post('/:id/like', authMiddleware, postController.likePost);


export default router;