<template>
  <AppLayout :show-search="false">
    <div class="profile-container">
      <!-- 个人信息头部 -->
      <a-card :bordered="false" class="profile-header-card">
        <div class="profile-header">
          <div class="profile-cover">
            <img :src="getImageByScene('校园风景').urls.regular" alt="封面" />
            <a-button 
              v-if="isOwnProfile" 
              class="edit-cover-btn"
              type="primary"
              size="small"
            >
              <template #icon><icon-edit /></template>
              编辑封面
            </a-button>
          </div>
          
          <div class="profile-info">
            <div class="info-left">
              <a-avatar
                :size="120"
                :src="getAvatarUrl(profileUser)"
                class="profile-avatar"
              />
              <div class="profile-details">
                <a-typography-title :heading="3" style="margin: 0">
                  {{ profileUser?.username || '加载中...' }}
                </a-typography-title>
                <a-typography-text type="secondary">
                  @{{ profileUser?.studentId }}
                </a-typography-text>
                <a-typography-paragraph style="margin-top: 12px">
                  {{ profileUser?.bio || '这个人很懒，什么都没写~' }}
                </a-typography-paragraph>
                <a-space style="margin-top: 12px">
                  <a-tag color="arcoblue" v-for="tag in profileUser?.interests" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-space>
              </div>
            </div>
            
            <div class="info-right">
              <a-space v-if="!isOwnProfile">
                <a-button 
                  :type="isFollowing ? 'secondary' : 'primary'"
                  @click="toggleFollow"
                >
                  {{ isFollowing ? '已关注' : '关注' }}
                </a-button>
                <a-button>发消息</a-button>
              </a-space>
              <a-button v-else @click="showEditModal = true">
                <template #icon><icon-edit /></template>
                编辑资料
              </a-button>
            </div>
          </div>
          
          <div class="profile-stats">
            <a-grid :cols="4" :col-gap="0">
              <a-grid-item>
                <a-statistic
                  title="动态"
                  :value="stats.postCount"
                  :value-style="{ color: 'var(--color-text-1)' }"
                />
              </a-grid-item>
              <a-grid-item>
                <a-statistic
                  title="关注"
                  :value="stats.followingCount"
                  :value-style="{ color: 'var(--color-text-1)' }"
                />
              </a-grid-item>
              <a-grid-item>
                <a-statistic
                  title="粉丝"
                  :value="stats.followerCount"
                  :value-style="{ color: 'var(--color-text-1)' }"
                />
              </a-grid-item>
              <a-grid-item>
                <a-statistic
                  title="获赞"
                  :value="stats.likeCount"
                  :value-style="{ color: 'var(--color-text-1)' }"
                />
              </a-grid-item>
            </a-grid>
          </div>
        </div>
      </a-card>

      <!-- 内容区域 -->
      <a-row :gutter="20" style="margin-top: 20px">
        <!-- 左侧信息 -->
        <a-col :xs="24" :sm="24" :md="8" :lg="7">
          <a-space direction="vertical" fill :size="16" style="width: 100%">
            <!-- 个人信息卡片 -->
            <a-card :bordered="false" title="个人信息">
              <a-descriptions :column="1" size="small">
                <a-descriptions-item label="学号">
                  {{ profileUser?.studentId }}
                </a-descriptions-item>
                <a-descriptions-item label="邮箱">
                  {{ profileUser?.email }}
                </a-descriptions-item>
                <a-descriptions-item label="注册时间">
                  {{ formatDate(profileUser?.createdAt) }}
                </a-descriptions-item>
                <a-descriptions-item label="最后活跃">
                  {{ formatTime(profileUser?.lastActiveAt) }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <!-- 成就卡片 -->
            <a-card :bordered="false" title="成就">
              <a-space wrap :size="8">
                <a-tooltip v-for="badge in achievements" :key="badge.id" :content="badge.description">
                  <a-tag :color="badge.color" size="large">
                    <template #icon>
                      <component :is="badge.icon" />
                    </template>
                    {{ badge.name }}
                  </a-tag>
                </a-tooltip>
              </a-space>
            </a-card>
          </a-space>
        </a-col>

        <!-- 右侧动态列表 -->
        <a-col :xs="24" :sm="24" :md="16" :lg="17">
          <a-card :bordered="false" style="margin-bottom: 16px">
            <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
              <a-tab-pane key="posts" title="动态">
                <template #title>
                  <icon-file /> 动态
                </template>
              </a-tab-pane>
              <a-tab-pane key="likes" title="喜欢">
                <template #title>
                  <icon-heart /> 喜欢
                </template>
              </a-tab-pane>
              <a-tab-pane key="media" title="图片/视频">
                <template #title>
                  <icon-image /> 图片/视频
                </template>
              </a-tab-pane>
            </a-tabs>
          </a-card>

          <!-- 动态列表 -->
          <a-spin :loading="loading" style="width: 100%; min-height: 400px;">
            <div class="post-list">
              <template v-if="posts.length > 0">
                <PostCard
                  v-for="post in posts"
                  :key="post.id"
                  :post="post"
                  @update="updatePost"
                  @delete="deletePost"
                />
              </template>
              
              <a-empty v-else :description="emptyDescription">
                <template #extra v-if="isOwnProfile && activeTab === 'posts'">
                  <a-button type="primary" @click="router.push('/')">
                    去发布动态
                  </a-button>
                </template>
              </a-empty>
            </div>
          </a-spin>
        </a-col>
      </a-row>
    </div>

    <!-- 编辑资料弹窗 -->
    <a-modal
      v-model:visible="showEditModal"
      title="编辑个人资料"
      width="600px"
      @ok="handleUpdateProfile"
      @cancel="resetEditForm"
      :ok-loading="updating"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="头像">
          <div class="avatar-upload-section">
            <div class="avatar-preview-container">
              <a-spin :loading="avatarUploading">
                <a-avatar
                  :size="80"
                  :src="editForm.avatar || getAvatarUrl(currentUser)"
                  class="profile-avatar-preview"
                />
              </a-spin>
            </div>
            <div class="avatar-actions">
                              <a-upload
                  accept="image/*"
                  :show-file-list="false"
                  :auto-upload="false"
                  @change="handleAvatarChange"
                  :disabled="avatarUploading"
                >
                <a-button :loading="avatarUploading">
                  <template #icon><icon-upload /></template>
                  {{ editForm.avatar ? '更换头像' : '上传头像' }}
                </a-button>
              </a-upload>
              <a-button
                v-if="editForm.avatar"
                type="text"
                status="danger"
                @click="removeAvatar"
              >
                <template #icon><icon-delete /></template>
                删除头像
              </a-button>
            </div>
            <a-typography-text type="secondary" class="avatar-tip">
              建议尺寸：200×200，支持JPG、PNG格式，文件大小不超过5MB
            </a-typography-text>
          </div>
        </a-form-item>

        <a-form-item label="用户名">
          <a-input v-model="editForm.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="个人简介">
          <a-textarea
            v-model="editForm.bio"
            placeholder="介绍一下自己吧"
            :max-length="200"
            show-word-limit
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>

        <a-form-item label="兴趣标签">
          <a-select
            v-model="editForm.interests"
            placeholder="选择你的兴趣"
            multiple
            :max-tag-count="5"
          >
            <a-option v-for="tag in interestOptions" :key="tag" :value="tag">
              {{ tag }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="邮箱">
          <a-input v-model="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
      </a-form>
    </a-modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { getImageByScene } from '@/config/images'
import { updateProfile } from '@/api/auth'
import { getAvatarUrl, validateAvatarFile, fileToBase64, saveUserAvatar, removeUserAvatar } from '@/utils/avatar'
import AppLayout from '@/components/AppLayout.vue'
import PostCard from '@/components/PostCard.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 当前登录用户
const currentUser = computed(() => userStore.user)

// 个人主页用户信息
const profileUser = ref<any>(null)
const profileId = computed(() => route.params.id || currentUser.value?.id)
const isOwnProfile = computed(() => !route.params.id || route.params.id === currentUser.value?.id)
const isFollowing = ref(false)

// 状态管理
const loading = ref(false)
const updating = ref(false)
const showEditModal = ref(false)
const activeTab = ref('posts')

// 统计数据
const stats = reactive({
  postCount: 0,
  followingCount: 0,
  followerCount: 0,
  likeCount: 0
})

// 成就徽章
const achievements = ref([
  { id: 1, name: '新人报到', icon: 'icon-user-add', color: 'green', description: '完成注册' },
  { id: 2, name: '活跃用户', icon: 'icon-fire', color: 'orange', description: '连续7天活跃' },
  { id: 3, name: '人气之星', icon: 'icon-star', color: 'gold', description: '获得100个赞' },
])

// 动态列表
const posts = ref<any[]>([])

// 编辑表单
const editForm = reactive({
  username: '',
  nickname: '',
  bio: '',
  interests: [] as string[],
  email: '',
  avatar: ''
})

// 兴趣选项
const interestOptions = [
  '编程', '音乐', '电影', '阅读', '运动',
  '游戏', '摄影', '美食', '旅行', '学习',
  '设计', '创业', '科技', '艺术', '动漫'
]

// 空状态描述
const emptyDescription = computed(() => {
  if (activeTab.value === 'posts') {
    return isOwnProfile.value ? '还没有发布过动态' : 'TA还没有发布过动态'
  } else if (activeTab.value === 'likes') {
    return isOwnProfile.value ? '还没有喜欢的内容' : 'TA还没有喜欢的内容'
  } else {
    return '暂无媒体内容'
  }
})

// 监听路由变化
watch(() => route.params.id, () => {
  loadUserProfile()
})

// 初始化
onMounted(() => {
  loadUserProfile()
})

// 加载用户资料
const loadUserProfile = async () => {
  loading.value = true
  try {
    // 模拟加载用户数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (isOwnProfile.value) {
      profileUser.value = currentUser.value
    } else {
      // 模拟其他用户数据
      profileUser.value = {
        id: profileId.value,
        username: '其他用户',
        studentId: '2024000002',
        email: 'other@campus.edu',
        bio: '这是其他用户的个人简介',
        interests: ['摄影', '旅行'],
        avatar: null,
        createdAt: new Date('2024-01-01'),
        lastActiveAt: new Date()
      }
      isFollowing.value = Math.random() > 0.5
    }
    
    // 加载统计数据
    stats.postCount = Math.floor(Math.random() * 50)
    stats.followingCount = Math.floor(Math.random() * 100)
    stats.followerCount = Math.floor(Math.random() * 200)
    stats.likeCount = Math.floor(Math.random() * 500)
    
    // 加载动态
    loadPosts()
  } finally {
    loading.value = false
  }
}

// 加载动态列表
const loadPosts = async () => {
  // 模拟加载动态
  if (activeTab.value === 'posts') {
    posts.value = Array.from({ length: 3 }, (_, i) => ({
      id: `post-${i}`,
      author: {
        id: profileUser.value?.id,
        username: profileUser.value?.username,
        avatar: profileUser.value?.avatar
      },
      content: `这是${profileUser.value?.username}的第${i + 1}条动态`,
      images: [],
      tags: [],
      likeCount: Math.floor(Math.random() * 100),
      commentCount: Math.floor(Math.random() * 50),
      isLiked: false,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 30)
    }))
  } else {
    posts.value = []
  }
}

