<template>
  <a-layout class="app-layout">
    <a-layout-header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <img :src="logoUrl" alt="Logo" class="logo-image" @click="router.push('/')" />
          <a-typography-title 
            :heading="5" 
            style="margin: 0; cursor: pointer;" 
            @click="router.push('/')"
          >
            校园社交平台
          </a-typography-title>
        </div>
        <div class="header-center">
          <slot name="header-center">
            <a-input-search
              v-if="showSearch"
              placeholder="搜索用户、动态..."
              style="width: 300px"
            ></a-input-search>
          </slot>
        </div>
        <div class="header-right">
          <a-space :size="16">
            <a-button shape="circle" @click="toggleTheme">
              <icon-moon v-if="!isDark" />
              <icon-sun v-else />
            </a-button>

            <template v-if="isLoggedIn">
              <a-badge :count="3" dot>
                <a-button shape="circle">
                  <icon-notification />
                </a-button>
              </a-badge>

              <a-dropdown trigger="hover">
                <a-avatar
                  :size="36"
                  :src="getAvatarUrl(user)"
                  style="cursor: pointer"
                ></a-avatar>
                <template #content>
                  <a-doption @click="router.push(`/profile/${user?.id}`)">
                    <template #icon><icon-user /></template>
                    个人主页
                  </a-doption>
                  <a-doption @click="router.push('/settings')">
                    <template #icon><icon-settings /></template>
                    设置
                  </a-doption>
                  <a-divider style="margin: 0" />
                  <a-doption @click="handleLogout">
                    <template #icon><icon-export /></template>
                    退出登录
                  </a-doption>
                </template>
              </a-dropdown>
            </template>

            <template v-else>
              <a-button type="primary" @click="router.push('/login')">
                登录
              </a-button>
              <a-button @click="router.push('/register')">
                注册
              </a-button>
            </template>
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <a-layout-content class="app-content">
      <slot />
    </a-layout-content>

    <a-layout-footer v-if="showFooter" class="app-footer">
      <slot name="footer">
        <a-typography-text type="secondary">
          © 2024 校园社交平台. All rights reserved.
        </a-typography-text>
      </slot>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getAvatarUrl } from '@/utils/avatar'
// ADDED START: 导入您的 logo 图片
import logoUrl from '@/assets/logo.png'; // <-- 确保路径和文件名正确
// ADDED END

interface Props {
  showSearch?: boolean
  showFooter?: boolean
}

withDefaults(defineProps<Props>(), {
  showSearch: true,
  showFooter: false
})

const router = useRouter()
const userStore = useUserStore()

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
  // 保存到本地存储
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 用户状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)

// 退出登录
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

// 初始化主题
if (localStorage.getItem('theme') === 'dark') {
  document.body.setAttribute('arco-theme', 'dark')
  isDark.value = true
}
</script>

<style scoped lang="less">
.app-layout {
  min-height: 100vh;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-2);
  
  body[arco-theme='dark'] & {
    border-bottom-color: var(--color-border-2);
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    gap: 24px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .header-right {
    flex-shrink: 0;
  }
}

.app-content {
  margin-top: 60px;
  background-color: var(--color-bg-1);
  min-height: calc(100vh - 60px);
}

.app-footer {
  text-align: center;
  padding: 24px;
  background-color: var(--color-bg-2);
}

// 响应式
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    
    .header-center {
      display: none;
    }
  }
  
  .header-left {
    :deep(.arco-typography) {
      display: none;
    }
  }
}

// ADDED START: 添加 logo 图片的样式
.logo-image {
  height: 32px;
}
// ADDED END
</style>