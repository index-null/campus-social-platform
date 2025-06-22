import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getProfile } from '@/api/auth'
import { clearAllAvatars } from '@/utils/avatar'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // 登录
  const login = async (credentials: any) => {
    try {
      const response: any = await loginApi(credentials)
      token.value = response.token
      user.value = response.user
      
      // 处理"记住我"
      if (credentials.remember) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('userData', JSON.stringify(response.user))
      } else {
        sessionStorage.setItem('token', response.token)
        sessionStorage.setItem('userData', JSON.stringify(response.user))
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
    localStorage.removeItem('userData')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userData')
    
    // 清理所有头像数据
    clearAllAvatars()
    
    router.push('/login')
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) {
      // 尝试从存储中恢复用户数据
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData')
      if (storedUserData) {
        try {
          user.value = JSON.parse(storedUserData)
        } catch (error) {
          console.error('解析用户数据失败:', error)
        }
      }
      return
    }
    
    try {
      const response: any = await getProfile()
      user.value = response.user
      
      // 更新存储的用户数据
      if (localStorage.getItem('token')) {
        localStorage.setItem('userData', JSON.stringify(response.user))
      } else {
        sessionStorage.setItem('userData', JSON.stringify(response.user))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
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