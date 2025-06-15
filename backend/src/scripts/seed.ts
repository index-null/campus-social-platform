import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/User';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    
    // 清空现有数据
    await User.deleteMany({});
    
    // 创建管理员
    await User.create({
      studentId: '2024000001',
      username: 'admin',
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
      bio: '系统管理员',
      interests: ['管理', '技术']
    });
    
    // 创建测试用户
    await User.create({
      studentId: '2024000002',
      username: 'testuser',
      email: 'test@campus.edu',
      password: 'test123',
      bio: '我是一个测试用户',
      interests: ['编程', '音乐', '阅读']
    });
    
    console.log('✅ 种子数据创建成功');
    process.exit(0);
  } catch (error) {
    console.error('❌ 种子数据创建失败:', error);
    process.exit(1);
  }
};

seedUsers(); 