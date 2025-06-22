import dotenv from 'dotenv';
import connectDB from '../config/database';
import User from '../models/User';

dotenv.config();

// 定义演示用户数据
const demoUsers = [
  // 管理员账户
  {
    studentId: '2024888888',
    username: 'admin',
    nickname: '系统管理员',
    email: 'admin@szu.edu.cn',
    password: 'admin123',
    role: 'admin',
    bio: '深圳大学校园社交平台系统管理员，负责平台日常维护和用户管理。',
    interests: ['管理', '技术', '教育'],
    isActive: true
  },
  {
    studentId: '2024666666',
    username: 'moderator',
    nickname: '内容审核员',
    email: 'moderator@szu.edu.cn',
    password: 'mod123',
    role: 'admin',
    bio: '负责平台内容审核和社区管理，致力于营造良好的交流环境。',
    interests: ['管理', '心理学', '传媒'],
    isActive: true
  },

  // 计算机科学与软件学院学生
  {
    studentId: '2024110001',
    username: 'coderliu',
    nickname: '代码小刘',
    email: 'liu.coder@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '计算机科学与软件学院大三学生，热爱编程和开源项目，正在学习全栈开发。',
    interests: ['编程', '算法', '开源', '游戏', '科技'],
    isActive: true
  },
  {
    studentId: '2024110002',
    username: 'ai_zhang',
    nickname: '智能小张',
    email: 'zhang.ai@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '人工智能专业研一学生，专注机器学习和深度学习研究。',
    interests: ['人工智能', '机器学习', '数学', '科研', '阅读'],
    isActive: true
  },
  {
    studentId: '2024110003',
    username: 'frontend_wang',
    nickname: '前端小王',
    email: 'wang.frontend@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '软件工程专业大二学生，专注前端开发，喜欢设计和用户体验。',
    interests: ['前端开发', '设计', 'UI/UX', '摄影', '音乐'],
    isActive: true
  },

  // 管理学院学生
  {
    studentId: '2024210001',
    username: 'business_chen',
    nickname: '商业陈',
    email: 'chen.business@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '工商管理专业大四学生，对创业和商业模式很感兴趣，正在准备考研。',
    interests: ['创业', '商业', '管理', '投资', '读书'],
    isActive: true
  },
  {
    studentId: '2024210002',
    username: 'marketing_li',
    nickname: '营销小李',
    email: 'li.marketing@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '市场营销专业大三学生，热衷于数字营销和社交媒体运营。',
    interests: ['营销', '社交媒体', '品牌', '创意', '旅行'],
    isActive: true
  },

  // 文学院学生
  {
    studentId: '2024310001',
    username: 'writer_zhou',
    nickname: '文字工匠',
    email: 'zhou.writer@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '汉语言文学专业大二学生，热爱写作和文学创作，梦想成为作家。',
    interests: ['写作', '文学', '诗歌', '电影', '艺术'],
    isActive: true
  },
  {
    studentId: '2024310002',
    username: 'translator_wu',
    nickname: '翻译小吴',
    email: 'wu.translator@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '英语专业大三学生，对翻译和跨文化交流很感兴趣。',
    interests: ['翻译', '语言学', '文化', '国际交流', '阅读'],
    isActive: true
  },

  // 艺术设计学院学生
  {
    studentId: '2024410001',
    username: 'designer_xu',
    nickname: '设计师小徐',
    email: 'xu.designer@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '视觉传达设计专业大三学生，擅长品牌设计和插画创作。',
    interests: ['设计', '插画', '品牌', '美术', '摄影'],
    isActive: true
  },
  {
    studentId: '2024410002',
    username: 'artist_sun',
    nickname: '艺术家小孙',
    email: 'sun.artist@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '数字媒体艺术专业大二学生，热爱数字艺术创作和动画制作。',
    interests: ['数字艺术', '动画', '游戏设计', '音乐', '创意'],
    isActive: true
  },

  // 经济学院学生
  {
    studentId: '2024510001',
    username: 'economist_ma',
    nickname: '经济学马',
    email: 'ma.economist@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '经济学专业研二学生，专注宏观经济分析和金融市场研究。',
    interests: ['经济学', '金融', '投资', '数据分析', '研究'],
    isActive: true
  },
  {
    studentId: '2024510002',
    username: 'finance_qian',
    nickname: '金融小钱',
    email: 'qian.finance@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '金融学专业大四学生，对量化投资和金融科技很感兴趣。',
    interests: ['金融', '投资', '量化', '科技', '数学'],
    isActive: true
  },

  // 建筑与城市规划学院学生
  {
    studentId: '2024610001',
    username: 'architect_feng',
    nickname: '建筑师小冯',
    email: 'feng.architect@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '建筑学专业大五学生，对可持续建筑设计和城市规划很感兴趣。',
    interests: ['建筑', '设计', '城市规划', '环保', '艺术'],
    isActive: true
  },

  // 医学院学生
  {
    studentId: '2024710001',
    username: 'medstudent_hua',
    nickname: '医学生小华',
    email: 'hua.med@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '临床医学专业大三学生，立志成为一名优秀的医生，救死扶伤。',
    interests: ['医学', '生物', '健康', '科研', '运动'],
    isActive: true
  },

  // 体育学院学生
  {
    studentId: '2024810001',
    username: 'athlete_lin',
    nickname: '运动员小林',
    email: 'lin.athlete@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '体育教育专业大二学生，篮球校队成员，热爱运动和健身。',
    interests: ['篮球', '健身', '体育', '教育', '团队合作'],
    isActive: true
  },

  // 生命与海洋科学学院学生
  {
    studentId: '2024910001',
    username: 'biologist_he',
    nickname: '生物学家小何',
    email: 'he.bio@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '生物科学专业研一学生，专注分子生物学和遗传学研究。',
    interests: ['生物学', '科研', '遗传学', '环保', '自然'],
    isActive: true
  },

  // 化学与环境工程学院学生
  {
    studentId: '2024020001',
    username: 'chemist_gao',
    nickname: '化学家小高',
    email: 'gao.chem@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '化学专业大四学生，对有机合成和材料化学很感兴趣。',
    interests: ['化学', '材料科学', '实验', '科研', '环保'],
    isActive: true
  },

  // 一些不太活跃的用户
  {
    studentId: '2024000001',
    username: 'inactive_user1',
    nickname: '潜水员1号',
    email: 'inactive1@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '比较内向的学生，喜欢默默浏览但不太发言。',
    interests: ['阅读', '音乐'],
    isActive: false
  },
  {
    studentId: '2024000002',
    username: 'inactive_user2',
    nickname: '潜水员2号',
    email: 'inactive2@email.szu.edu.cn',
    password: 'pass123',
    role: 'user',
    bio: '暂时休学的学生账户。',
    interests: ['旅行'],
    isActive: false
  }
];

