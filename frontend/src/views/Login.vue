<template>
  <div class="login-container" v-motion-fade-in>
    <a-row class="login-wrapper" :gutter="0">
      <!-- 左侧图片 -->
      <a-col :xs="0" :sm="12" class="login-banner">
        <div 
          class="banner-image"
          :style="{ backgroundImage: `url(${bannerImage})` }"
          v-motion-slide-left
        >
          <div class="banner-overlay">
            <h1 class="banner-title" v-motion-fade-in-up>欢迎来到</h1>
            <h2 class="banner-subtitle" v-motion-fade-in-up>校园社交平台</h2>
            <p class="banner-desc" v-motion-fade-in-up>
              连接校园生活，分享精彩瞬间
            </p>
          </div>
        </div>
      </a-col>

      <!-- 右侧登录表单 -->
      <a-col :xs="24" :sm="12" class="login-form-wrapper">
        <div class="login-form" v-motion-slide-right>
          <div class="form-header">
            <h2 class="form-title">登录账号</h2>
            <p class="form-subtitle">
              还没有账号？
              <a-link @click="() => router.push('/register')">立即注册</a-link>
            </p>
          </div>

          <a-form
            :model="form"
            @submit="handleSubmit"
            layout="vertical"
            size="large"
          >
            <a-form-item
              field="studentId"
              label="学号"
              :rules="[
                { required: true, message: '请输入学号' },
                { match: /^\d{10}$/, message: '学号必须是10位数字' }
              ]"
            >
              <a-input
                v-model="form.studentId"
                placeholder="请输入10位学号"
                allow-clear
              >
                <template #prefix>
                  <icon-user />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item
              field="password"
              label="密码"
              :rules="[
                { required: true, message: '请输入密码' },
                { minLength: 6, message: '密码长度至少6位' }
              ]"
            >
              <a-input-password
                v-model="form.password"
                placeholder="请输入密码"
                allow-clear
              >
                <template #prefix>
                  <icon-lock />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-row justify="space-between" align="center">
                <a-checkbox v-model="form.remember">记住我</a-checkbox>
                <a-link @click="handleForgotPassword">忘记密码？</a-link>
              </a-row>
            </a-form-item>

            <a-form-item>
              <a-button
                type="primary"
                html-type="submit"
                long
                :loading="loading"
              >
                {{ loading ? '登录中...' : '登 录' }}
              </a-button>
            </a-form-item>
          </a-form>

          <!-- 快捷登录 -->
          <a-divider>快捷登录</a-divider>
          <a-space class="quick-login" :size="24">
            <a-tooltip content="微信登录">
              <a-button shape="circle" size="large">
                <icon-wechat />
              </a-button>
            </a-tooltip>
            <a-tooltip content="QQ登录">
              <a-button shape="circle" size="large">
                <icon-qq />
              </a-button>
            </a-tooltip>
            <a-tooltip content="Github登录">
              <a-button shape="circle" size="large">
                <icon-github />
              </a-button>
            </a-tooltip>
          </a-space>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { getImageByScene } from '@/config/images'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 获取登录页面图片 - 修复类型
const bannerImage = ref<string>('')
onMounted(() => {
  const img = getImageByScene('登录页面')
  bannerImage.value = img.urls.regular
})

// 表单数据
const form = reactive({
  studentId: '',
  password: '',
  remember: false
})

const loading = ref(false)

// 提交登录
const handleSubmit = async ({ values, errors }: any) => {
  if (errors) return
  
  loading.value = true
  
  try {
    await userStore.login({
      studentId: values.studentId,
      password: values.password,
      remember: values.remember
    })
    
    Message.success('登录成功')
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
  } catch (error: any) {
    Message.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  Message.info('请联系管理员重置密码')
}
</script>

<style scoped lang="less">
.login-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.login-wrapper {
  width: 100%;
  height: 100%;
  background: var(--color-bg-1);
}

.login-banner {
  position: relative;
  overflow: hidden;

  .banner-image {
    height: 100vh;
    background-size: cover;
    background-position: center;
    position: relative;
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

    .banner-title {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      font-weight: 300;
    }

    .banner-subtitle {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .banner-desc {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }
}

.login-form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--color-bg-1);
}

.login-form {
  width: 100%;
  max-width: 400px;

  .form-header {
    text-align: center;
    margin-bottom: 2rem;

    .form-title {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--color-text-1);
    }

    .form-subtitle {
      color: var(--color-text-3);
    }
  }

  .quick-login {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }
}
</style>