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
  nickname?: string
  email: string
  password: string
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
export const updateProfile = (data: {
  username?: string
  nickname?: string
  email?: string
  bio?: string
  interests?: string[]
}) => {
  return api.put('/auth/profile', data)
}

export const getPublicPosts = () => {
  // 这个请求会调用 GET /api/posts/public
  // 注意：这个请求虽然也会被拦截器加上Token（如果存在），但这没关系，
  // 因为我们的后端公开接口不校验Token，所以不影响结果。
  return api.get('/posts/public');
}

/**
 * 获取需要登录才能看到的动态列表（例如你的主页Feed流）
 */
export const getFeed = () => {
  // 这个请求会通过请求拦截器自动带上认证的 Token
  // 它会请求 GET /api/posts (假设这是您为登录用户设计的路由)
  return api.get('/posts');
}

export default api 