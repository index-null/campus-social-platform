/**
 * 头像管理工具
 * 使用localStorage存储用户头像，以用户ID为key
 */

const AVATAR_PREFIX = 'avatar_'

/**
 * 保存用户头像到localStorage
 * @param userId 用户ID
 * @param avatarData base64头像数据
 */
export function saveUserAvatar(userId: string, avatarData: string): void {
  try {
    if (avatarData && avatarData.startsWith('data:image/')) {
      localStorage.setItem(AVATAR_PREFIX + userId, avatarData)
      console.log('头像已保存到localStorage:', userId)
    }
  } catch (error) {
    console.error('保存头像失败:', error)
  }
}

/**
 * 从localStorage获取用户头像
 * @param userId 用户ID
 * @returns 头像数据或null
 */
export function getUserAvatar(userId: string): string | null {
  try {
    return localStorage.getItem(AVATAR_PREFIX + userId)
  } catch (error) {
    console.error('获取头像失败:', error)
    return null
  }
}

/**
 * 删除用户头像
 * @param userId 用户ID
 */
export function removeUserAvatar(userId: string): void {
  try {
    localStorage.removeItem(AVATAR_PREFIX + userId)
    console.log('头像已删除:', userId)
  } catch (error) {
    console.error('删除头像失败:', error)
  }
}

/**
 * 获取头像URL，带fallback机制
 * @param user 用户对象
 * @returns 头像URL
 */
export function getAvatarUrl(user: any): string {
  if (!user) {
    return 'https://ui-avatars.com/api/?name=User&background=random'
  }

  // 优先从localStorage获取
  const storedAvatar = getUserAvatar(user.id || user.studentId)
  if (storedAvatar) {
    return storedAvatar
  }

  // 默认头像
  const name = user.nickname || user.username || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
}

/**
 * 清理所有头像数据（用于登出时）
 */
export function clearAllAvatars(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(AVATAR_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
    console.log('所有头像数据已清理')
  } catch (error) {
    console.error('清理头像数据失败:', error)
  }
}

/**
 * 验证头像文件
 * @param file 文件对象
 * @returns 验证结果
 */
export function validateAvatarFile(file: File): { valid: boolean; message?: string } {
  // 文件格式检查
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: '请选择图片文件' }
  }

  // 文件大小检查 (2MB，因为base64会变大)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    return { valid: false, message: '图片大小不能超过2MB' }
  }

  return { valid: true }
}

/**
 * 将文件转换为base64
 * @param file 文件对象
 * @returns Promise<string> base64数据
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      resolve(result)
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsDataURL(file)
  })
} 