// 标签页切换
const handleTabChange = () => {
  loadPosts()
}

// 关注/取消关注
const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  Message.success(isFollowing.value ? '关注成功' : '取消关注成功')
  stats.followerCount += isFollowing.value ? 1 : -1
}

// 格式化日期
const formatDate = (date: any) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

// 格式化时间
const formatTime = (date: any) => {
  if (!date) return '-'
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return formatDate(date)
}

// 更新动态
const updatePost = (updatedPost: any) => {
  const index = posts.value.findIndex(p => p.id === updatedPost.id)
  if (index !== -1) {
    posts.value[index] = updatedPost
  }
}

// 删除动态
const deletePost = (postId: string) => {
  posts.value = posts.value.filter(p => p.id !== postId)
  stats.postCount--
}

// 头像上传状态
const avatarUploading = ref(false)

// 头像上传
const handleAvatarChange = async (_fileList: any[], file: any) => {
  if (!file || !file.file) return
  
  const currentFile = file.file
  
  // 使用工具函数验证文件
  const validation = validateAvatarFile(currentFile)
  if (!validation.valid) {
    Message.error(validation.message)
    return
  }

  avatarUploading.value = true
  
  try {
    // 使用工具函数转换为base64
    const result = await fileToBase64(currentFile)
    editForm.avatar = result
    
    // 立即保存到localStorage
    if (currentUser.value?.id) {
      saveUserAvatar(currentUser.value.id, result)
    }
    
    Message.success('头像上传成功')
  } catch (error) {
    console.error('头像处理失败:', error)
    Message.error('头像处理失败，请重试')
  } finally {
    avatarUploading.value = false
  }
}

