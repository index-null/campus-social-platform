<template>
  <AppLayout :show-search="true">
    <a-layout class="home-layout">
      <!-- 左侧边栏 -->
      <a-layout-sider 
        :width="280"
        breakpoint="lg"
        :collapsed-width="0"
        class="home-sider"
      >
        <div class="sider-content">
          <!-- 快捷导航 -->
          <a-card :bordered="false" class="nav-card" v-motion-slide-left>
            <template #title>
              <icon-compass /> 导航
            </template>
            <a-menu
              mode="vertical"
              :selected-keys="['home']"
              :auto-open-selected="true"
            >
              <a-menu-item key="home">
                <template #icon><icon-home /></template>
                首页
              </a-menu-item>
              <a-menu-item key="explore">
                <template #icon><icon-fire /></template>
                发现
              </a-menu-item>
              <a-menu-item key="following" v-if="isLoggedIn">
                <template #icon><icon-heart /></template>
                关注
              </a-menu-item>
              <a-menu-item key="messages" v-if="isLoggedIn">
                <template #icon><icon-message /></template>
                消息
                <template #extra>
                  <a-badge :count="3" />
                </template>
              </a-menu-item>
            </a-menu>
          </a-card>

          <!-- 热门话题 -->
          <a-card :bordered="false" class="topic-card" v-motion-slide-left :delay="100">
            <template #title>
              <icon-fire /> 热门话题
            </template>
            <a-space direction="vertical" fill :size="12">
              <a-tag
                v-for="topic in hotTopics"
                :key="topic.id"
                color="arcoblue"
                size="large"
                @click="handleTopicClick(topic)"
                style="cursor: pointer; width: 100%"
              >
                <div style="display: flex; justify-content: space-between; width: 100%">
                  <span>#{{ topic.name }}</span>
                  <a-typography-text type="secondary" style="font-size: 12px">
                    {{ topic.count }}
                  </a-typography-text>
                </div>
              </a-tag>
            </a-space>
          </a-card>
        </div>
      </a-layout-sider>

      <!-- 主内容区 -->
      <a-layout-content class="home-content">
        <div class="content-wrapper">
          <!-- 发布入口 -->
          <a-card 
            v-if="isLoggedIn" 
            :bordered="false" 
            class="publish-card" 
            v-motion-fade-in-up
          >
            <div class="publish-input" @click="showPostModal = true">
              <a-avatar
                :src="user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`"
                :size="40"
              />
              <a-typography-text class="input-placeholder" type="secondary">
                分享你的校园生活...
              </a-typography-text>
              <a-space>
                <a-button type="text" size="small">
                  <template #icon><icon-image /></template>
                </a-button>
                <a-button type="text" size="small">
                  <template #icon><icon-video-camera /></template>
                </a-button>
                <a-button type="text" size="small">
                  <template #icon><icon-location /></template>
                </a-button>
              </a-space>
            </div>
          </a-card>

          <!-- 动态切换标签 -->
          <a-card :bordered="false" class="tab-card">
            <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
              <a-tab-pane key="all" title="全部动态">
                <template #title>
                  <icon-apps /> 全部
                </template>
              </a-tab-pane>
              <a-tab-pane key="following" title="关注" v-if="isLoggedIn">
                <template #title>
                  <icon-heart /> 关注
                </template>
              </a-tab-pane>
              <a-tab-pane key="hot" title="热门">
                <template #title>
                  <icon-fire /> 热门
                </template>
              </a-tab-pane>
            </a-tabs>
          </a-card>

          <!-- 动态列表 -->
          <a-spin :loading="loading" style="width: 100%; min-height: 400px;">
            <div class="post-list">
              <template v-if="posts.length > 0">
                <PostCard
                  v-for="(post, index) in posts"
                  :key="post._id"
                  :post="post"
                  v-motion-fade-in-up
                  :style="{ animationDelay: `${index * 0.1}s` }"
                  @update="updatePost"
                  @delete="deletePost"
                />
              </template>
              
              <a-empty v-else description="暂无动态">
                <template #extra>
                  <a-button type="primary" v-if="isLoggedIn" @click="showPostModal = true">
                    发布第一条动态
                  </a-button>
                  <a-button type="primary" v-else @click="router.push('/login')">
                    登录后查看更多
                  </a-button>
                </template>
              </a-empty>
            </div>
          </a-spin>

          <!-- 加载更多 -->
          <div v-if="posts.length > 0" class="load-more">
            <a-button 
              v-if="hasMore" 
              @click="loadMore" 
              :loading="loadingMore"
              long
            >
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </a-button>
            <a-typography-text v-else type="secondary">
              没有更多了
            </a-typography-text>
          </div>
        </div>
      </a-layout-content>

      <!-- 右侧边栏 -->
      <a-layout-sider 
        :width="280"
        breakpoint="xl"
        :collapsed-width="0"
        class="home-sider-right"
      >
        <div class="sider-content">
          <!-- 推荐用户 -->
          <a-card :bordered="false" class="recommend-card" v-motion-slide-right>
            <template #title>
              <icon-user-group /> 推荐关注
            </template>
            <a-list :data="recommendUsers" :split="false">
              <template #item="{ item }">
                <a-list-item>
                  <a-list-item-meta
                    :title="item.name"
                    :description="item.bio"
                  >
                    <template #avatar>
                      <a-avatar :src="item.avatar" />
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-button size="small" type="primary">
                      关注
                    </a-button>
                  </template>
                </a-list-item>
              </template>
            </a-list>
            <a-button long style="margin-top: 16px">
              查看更多
            </a-button>
          </a-card>

          <!-- 活动推荐 -->
          <a-card :bordered="false" class="activity-card" v-motion-slide-right :delay="100">
            <template #title>
              <icon-calendar /> 校园活动
            </template>
            <a-carousel
              :style="{ height: '180px' }"
              :auto-play="true"
              indicator-type="dot"
              show-arrow="hover"
            >
              <a-carousel-item
                v-for="(activity, index) in activities"
                :key="index"
              >
                <div class="activity-item">
                  <img
                    :src="activity.image"
                    :alt="activity.title"
                    class="activity-image"
                  />
                  <div class="activity-overlay">
                    <a-typography-title :heading="6" style="color: white; margin: 0">
                      {{ activity.title }}
                    </a-typography-title>
                    <a-typography-text style="color: rgba(255,255,255,0.9); font-size: 12px">
                      {{ activity.date }}
                    </a-typography-text>
                  </div>
                </div>
              </a-carousel-item>
            </a-carousel>
          </a-card>

          <!-- 页脚信息 -->
          <div class="footer-info">
            <a-space direction="vertical" fill :size="4">
              <a-link>关于我们</a-link>
              <a-link>使用条款</a-link>
              <a-link>隐私政策</a-link>
              <a-typography-text type="secondary" style="font-size: 12px">
                © 2024 校园社交平台
              </a-typography-text>
            </a-space>
          </div>
        </div>
      </a-layout-sider>
    </a-layout>

    <!-- 发布动态弹窗 -->
    <a-modal
      v-model:visible="showPostModal"
      title="发布动态"
      width="600px"
      @ok="handlePublishPost"
      @cancel="resetPostForm"
      :ok-loading="publishing"
    >
      <a-form :model="postForm" layout="vertical">
        <a-form-item>
          <a-textarea
            v-model="postForm.content"
            placeholder="分享你的想法..."
            :max-length="500"
            show-word-limit
            :auto-size="{ minRows: 4, maxRows: 8 }"
          />
        </a-form-item>
        
        <a-form-item label="添加图片">
          <a-upload
            :file-list="postForm.images"
            @change="handleImageChange"
            list-type="picture-card"
            :limit="9"
            accept="image/*"
            multiple
          >
            <template #upload-button>
              <div>
                <icon-plus />
                <div style="margin-top: 8px">上传图片</div>
              </div>
            </template>
          </a-upload>
        </a-form-item>
        
        <a-form-item label="话题标签">
          <a-select
            v-model="postForm.tags"
            placeholder="添加话题标签"
            multiple
            allow-create
            :max-tag-count="5"
          >
            <a-option v-for="tag in hotTopics" :key="tag.id" :value="tag.name">
              #{{ tag.name }}
            </a-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="可见范围">
          <a-radio-group v-model="postForm.visibility">
            <a-radio value="public">公开</a-radio>
            <a-radio value="friends">仅好友</a-radio>
            <a-radio value="private">仅自己</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'
