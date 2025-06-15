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

          <a-form
            ref="formRef"
            :model="form"
            :rules="rules"
            layout="vertical"
            @submit="handleSubmit"
            class="register-form"
          >
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

            <a-form-item field="agreement">
              <a-checkbox v-model="form.agreement">
                我已阅读并同意
                <a-link>用户协议</a-link>
                和
                <a-link>隐私政策</a-link>
              </a-checkbox>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                long
                :loading="loading"
              >
                注册
              </a-button>
            </a-form-item>
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
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

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

// 提交注册
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return

  loading.value = true
  try {
    await register({
      studentId: form.studentId,
      username: form.username,
      email: form.email,
      password: form.password
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
  max-width: 400px;
  padding: 2rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  display: inline-block;
  animation-duration: 0.5s;
}

.register-form {
  :deep(.arco-form-item) {
    margin-bottom: 20px;
  }
}

.theme-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

// 响应式
@media (max-width: 768px) {
  .form-wrapper {
    padding: 1.5rem;
  }

  .banner-section {
    display: none;
  }
}
</style>