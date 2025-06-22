<template>
  <div class="register-container">
    <a-row class="register-wrapper" :gutter="0">
      <!-- 左侧介绍 -->
      <a-col :xs="0" :sm="0" :md="12" :lg="14" class="banner-section">
        <div class="banner-content">
          <div class="banner-overlay">
            <h1 class="banner-title" v-motion-slide-left>
              加入校园社交平台
            </h1>
            <p class="banner-subtitle" v-motion-slide-left :delay="100">
              发现精彩校园生活，连接志同道合的朋友
            </p>
            <div class="features" v-motion-fade-in :delay="200">
              <div class="feature-item" v-for="(feature, index) in features" :key="index">
                <component :is="feature.icon" :size="24" />
                <span>{{ feature.text }}</span>
              </div>
            </div>
          </div>
          <img 
            :src="getImageByScene('校园生活').urls.regular" 
            alt="Campus Life" 
            class="banner-image"
          />
        </div>
      </a-col>

      <!-- 右侧注册表单 -->
      <a-col :xs="24" :sm="24" :md="12" :lg="10" class="form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <div class="logo-section" v-motion-pop>
              <icon-apps-add :size="48" />
            </div>
            <a-typography-title :heading="3" style="margin: 16px 0">
              创建账号
            </a-typography-title>
            <a-typography-text type="secondary">
              已有账号？
              <a-link @click="() => router.push('/login')">立即登录</a-link>
            </a-typography-text>
          </div>

          <!-- 步骤导航 -->
          <div class="steps-container">
            <a-steps :current="currentStep - 1" size="small">
              <a-step title="基本信息" />
              <a-step title="个人资料" />
              <a-step title="兴趣标签" />
            </a-steps>
          </div>

          <a-form
            ref="formRef"
            :model="form"
            :rules="rules"
            layout="vertical"
            class="register-form"
          >
            <!-- 第一步：基本信息 -->
            <div v-show="currentStep === 1" class="step-content">
              <a-form-item field="studentId" label="学号">
                <a-input
                  v-model="form.studentId"
                  placeholder="请输入学号"
                  size="large"
                  allow-clear
                >
                  <template #prefix>
                    <icon-idcard />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item field="username" label="用户名">
                <a-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  size="large"
                  allow-clear
                >
                  <template #prefix>
                    <icon-user />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item field="email" label="邮箱">
                <a-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                  size="large"
                  allow-clear
                >
                  <template #prefix>
                    <icon-email />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item field="password" label="密码">
                <a-input-password
                  v-model="form.password"
                  placeholder="请输入密码"
                  size="large"
                  allow-clear
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>

              <a-form-item field="confirmPassword" label="确认密码">
                <a-input-password
                  v-model="form.confirmPassword"
                  placeholder="请再次输入密码"
                  size="large"
                  allow-clear
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
            </div>

            <!-- 第二步：个人资料 -->
            <div v-show="currentStep === 2" class="step-content">
              <a-form-item field="nickname" label="昵称">
                <a-input
                  v-model="form.nickname"
                  placeholder="请输入昵称（可选）"
                  size="large"
                  allow-clear
                >
                  <template #prefix>
                    <icon-star />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item field="avatar" label="头像">
                <div class="avatar-upload-container">
                  <a-upload
                    ref="avatarUpload"
                    accept="image/*"
                    :show-file-list="false"
                    :auto-upload="false"
                    :before-upload="handleAvatarUpload"
                  >
                    <div class="avatar-upload" v-if="!form.avatar">
                      <icon-plus :size="20" />
                      <div class="upload-text">上传头像</div>
                    </div>
                    <img v-else :src="form.avatar" class="avatar-preview" alt="头像预览" />
                  </a-upload>
                  <a-typography-text type="secondary" class="upload-tip">
                    建议尺寸：200x200，支持JPG、PNG格式
                  </a-typography-text>
                </div>
              </a-form-item>

              <a-form-item field="bio" label="个人简介">
                <a-textarea
                  v-model="form.bio"
                  placeholder="介绍一下你自己吧~（可选）"
                  :max-length="200"
                  show-word-limit
                  :auto-size="{ minRows: 3, maxRows: 4 }"
                />
              </a-form-item>
            </div>

            <!-- 第三步：兴趣标签 -->
            <div v-show="currentStep === 3" class="step-content">
              <a-form-item field="interests" label="兴趣标签">
                <div class="interests-container">
                  <a-typography-text type="secondary" class="interests-tip">
                    选择您感兴趣的标签（可选）
                  </a-typography-text>
                  <div class="interests-grid">
                    <a-tag
                      v-for="interest in interestOptions"
                      :key="interest"
                      :checkable="true"
                      :checked="form.interests.includes(interest)"
                      @check="(checked: boolean) => toggleInterest(interest, checked)"
                      class="interest-tag"
                    >
                      {{ interest }}
                    </a-tag>
                  </div>
                </div>
              </a-form-item>

              <a-form-item field="agreement">
                <a-checkbox v-model="form.agreement">
                  我已阅读并同意
                  <a-link>用户协议</a-link>
                  和
                  <a-link>隐私政策</a-link>
                </a-checkbox>
              </a-form-item>
            </div>

            <!-- 步骤导航按钮 -->
            <div class="step-actions">
              <a-space fill :size="16">
                <a-button 
                  v-if="currentStep > 1"
                  size="large" 
                  @click="prevStep"
                >
                  上一步
                </a-button>
                <a-button 
                  v-if="currentStep < totalSteps"
                  type="primary"
                  size="large"
                  @click="nextStep"
                >
                  下一步
                </a-button>
                <a-button
                  v-if="currentStep === totalSteps"
                  type="primary"
                  size="large"
                  :loading="loading"
                  @click="handleSubmit"
                >
                  完成注册
                </a-button>
              </a-space>
            </div>
          </a-form>

          <!-- 第三方登录 -->
          <a-divider orientation="center">
            <a-typography-text type="secondary">或使用其他方式</a-typography-text>
          </a-divider>
          
          <a-space fill :size="16" direction="vertical">
            <a-button size="large" long>
              <template #icon>
                <icon-wechat />
              </template>
              微信快速登录
            </a-button>
          </a-space>
        </div>
      </a-col>
    </a-row>

    <!-- 主题切换按钮 -->
    <a-button
      class="theme-toggle"
      shape="circle"
      @click="toggleTheme"
    >
      <icon-moon v-if="!isDark" />
      <icon-sun v-else />
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
// import type { FormInstance } from '@arco-design/web-vue'
import { register } from '@/api/auth'
import { getImageByScene } from '@/config/images'

