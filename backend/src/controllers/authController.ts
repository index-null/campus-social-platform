import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// 生成JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId, username, nickname, email, password, avatar, bio, interests } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ studentId }, { username }, { email }]
    });

    if (existingUser) {
      throw new AppError('学号、用户名或邮箱已被注册', 400);
    }

    // 创建新用户
    const userData: any = {
      studentId,
      username,
      email,
      password
    };

    // 添加可选字段
    if (nickname) userData.nickname = nickname;
    if (avatar) userData.avatar = avatar;
    if (bio) userData.bio = bio;
    if (interests && Array.isArray(interests)) userData.interests = interests;

    const user = await User.create(userData);

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        interests: user.interests,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId, password } = req.body;

    // 查找用户
    const user = await User.findOne({ studentId });
    if (!user) {
      throw new AppError('学号或密码错误', 401);
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('学号或密码错误', 401);
    }

    // 检查账号状态
    if (!user.isActive) {
      throw new AppError('账号已被封禁', 403);
    }

    // 更新最后活跃时间
    user.lastActiveAt = new Date();
    await user.save();

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        interests: user.interests
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updates = ['username', 'nickname', 'bio', 'interests', 'avatar'];
    const updateData: Record<string, unknown> = {};

    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
}; 