import { getRandomImage, getImageByScene } from '@/config/images'
import AppLayout from '@/components/AppLayout.vue'
import PostCard from '@/components/PostCard.vue'
import { getPublicPosts, getFeed } from '@/api/auth'; // 从您的 api 文件导入
import type { IPost } from '@/types'; // 强烈建议为 Post 创建类型定义，如果已有请忽略

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)
const user = computed(() => userStore.user)

// 状态管理
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const showPostModal = ref(false)
const publishing = ref(false)
const activeTab = ref('all')

// 热门话题
const hotTopics = ref([
  { id: 1, name: '校园日常', count: 128 },
  { id: 2, name: '学习打卡', count: 86 },
  { id: 3, name: '美食分享', count: 64 },
  { id: 4, name: '运动健身', count: 45 },
  { id: 5, name: '社团活动', count: 32 }
])

// 推荐用户
const recommendUsers = ref<any[]>([])

// 活动数据
const activities = ref<any[]>([])

// 动态列表
const posts = ref<any[]>([])

// 发布表单
const postForm = reactive({
  content: '',
  images: [],
  tags: [],
  visibility: 'public'
})

// 初始化数据
onMounted(() => {
  loadRecommendUsers()
  loadActivities()
  loadPosts()
})

// 加载推荐用户
const loadRecommendUsers = () => {
  recommendUsers.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: ['小明同学', '编程达人', '摄影爱好者', '学生会主席', '运动健将'][i],
    bio: ['计算机专业大三', '分享编程心得', '记录校园美景', '组织校园活动', '篮球队队长'][i],
    avatar: getRandomImage('学生社交聚会').urls.small
  }))
}