const router = useRouter()
const formRef = ref<any>()
const loading = ref(false)

// 分步注册状态
const currentStep = ref(1)
const totalSteps = 3

// 暗黑模式
const isDark = ref(document.body.hasAttribute('arco-theme'))
const toggleTheme = () => {
  if (isDark.value) {
    document.body.removeAttribute('arco-theme')
    isDark.value = false
  } else {
    document.body.setAttribute('arco-theme', 'dark')
    isDark.value = true
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 特性列表
const features = [
  { icon: 'icon-user-group', text: '连接校友' },
  { icon: 'icon-camera', text: '分享生活' },
  { icon: 'icon-fire', text: '发现活动' },
  { icon: 'icon-message', text: '即时交流' }
]

// 表单数据
const form = reactive({
  studentId: '',
  username: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar: '',
  bio: '',
  interests: [] as string[],
  agreement: false
})

// 预设兴趣标签
const interestOptions = [
  '学习', '运动', '音乐', '电影', '读书', '游戏', 
  '旅行', '摄影', '美食', '编程', '绘画', '舞蹈',
  '篮球', '足球', '羽毛球', '乒乓球', '游泳', '跑步',
  '动漫', '综艺', '科技', '时尚', '宠物', '手工'
]

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '请输入学号' },
    { match: /^\d{10}$/, message: '学号格式不正确' }
  ],
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, maxLength: 20, message: '用户名长度为3-20个字符' }
  ],
  nickname: [
    { maxLength: 30, message: '昵称不能超过30个字符' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' }
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码至少6位' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator: (value: any, callback: any) => {
        if (value !== form.password) {
          callback('两次输入的密码不一致')
        } else {
          callback()
        }
      }
    }
  ],
  bio: [
    { maxLength: 200, message: '个人简介不能超过200个字符' }
  ],
  agreement: [
    {
      validator: (value: any, callback: any) => {
        if (!value) {
          callback('请同意用户协议')
        } else {
          callback()
        }
      }
    }
  ]
}