// 删除头像
const removeAvatar = () => {
  editForm.avatar = ''
  
  // 从localStorage删除
  if (currentUser.value?.id) {
    removeUserAvatar(currentUser.value.id)
  }
  
  Message.success('头像已删除')
}

// 更新个人资料
const handleUpdateProfile = async () => {
  updating.value = true
  try {
    // 调用API更新接口（不包括头像）
    const response: any = await updateProfile({
      username: editForm.username,
      nickname: editForm.nickname,
      bio: editForm.bio,
      interests: editForm.interests
    })
    
    // 更新本地数据
    if (currentUser.value && response.user) {
      // 更新用户store
      userStore.user = response.user
      profileUser.value = { ...response.user }
      
      // 头像已经在上传时保存到localStorage，这里不需要处理
      
      // 更新存储的用户数据
      if (localStorage.getItem('token')) {
        localStorage.setItem('userData', JSON.stringify(response.user))
      } else {
        sessionStorage.setItem('userData', JSON.stringify(response.user))
      }
    }
    
    Message.success(response.message || '更新成功')
    showEditModal.value = false
  } catch (error: any) {
    console.error('更新个人资料失败:', error)
    Message.error(error.message || '更新失败，请重试')
  } finally {
    updating.value = false
  }
}

// 重置编辑表单
const resetEditForm = () => {
  if (currentUser.value) {
    editForm.username = currentUser.value.username
    editForm.nickname = currentUser.value.nickname || ''
    editForm.bio = currentUser.value.bio || ''
    editForm.interests = currentUser.value.interests || []
    editForm.email = currentUser.value.email
    
    // 从localStorage获取头像
    editForm.avatar = getAvatarUrl(currentUser.value)
  }
}



