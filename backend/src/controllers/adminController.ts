import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// 获取用户统计数据
export const getStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    // 获取统计数据
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // 今日新注册用户
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNewUsers = await User.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        todayNewUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户列表
export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const role = req.query.role as string;
    const status = req.query.status as string;

    // 构建查询条件
    const query: any = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { nickname: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // 执行查询
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 创建用户
export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    const { studentId, username, nickname, email, password, bio, interests, role, isActive } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ studentId }, { username }, { email }]
    });

    if (existingUser) {
      throw new AppError('学号、用户名或邮箱已被注册', 400);
    }

    // 创建用户数据
    const userData: any = {
      studentId,
      username,
      email,
      password,
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true
    };

    // 添加可选字段
    if (nickname) userData.nickname = nickname;
    if (bio) userData.bio = bio;
    if (interests && Array.isArray(interests)) userData.interests = interests;

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      user: {
        id: user.id,
        studentId: user.studentId,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        bio: user.bio,
        interests: user.interests,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    const { id } = req.params;
    const { username, nickname, email, bio, interests, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 检查用户名和邮箱是否被其他用户占用
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: id } });
      if (existingUser) {
        throw new AppError('用户名已被占用', 400);
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        throw new AppError('邮箱已被占用', 400);
      }
    }

    // 更新用户数据
    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (interests !== undefined) updateData.interests = interests;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: '用户更新成功',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// 删除用户
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 防止删除自己
    if (user.id === req.user!.id) {
      throw new AppError('不能删除自己的账号', 400);
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    next(error);
  }
};

// 切换用户状态
export const toggleUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 防止禁用自己
    if (user.id === req.user!.id) {
      throw new AppError('不能禁用自己的账号', 400);
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `用户已${user.isActive ? '启用' : '禁用'}`,
      user: {
        id: user.id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// 重置用户密码
export const resetUserPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 检查管理员权限
    if (req.user!.role !== 'admin') {
      throw new AppError('权限不足', 403);
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      throw new AppError('新密码至少6位', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: '密码重置成功'
    });
  } catch (error) {
    next(error);
  }
}; 