// 加载活动
const loadActivities = () => {
  activities.value = [
    {
      title: '春季运动会',
      date: '2024-03-20',
      image: getImageByScene('活动宣传').urls.regular
    },
    {
      title: '社团招新大会',
      date: '2024-03-15',
      image: getImageByScene('社团介绍').urls.regular
    },
    {
      title: '校园音乐节',
      date: '2024-04-01',
      image: getImageByScene('活动组织').urls.regular
    }
  ]
}

// 加载动态
// 请将旧的 loadPosts 函数完全删除，替换为这个新的版本
const loadPosts = async () => {
  loading.value = true;
  try {
    let response;
    // 根据登录状态，调用不同的API
    if (userStore.isLoggedIn) {
      // 已登录用户，调用 getFeed (您可能需要后续实现此接口的特定逻辑，暂时可以先用公开接口代替)
      // response = await getFeed();
      // 在 getFeed 接口实现前，我们先统一使用公开接口
      response = await getPublicPosts();
    } else {
      // 未登录游客，调用获取公开动态的接口
      response = await getPublicPosts();
    }

    // 注意：您的后端返回的数据可能在 response.data.data 中
    // 请根据您后端的实际返回结构进行调整
    if (response && response.data) {
      posts.value = response.data;
    } else {
      posts.value = [];
    }

  } catch (err) {
    console.error("加载动态失败:", err);
    Message.error('加载动态失败，请稍后重试');
    posts.value = []; // 出错时清空列表
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = async () => {
  loadingMore.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 模拟没有更多数据
    hasMore.value = false
  } finally {
    loadingMore.value = false
  }
}

// 标签页切换
const handleTabChange = (key: string) => {
  activeTab.value = key
  loadPosts()
}

// 话题点击
const handleTopicClick = (topic: any) => {
  Message.info(`查看话题：${topic.name}`)
}

// 图片上传处理
const handleImageChange = (_fileList: any, file: any) => {
  if (file.status === 'done') {
    Message.success('图片上传成功')
  }
}

// 发布动态
const handlePublishPost = async () => {
  if (!postForm.content.trim()) {
    Message.warning('请输入内容')
    return
  }
  
  publishing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 添加新动态到列表顶部
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: user.value?.id,
        username: user.value?.username,
        avatar: user.value?.avatar
      },
      content: postForm.content,
      images: [],
      tags: postForm.tags,
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      createdAt: new Date()
    }
    
    posts.value.unshift(newPost)
    Message.success('发布成功')
    showPostModal.value = false
    resetPostForm()
  } finally {
    publishing.value = false
  }
}

// 重置表单
const resetPostForm = () => {
  postForm.content = ''
  postForm.images = []
  postForm.tags = []
  postForm.visibility = 'public'
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
}
</script>

<style scoped lang="less">
.home-layout {
  min-height: calc(100vh - 60px);
  background-color: var(--color-bg-1);
}

.home-sider,
.home-sider-right {
  background-color: var(--color-bg-2);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-text-4);
    border-radius: 3px;
  }
}

.sider-content {
  padding: 20px;
  
  .nav-card,
  .topic-card,
  .recommend-card,
  .activity-card {
    margin-bottom: 16px;
  }
}

.home-content {
  overflow-y: auto;
  background-color: var(--color-bg-1);
}

.content-wrapper {
  max-width: 680px;
  margin: 0 auto;
  padding: 20px;
}

.publish-card {
  margin-bottom: 16px;
  
  .publish-input {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: var(--color-fill-1);
    }
    
    .input-placeholder {
      flex: 1;
    }
  }
}

.tab-card {
  margin-bottom: 16px;
  
  :deep(.arco-card-body) {
    padding: 0;
  }
  
  :deep(.arco-tabs-nav) {
    padding: 0 20px;
  }
}

.post-list {
  min-height: 400px;
}

.load-more {
  margin-top: 20px;
  text-align: center;
}

.activity-item {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
  
  .activity-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .activity-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  }
}

.footer-info {
  margin-top: 20px;
  padding: 20px;
  text-align: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式处理
@media (max-width: 1200px) {
  .home-sider-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .home-sider {
    display: none;
  }
  
  .content-wrapper {
         padding: 16px;
   }
 }
</style>