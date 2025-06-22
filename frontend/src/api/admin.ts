import api from './auth'

// 获取统计数据
export const getAdminStats = () => {
  return api.get('/admin/stats')
}

// 获取用户列表
export const getUsers = (params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}) => {
  return api.get('/admin/users', { params })
}

// 创建用户
export const createUser = (userData: {
  studentId: string
  username: string
  nickname?: string
  email: string
  password: string
  bio?: string
  interests?: string[]
  role?: string
  isActive?: boolean
}) => {
  return api.post('/admin/users', userData)
}

// 更新用户
export const updateUser = (id: string, userData: {
  username?: string
  nickname?: string
  email?: string
  bio?: string
  interests?: string[]
  role?: string
  isActive?: boolean
}) => {
  return api.put(`/admin/users/${id}`, userData)
}

// 删除用户
export const deleteUser = (id: string) => {
  return api.delete(`/admin/users/${id}`)
}

// 切换用户状态
export const toggleUserStatus = (id: string) => {
  return api.patch(`/admin/users/${id}/status`)
}

// 重置用户密码
export const resetUserPassword = (id: string, newPassword: string) => {
  return api.patch(`/admin/users/${id}/password`, { newPassword })
} 