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
    const { studentId, username, nickname, email, password, bio, interests } = req.body;

    console.log('接收到注册请求:', {
      studentId,
      username,
      nickname,
      email,
      bio,
      interests,
      password: '***'
    });

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

    // 添加可选字段（不包括头像）
    if (nickname) userData.nickname = nickname;
    if (bio) userData.bio = bio;
    if (interests && Array.isArray(interests)) userData.interests = interests;

    console.log('创建用户数据:', {
      ...userData,
      password: '***'
    });

    const user = await User.create(userData);
    console.log('用户创建成功:', {
      id: user.id,
      studentId: user.studentId,
      username: user.username,
      nickname: user.nickname
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role,
        createdAt: user.createdAt
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
      message: '登录成功',
      token,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt
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
    const user = await User.findById(req.user!._id).select('-password');
    
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
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
    const { username, nickname, bio, interests } = req.body;
    const updateData: Record<string, unknown> = {};

    // 字段更新（不包括头像）
    if (username !== undefined) updateData.username = username;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (bio !== undefined) updateData.bio = bio;
    if (interests !== undefined && Array.isArray(interests)) updateData.interests = interests;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    res.json({
      success: true,
      message: '更新成功',
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}; 