const seedDemoUsers = async () => {
  try {
    console.log('🌱 开始生成演示用户数据...');
    
    // 连接数据库
    await connectDB();
    console.log('✅ 数据库连接成功');
    
    // 清空现有用户数据（谨慎操作）
    const userCount = await User.countDocuments();
    console.log(`📊 当前数据库中有 ${userCount} 个用户`);
    
    if (userCount > 0) {
      console.log('⚠️  警告：数据库中已有用户数据');
      console.log('如需清空现有数据，请取消注释下面的代码行');
      // await User.deleteMany({});
      // console.log('🗑️  已清空现有用户数据');
    }
    
    // 批量创建用户
    console.log(`👥 准备创建 ${demoUsers.length} 个演示用户...`);
    
    for (let i = 0; i < demoUsers.length; i++) {
      const userData = demoUsers[i];
      try {
        // 检查用户是否已存在
        const existingUser = await User.findOne({
          $or: [
            { studentId: userData.studentId },
            { username: userData.username },
            { email: userData.email }
          ]
        });
        
        if (existingUser) {
          console.log(`⚠️  用户 ${userData.username} 已存在，跳过创建`);
          continue;
        }
        
        // 设置随机的最后活跃时间（最近30天内）
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const lastActiveAt = new Date();
        lastActiveAt.setDate(lastActiveAt.getDate() - randomDaysAgo);
        
        await User.create({
          ...userData,
          lastActiveAt
        });
        
        console.log(`✅ 创建用户: ${userData.username} (${userData.nickname})`);
      } catch (error: any) {
        console.error(`❌ 创建用户 ${userData.username} 失败:`, error.message);
      }
    }
    
    // 统计结果
    const finalUserCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const activeCount = await User.countDocuments({ isActive: true });
    
    console.log('\n📈 生成结果统计:');
    console.log(`👥 总用户数: ${finalUserCount}`);
    console.log(`👑 管理员数: ${adminCount}`);
    console.log(`🟢 活跃用户数: ${activeCount}`);
    console.log(`🔴 非活跃用户数: ${finalUserCount - activeCount}`);
    
    console.log('\n🎉 演示用户数据生成完成！');
    console.log('\n📝 测试账户信息:');
    console.log('管理员账户: admin / admin123');
    console.log('管理员账户: moderator / mod123');
    console.log('普通用户: coderliu / pass123');
    console.log('普通用户: designer_xu / pass123');
    console.log('等等...');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 生成演示用户数据失败:', error);
    process.exit(1);
  }
};

// 如果直接运行此文件，则执行种子数据生成
if (require.main === module) {
  seedDemoUsers();
}

export default seedDemoUsers; 