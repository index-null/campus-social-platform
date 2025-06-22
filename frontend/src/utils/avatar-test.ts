/**
 * 头像功能测试
 * 用于验证localStorage头像逻辑的完整性
 */

import { saveUserAvatar, getUserAvatar, removeUserAvatar, getAvatarUrl } from './avatar'

// 测试用的base64图片数据（1x1像素的透明PNG）
const TEST_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

// 测试用户数据
const TEST_USER = {
  id: 'test123',
  username: 'testuser',
  nickname: 'Test User'
}

/**
 * 测试头像保存和获取
 */
export function testAvatarSaveAndGet(): boolean {
  console.log('🧪 测试头像保存和获取')
  
  try {
    // 清理测试数据
    removeUserAvatar(TEST_USER.id)
    
    // 测试保存
    saveUserAvatar(TEST_USER.id, TEST_AVATAR)
    
    // 测试获取
    const retrieved = getUserAvatar(TEST_USER.id)
    
    if (retrieved === TEST_AVATAR) {
      console.log('✅ 头像保存和获取测试通过')
      return true
    } else {
      console.error('❌ 头像保存和获取测试失败', {
        expected: TEST_AVATAR,
        received: retrieved
      })
      return false
    }
  } catch (error) {
    console.error('❌ 头像保存和获取测试异常', error)
    return false
  }
}

/**
 * 测试头像删除
 */
export function testAvatarRemove(): boolean {
  console.log('🧪 测试头像删除')
  
  try {
    // 先保存头像
    saveUserAvatar(TEST_USER.id, TEST_AVATAR)
    
    // 确认保存成功
    let retrieved = getUserAvatar(TEST_USER.id)
    if (retrieved !== TEST_AVATAR) {
      console.error('❌ 预备步骤失败：头像保存失败')
      return false
    }
    
    // 删除头像
    removeUserAvatar(TEST_USER.id)
    
    // 确认删除成功
    retrieved = getUserAvatar(TEST_USER.id)
    
    if (retrieved === null) {
      console.log('✅ 头像删除测试通过')
      return true
    } else {
      console.error('❌ 头像删除测试失败', {
        expected: null,
        received: retrieved
      })
      return false
    }
  } catch (error) {
    console.error('❌ 头像删除测试异常', error)
    return false
  }
}

/**
 * 测试getAvatarUrl函数
 */
export function testGetAvatarUrl(): boolean {
  console.log('🧪 测试getAvatarUrl函数')
  
  try {
    // 清理测试数据
    removeUserAvatar(TEST_USER.id)
    
    // 测试无头像时的默认头像
    let avatarUrl = getAvatarUrl(TEST_USER)
    if (!avatarUrl.includes('ui-avatars.com')) {
      console.error('❌ 默认头像URL测试失败', { received: avatarUrl })
      return false
    }
    console.log('✅ 默认头像URL测试通过')
    
    // 保存头像后测试
    saveUserAvatar(TEST_USER.id, TEST_AVATAR)
    avatarUrl = getAvatarUrl(TEST_USER)
    
    if (avatarUrl === TEST_AVATAR) {
      console.log('✅ 自定义头像URL测试通过')
      
      // 清理测试数据
      removeUserAvatar(TEST_USER.id)
      return true
    } else {
      console.error('❌ 自定义头像URL测试失败', {
        expected: TEST_AVATAR,
        received: avatarUrl
      })
      return false
    }
  } catch (error) {
    console.error('❌ getAvatarUrl测试异常', error)
    return false
  }
}

/**
 * 运行所有测试
 */
export function runAllAvatarTests(): boolean {
  console.log('🚀 开始头像功能测试')
  
  const tests = [
    testAvatarSaveAndGet,
    testAvatarRemove,
    testGetAvatarUrl
  ]
  
  let allPassed = true
  
  for (const test of tests) {
    const result = test()
    if (!result) {
      allPassed = false
    }
  }
  
  if (allPassed) {
    console.log('🎉 所有头像功能测试通过')
  } else {
    console.log('💥 部分头像功能测试失败')
  }
  
  return allPassed
}

// 如果在浏览器控制台中运行，可以直接调用测试
if (typeof window !== 'undefined') {
  (window as any).testAvatars = runAllAvatarTests
  console.log('💡 在浏览器控制台中运行 testAvatars() 来执行头像功能测试')
} 