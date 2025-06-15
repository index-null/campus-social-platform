import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-social');
    console.log(`✅ MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error);
    process.exit(1);
  }
};

// 监听连接事件
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB 连接断开');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB 连接错误:', err);
});

export default connectDB; 