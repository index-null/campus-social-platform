import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post'; // 导入您之前创建的Post模型
import { AppError } from '../middleware/errorHandler'; // 导入您自定义的错误类型

/**
 * @description 获取所有公开的动态，提供给游客浏览
 */
export const getPublicPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 查找所有 visibility 字段为 'public' 的动态
    const posts = await Post.find({ visibility: 'public', isDeleted: false })
      .populate('author', 'username avatar') // 关联查询，获取作者的用户名和头像
      .sort({ createdAt: -1 }) // 按创建时间倒序排序
      .limit(20); // 限制一次最多返回20条

    res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    // 如果发生错误，则传递给错误处理中间件
    next(error);
  }
};

// 未来您可以在这里添加其他与动态相关的控制器函数
// 比如 createPost, likePost, addComment 等