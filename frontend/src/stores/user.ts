import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getProfile } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // 登录
  const login = async (credentials: any) => {
    try {
      const response:any = await loginApi(credentials)
      token.value = response.token
      user.value = response.user
      
      // 处理"记住我"
      if (credentials.remember) {
        localStorage.setItem('token', response.token)
      } else {
        sessionStorage.setItem('token', response.token)
      }
      
      return response
    } catch (error) {
      throw error
    }
  }
  
  // 登出
  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    router.push('/login')
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      const response:any = await getProfile()
      user.value = response.user
    } catch (error) {
      logout()
    }
  }
  
  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    fetchUserInfo
  }
}) 