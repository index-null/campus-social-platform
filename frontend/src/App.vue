<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'


const userStore = useUserStore()

// 应用启动时检查登录状态
onMounted(async () => {
  if (userStore.token) {
    await userStore.fetchUserInfo()
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style scoped>
</style>
