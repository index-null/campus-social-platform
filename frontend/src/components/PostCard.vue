<template>
  <a-card class="post-card" :bordered="false">
    <!-- 用户信息头部 -->
    <div class="post-header">
      <a-space :size="12">
        <a-avatar
          :src="post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}`"
          :size="48"
          style="cursor: pointer"
          @click="router.push(`/profile/${post.author.id}`)"
        />
        <div>
          <a-typography-title :heading="6" style="margin: 0; cursor: pointer" @click="router.push(`/profile/${post.author.id}`)">
            {{ post.author.username }}
          </a-typography-title>
          <a-typography-text type="secondary" style="font-size: 12px">
            {{ formatTime(post.createdAt) }}
          </a-typography-text>
        </div>
      </a-space>
      
      <a-dropdown trigger="hover" v-if="isOwnPost">
        <a-button type="text" size="small">
          <icon-more />
        </a-button>
        <template #content>
          <a-doption @click="handleEdit">
            <template #icon><icon-edit /></template>
            编辑
          </a-doption>
          <a-doption status="danger" @click="handleDelete">
            <template #icon><icon-delete /></template>
            删除
          </a-doption>
        </template>
      </a-dropdown>
    </div>

    <!-- 动态内容 -->
    <a-typography-paragraph class="post-content">
      {{ post.content }}
    </a-typography-paragraph>
    
    <!-- 图片展示 -->
    <div v-if="post.images?.length" class="post-images">
      <a-image-preview-group>
        <a-grid :cols="getImageCols(post.images.length)" :col-gap="8" :row-gap="8">
          <a-grid-item v-for="(img, i) in post.images" :key="i">
            <a-image
              :src="img"
              width="100%"
              height="200px"
              fit="cover"
              :preview-props="{
                actionsLayout: ['fullScreen', 'rotateRight', 'rotateLeft', 'zoomIn', 'zoomOut']
              }"
            />
          </a-grid-item>
        </a-grid>
      </a-image-preview-group>
    </div>

    <!-- 话题标签 -->
    <div v-if="post.tags?.length" class="post-tags">
      <a-space wrap>
        <a-tag v-for="tag in post.tags" :key="tag" color="arcoblue">
          #{{ tag }}
        </a-tag>
      </a-space>
    </div>

    <!-- 互动栏 -->
    <a-divider style="margin: 16px 0 8px" />
    <div class="post-actions">
      <a-grid :cols="3">
        <a-grid-item>
          <a-button
            type="text"
            @click="handleLike"
            :class="{ 'action-active': post.isLiked }"
            style="width: 100%"
          >
            <template #icon>
              <icon-heart-fill v-if="post.isLiked" />
              <icon-heart v-else />
            </template>
            {{ post.likeCount || 0 }}
          </a-button>
        </a-grid-item>
        
        <a-grid-item>
          <a-button type="text" @click="handleComment" style="width: 100%">
            <template #icon><icon-message /></template>
            {{ post.commentCount || 0 }}
          </a-button>
        </a-grid-item>
        
        <a-grid-item>
          <a-button type="text" @click="handleShare" style="width: 100%">
            <template #icon><icon-share-alt /></template>
            分享
          </a-button>
        </a-grid-item>
      </a-grid>
    </div>

    <!-- 评论区域（展开时显示） -->
    <div v-if="showComments" class="post-comments">
      <a-divider style="margin: 16px 0" />
      <a-comment
        v-for="comment in post.comments"
        :key="comment.id"
        :author="comment.author.username"
        :avatar="comment.author.avatar"
        :content="comment.content"
        :datetime="formatTime(comment.createdAt)"
      />
      
      <!-- 评论输入框 -->
      <a-comment>
        <template #avatar>
          <a-avatar :src="currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username}`" />
        </template>
        <template #content>
          <a-textarea
            v-model="commentContent"
            placeholder="写下你的评论..."
            :auto-size="{ minRows: 2, maxRows: 4 }"
            style="margin-bottom: 8px"
          />
          <a-button type="primary" size="small" @click="submitComment">
            发布评论
          </a-button>
        </template>
      </a-comment>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Message } from '@arco-design/web-vue'

interface Props {
  post: {
    id: string
    author: {
      id: string
      username: string
      avatar?: string
    }
    content: string
    images?: string[]
    tags?: string[]
    likeCount: number
    commentCount: number
    isLiked: boolean
    createdAt: string | Date
    comments?: any[]
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['update', 'delete'])

const router = useRouter()
const userStore = useUserStore()

const currentUser = computed(() => userStore.user)
const isOwnPost = computed(() => props.post.author.id === currentUser.value?.id)

const showComments = ref(false)
const commentContent = ref('')

// 格式化时间
const formatTime = (date: string | Date) => {
  const now = new Date()
  const postDate = new Date(date)
  const diff = now.getTime() - postDate.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return postDate.toLocaleDateString('zh-CN')
}

// 获取图片列数
const getImageCols = (count: number) => {
  if (count === 1) return 1
  if (count === 2 || count === 4) return 2
  return 3
}

// 点赞
const handleLike = () => {
  if (!currentUser.value) {
    Message.warning('请先登录')
    return
  }
  emit('update', {
    ...props.post,
    isLiked: !props.post.isLiked,
    likeCount: props.post.likeCount + (props.post.isLiked ? -1 : 1)
  })
}

// 评论
const handleComment = () => {
  if (!currentUser.value) {
    Message.warning('请先登录')
    return
  }
  showComments.value = !showComments.value
}

// 分享
const handleShare = () => {
  Message.info('分享功能开发中')
}

// 编辑
const handleEdit = () => {
  Message.info('编辑功能开发中')
}

// 删除
const handleDelete = () => {
  // 暂时使用原生 confirm，后续替换为 Arco Modal
  if (window.confirm('确定要删除这条动态吗？')) {
    emit('delete', props.post.id)
    Message.success('删除成功')
  }
}

// 提交评论
const submitComment = () => {
  if (!commentContent.value.trim()) {
    Message.warning('请输入评论内容')
    return
  }
  Message.success('评论成功')
  commentContent.value = ''
}
</script>

<style scoped lang="less">
.post-card {
  margin-bottom: 16px;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.post-content {
  margin-bottom: 16px;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--color-text-1);
}

.post-images {
  margin-bottom: 16px;
}

.post-tags {
  margin-bottom: 16px;
}

.post-actions {
  .action-active {
    color: var(--color-danger-6);
    
    &:hover {
      color: var(--color-danger-5);
    }
  }
}

.post-comments {
  :deep(.arco-comment) {
    padding: 12px 0;
  }
}

// 响应式
@media (max-width: 768px) {
  .post-card {
    :deep(.arco-card-body) {
      padding: 16px;
    }
  }
}
</style> 