// 打开编辑弹窗时初始化表单
watch(showEditModal, (val) => {
  if (val) {
    resetEditForm()
  }
})
</script>

<style scoped lang="less">
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header-card {
  margin-bottom: 20px;
  
  :deep(.arco-card-body) {
    padding: 0;
  }
}

.profile-header {
  .profile-cover {
    position: relative;
    height: 300px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .edit-cover-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
  
  .profile-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 40px;
    margin-top: -60px;
    position: relative;
    background: var(--color-bg-2);
    
    .info-left {
      display: flex;
      gap: 24px;
      
      .profile-avatar {
        border: 4px solid var(--color-bg-2);
        background: var(--color-bg-2);
      }
      
      .profile-details {
        padding-top: 60px;
      }
    }
    
    .info-right {
      padding-top: 60px;
    }
  }
  
  .profile-stats {
    padding: 20px 40px;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-2);
    
    :deep(.arco-statistic) {
      text-align: center;
      
      .arco-statistic-title {
        font-size: 14px;
        color: var(--color-text-3);
      }
      
      .arco-statistic-value {
        font-size: 24px;
      }
    }
  }
}

.post-list {
  min-height: 400px;
}

.avatar-upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview-container {
  position: relative;
}

.profile-avatar-preview {
  border: 2px solid var(--color-border-2);
  cursor: pointer;
  
  &:hover {
    border-color: var(--color-primary-6);
  }
}

.avatar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar-tip {
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
}

// 响应式处理
@media (max-width: 768px) {
  .profile-header {
    .profile-cover {
      height: 200px;
    }
    
    .profile-info {
      flex-direction: column;
      padding: 20px;
      
      .info-left {
        flex-direction: column;
        text-align: center;
        
        .profile-avatar {
          margin: 0 auto;
        }
        
        .profile-details {
          padding-top: 20px;
        }
      }
      
      .info-right {
        padding-top: 20px;
        width: 100%;
        
        :deep(.arco-space) {
          width: 100%;
          
          .arco-button {
            flex: 1;
          }
        }
      }
    }
    
    .profile-stats {
      padding: 20px;
    }
  }
  
  .profile-container {
    padding: 0;
  }
}
</style> 