import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.error || '网络错误'
    return Promise.reject(new Error(message))
  }
)

// 登录接口
export const login = (data: {
  studentId: string
  password: string
  remember?: boolean
}) => {
  return api.post('/auth/login', data)
}

// 注册接口
export const register = (data: {
  studentId: string
  username: string
  email: string
  password: string
  avatar?: string
  bio?: string
  interests?: string[]
}) => {
  return api.post('/auth/register', data)
}

// 获取个人信息
export const getProfile = () => {
  return api.get('/auth/profile')
}

// 更新个人信息
export const updateProfile = (data: any) => {
  return api.put('/auth/profile', data)
}

export default api 