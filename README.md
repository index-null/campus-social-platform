# 校园社交平台

基于 Vue 3 和 Node.js 的全栈校园社交平台。

## 技术栈

- **前端**: Vue 3 + Vite + TypeScript + Tailwind CSS + Pinia
- **后端**: Node.js + Express + TypeScript + MongoDB
- **认证**: JWT
- **部署**: Docker

## 快速开始

### 环境要求
- Node.js >= 18
- MongoDB >= 6.0
- npm 或 yarn

### 安装依赖

\`\`\`bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
\`\`\`

### 环境配置

在 `backend` 目录创建 `.env` 文件：

\`\`\`env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/campus-social
JWT_SECRET=your-secret-key
\`\`\`

### 启动项目

\`\`\`bash
# 启动后端
cd backend
npm run dev

# 启动前端（新终端）
cd frontend
npm run dev
\`\`\`

访问 http://localhost:5173

## 功能特性

- [x] 用户注册/登录（学号认证）
- [x] JWT身份验证
- [ ] 动态发布
- [ ] 社交互动
- [ ] 管理员系统 