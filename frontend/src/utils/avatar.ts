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
      const key = AVATAR_PREFIX + userId
      localStorage.setItem(key, avatarData)
      console.log('saveUserAvatar: 头像已保存到localStorage', {
        key,
        userId,
        dataLength: avatarData.length
      })
    } else {
      console.error('saveUserAvatar: 无效的头像数据', {
        userId,
        hasData: !!avatarData,
        isValidFormat: avatarData ? avatarData.startsWith('data:image/') : false
      })
    }
  } catch (error) {
    console.error('saveUserAvatar: 保存头像失败', { userId, error })
  }
}

/**
 * 从localStorage获取用户头像
 * @param userId 用户ID
 * @returns 头像数据或null
 */
export function getUserAvatar(userId: string): string | null {
  try {
    const key = AVATAR_PREFIX + userId
    const avatar = localStorage.getItem(key)
    console.log('getUserAvatar: 查询头像', {
      key,
      userId,
      found: !!avatar,
      dataLength: avatar?.length || 0
    })
    return avatar
  } catch (error) {
    console.error('getUserAvatar: 获取头像失败', { userId, error })
    return null
  }
}

/**
 * 删除用户头像
 * @param userId 用户ID
 */
export function removeUserAvatar(userId: string): void {
  try {
    const key = AVATAR_PREFIX + userId
    localStorage.removeItem(key)
    console.log('removeUserAvatar: 头像已删除', { key, userId })
  } catch (error) {
    console.error('removeUserAvatar: 删除头像失败', { userId, error })
  }
}

/**
 * 获取头像URL，带fallback机制
 * @param user 用户对象
 * @returns 头像URL
 */
export function getAvatarUrl(user: any): string {
  if (!user) {
    console.log('getAvatarUrl: 用户对象为空，返回默认头像')
    return 'https://ui-avatars.com/api/?name=User&background=random'
  }

  // 尝试多种方式获取用户ID
  const userId = user.id || user.studentId || user._id
  if (!userId) {
    console.log('getAvatarUrl: 用户ID不存在，返回默认头像')
    const name = user.nickname || user.username || 'User'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
  }

  // 确保用户ID是字符串格式
  const userIdStr = String(userId)
  console.log('getAvatarUrl: 查找头像，用户ID:', userIdStr)

  // 优先从localStorage获取
  const storedAvatar = getUserAvatar(userIdStr)
  if (storedAvatar) {
    console.log('getAvatarUrl: 从localStorage获取到头像')
    return storedAvatar
  }

  console.log('getAvatarUrl: localStorage中无头像，返回默认头像')
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