// 头像上传
const avatarUpload = ref()
const handleAvatarUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false // 阻止默认上传行为
}

// 兴趣标签切换
const toggleInterest = (interest: string, checked: boolean) => {
  if (checked) {
    if (!form.interests.includes(interest)) {
      form.interests.push(interest)
    }
  } else {
    const index = form.interests.indexOf(interest)
    if (index > -1) {
      form.interests.splice(index, 1)
    }
  }
}

// 步骤切换
const nextStep = async () => {
  if (currentStep.value === 1) {
    // 第一步验证必填字段
    const valid = await formRef.value?.validateField(['studentId', 'username', 'email', 'password', 'confirmPassword'])
    if (valid) return
  }
  
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 提交注册
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return

  loading.value = true
  try {
    await register({
      studentId: form.studentId,
      username: form.username,
      nickname: form.nickname,
      email: form.email,
      password: form.password,
      avatar: form.avatar,
      bio: form.bio,
      interests: form.interests
    })
    Message.success('注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    Message.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

// 初始化主题
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('arco-theme', 'dark')
  isDark.value = true
}
</script>

<style scoped lang="less">
.register-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-bg-1);
}

.register-wrapper {
  width: 100%;
  height: 100%;
}

.banner-section {
  height: 100%;
  overflow: hidden;
  position: relative;

  .banner-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(30, 64, 175, 0.9));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 2rem;
  }

  .banner-title {
    font-size: 3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    animation-duration: 0.6s;
  }

  .banner-subtitle {
    font-size: 1.25rem;
    margin-bottom: 3rem;
    opacity: 0.95;
    animation-duration: 0.6s;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    animation-duration: 0.8s;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.1rem;
  }
}

.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--color-bg-1);
  overflow-y: auto;
}

.form-wrapper {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: inline-block;
  animation-duration: 0.5s;
}

.steps-container {
  margin-bottom: 2rem;
}

.register-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  :deep(.arco-form-item) {
    margin-bottom: 20px;
  }
}

.step-content {
  flex: 1;
  min-height: 0;
}

.step-actions {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-2);
  
  :deep(.arco-space) {
    width: 100%;
    justify-content: space-between;
  }
  
  :deep(.arco-btn) {
    flex: 1;
    max-width: 140px;
  }
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

// 新增样式
.avatar-upload-container {
  text-align: center;
}

.avatar-upload {
  width: 100px;
  height: 100px;
  border: 2px dashed var(--color-border-2);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;

  &:hover {
    border-color: var(--color-primary-6);
    background-color: var(--color-primary-1);
  }
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.upload-text {
  font-size: 12px;
  color: var(--color-text-3);
  margin-top: 4px;
}

.upload-tip {
  display: block;
  margin-top: 8px;
  font-size: 12px;
}

.interests-container {
  .interests-tip {
    display: block;
    margin-bottom: 12px;
  }
}

.interests-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.interest-tag {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

// 响应式
@media (max-width: 768px) {
  .form-wrapper {
    padding: 1.5rem;
    max-width: 100%;
  }

  .banner-section {
    display: none;
  }

  .steps-container {
    margin-bottom: 1.5rem;
  }

  .interests-grid {
    gap: 6px;
  }

  .interest-tag {
    font-size: 12px;
    padding: 4px 8px;
  }

  .step-actions {
    padding-top: 1rem;
    
    :deep(.arco-btn) {
      max-width: none;
    }
  }
}
</style>