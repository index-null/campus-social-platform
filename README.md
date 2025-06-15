
# 🎓 校园社交平台 Campus Social Platform

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-brightgreen.svg" alt="Vue 3">
  <img src="https://img.shields.io/badge/Node.js-18.x-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg" alt="MongoDB">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</p>

一个现代化的校园社交平台，为大学生提供交流、分享和互动的空间。参考微博、小红书等主流社交平台设计，专注于校园生活场景。

## ✨ 功能特性

### 核心功能
- 🔐 **用户系统** - 学号注册、JWT认证、个人资料管理
- 📝 **动态发布** - 图文动态、话题标签、可见范围设置
- 💬 **社交互动** - 点赞评论、关注系统、动态流切换
- 👤 **个人主页** - 个人信息展示、动态列表、粉丝关注
- 🛡️ **管理系统** - 用户管理、内容审核、数据统计

### 进阶功能
- 🌙 **暗黑模式** - 支持明暗主题切换
- 🔍 **搜索功能** - 用户搜索、内容搜索
- 📊 **推荐系统** - 基于兴趣标签的内容推荐
- 📱 **响应式设计** - 完美适配移动端

## 🛠️ 技术栈

### 前端技术
- **框架**: Vue 3.4 + TypeScript 5.x
- **构建工具**: Vite 5.x
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI框架**: Tailwind CSS 3.x
- **HTTP客户端**: Axios
- **图标**: Heroicons

### 后端技术
- **运行环境**: Node.js 18.x
- **Web框架**: Express 4.x + TypeScript
- **数据库**: MongoDB 6.x + Mongoose
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **文件上传**: Multer
- **API文档**: Swagger (计划中)

### 开发工具
- **代码规范**: ESLint + Prettier
- **版本控制**: Git
- **包管理**: npm
- **容器化**: Docker + Docker Compose

## 📁 项目结构

```
campus-social-platform/
├── frontend/                    # 前端项目
│   ├── public/                 # 静态资源
│   ├── src/
│   │   ├── api/               # API 接口封装
│   │   ├── assets/            # 图片、字体等资源
│   │   ├── components/        # 通用组件
│   │   ├── composables/       # 组合式函数
│   │   ├── layouts/           # 布局组件
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── utils/             # 工具函数
│   │   ├── views/             # 页面组件
│   │   ├── App.vue            # 根组件
│   │   └── main.ts            # 应用入口
│   └── package.json
│
├── backend/                     # 后端项目
│   ├── uploads/                # 上传文件目录
│   ├── src/
│   │   ├── config/            # 配置文件
│   │   ├── controllers/       # 控制器
│   │   ├── middleware/        # 中间件
│   │   ├── models/            # 数据模型
│   │   ├── routes/            # 路由定义
│   │   ├── services/          # 业务服务
│   │   ├── types/             # TypeScript 类型
│   │   ├── utils/             # 工具函数
│   │   ├── validators/        # 数据验证
│   │   └── server.ts          # 服务器入口
│   └── package.json
│
├── docker-compose.yml           # Docker 编排配置
├── .gitignore                  # Git 忽略配置
├── .env.example                # 环境变量示例
└── README.md                   # 项目说明文档
```

## 🚀 快速开始

### 环境要求

确保你的开发环境满足以下要求：

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 6.0.0
- **Git**

### 1. 克隆项目

```bash
git clone https://github.com/your-username/campus-social-platform.git
cd campus-social-platform
```

### 2. 安装 MongoDB

#### macOS (使用 Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows
从 [MongoDB官网](https://www.mongodb.com/try/download/community) 下载安装包

#### Linux (Ubuntu)
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3. 后端配置

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env

# 编辑 .env 文件，设置你的配置
# 默认配置如下：
# NODE_ENV=development
# PORT=5001
# MONGODB_URI=mongodb://localhost:27017/campus-social
# JWT_SECRET=your-super-secret-jwt-key-please-change-in-production
# CORS_ORIGIN=http://localhost:5173

# 创建上传目录
mkdir -p uploads/{avatars,posts}

# 运行数据库种子（创建测试数据）
npm run seed

# 启动开发服务器
npm run dev
```

### 4. 前端配置

```bash
# 新开一个终端，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 5. 访问应用

打开浏览器访问 http://localhost:5173

**测试账号：**
- 管理员：学号 `2024000001`，密码 `admin123`
- 普通用户：学号 `2024000002`，密码 `test123`

## 📡 API 文档

### 认证相关

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/profile` | 获取个人信息 | ✅ |
| PUT | `/api/auth/profile` | 更新个人信息 | ✅ |

### 请求示例

**注册新用户**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024000003",
    "username": "新用户",
    "email": "newuser@campus.edu",
    "password": "password123"
  }'
```

**用户登录**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "2024000001",
    "password": "admin123"
  }'
```

## 🐳 Docker 部署

使用 Docker Compose 一键部署：

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📝 开发指南

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

### 分支管理

- `main` - 主分支，保持稳定
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支

### 提交规范

```bash
feat: 添加用户关注功能
fix: 修复登录状态失效问题
docs: 更新 README 文档
style: 格式化代码
refactor: 重构认证模块
test: 添加单元测试
chore: 更新依赖版本
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📋 待办事项

- [ ] 完善动态发布功能
- [ ] 实现图片上传
- [ ] 添加评论系统
- [ ] 实现关注功能
- [ ] 添加搜索功能
- [ ] 优化推荐算法
- [ ] 添加单元测试
- [ ] 完善 API 文档
- [ ] 添加 CI/CD 流程

## 🐛 问题反馈

如果你发现了 bug 或者有功能建议，欢迎[创建 Issue](https://github.com/your-username/campus-social-platform/issues)

## 📄 开源协议

本项目采用 [MIT](LICENSE) 开源协议

