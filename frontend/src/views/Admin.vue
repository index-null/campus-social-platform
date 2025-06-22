<template>
  <AppLayout :show-search="false">
    <div class="admin-container">
      <a-page-header title="管理后台" subtitle="用户与数据管理">
        <template #extra>
          <a-space>
            <a-button @click="refreshData">
              <template #icon><icon-refresh /></template>
              刷新数据
            </a-button>
            <a-button type="primary" @click="showCreateModal = true">
              <template #icon><icon-plus /></template>
              创建用户
            </a-button>
          </a-space>
        </template>
      </a-page-header>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 20px">
        <a-col :span="6">
          <a-card>
            <a-statistic
              title="总用户数"
              :value="stats.totalUsers"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <icon-user />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic
              title="活跃用户"
              :value="stats.activeUsers"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <icon-fire />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic
              title="今日新用户"
              :value="stats.todayNewUsers"
              :value-style="{ color: '#fa541c' }"
            >
              <template #prefix>
                <icon-file />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <a-statistic
              title="管理员数"
              :value="stats.adminUsers"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <icon-crown />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <!-- 用户管理表格 -->
      <a-card title="用户管理" :bordered="false">
        <template #extra>
          <a-input-search
            v-model="searchKeyword"
            placeholder="搜索用户名、学号、邮箱"
            style="width: 250px"
            @search="handleSearch"
          />
        </template>

        <a-table
          :columns="columns"
          :data="users"
          :loading="loading"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: ['10', '20', '50'],
            showJumper: true
          }"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        >
          <template #avatar="{ record }">
            <a-avatar :src="getAvatarUrl(record)" :size="40" />
          </template>

          <template #role="{ record }">
            <a-tag :color="record.role === 'admin' ? 'red' : 'blue'">
              {{ record.role === 'admin' ? '管理员' : '普通用户' }}
            </a-tag>
          </template>

          <template #isActive="{ record }">
            <a-tag :color="record.isActive ? 'green' : 'gray'">
              {{ record.isActive ? '活跃' : '禁用' }}
            </a-tag>
          </template>

          <template #lastActiveAt="{ record }">
            {{ formatTime(record.lastActiveAt) }}
          </template>

          <template #createdAt="{ record }">
            {{ formatDate(record.createdAt) }}
          </template>

          <template #actions="{ record }">
            <a-space>
              <a-button size="small" @click="editUser(record)">
                <template #icon><icon-edit /></template>
                编辑
              </a-button>
              <a-button 
                size="small" 
                :type="record.isActive ? 'secondary' : 'primary'"
                @click="toggleUserStatus(record)"
              >
                {{ record.isActive ? '禁用' : '启用' }}
              </a-button>
              <a-popconfirm
                content="确定要删除这个用户吗？此操作不可恢复。"
                @ok="deleteUser(record)"
              >
                <a-button size="small" status="danger">
                  <template #icon><icon-delete /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </a-card>
    </div>

    <!-- 编辑用户弹窗 -->
    <a-modal
      v-model:visible="showEditModal"
      :title="editingUser ? '编辑用户' : '创建用户'"
      width="600px"
      @ok="handleSaveUser"
      @cancel="resetEditForm"
      :ok-loading="saving"
    >
      <a-form :model="editForm" layout="vertical" ref="formRef">
        <a-form-item label="学号" field="studentId" :rules="[{ required: true, message: '请输入学号' }]">
          <a-input v-model="editForm.studentId" placeholder="请输入学号" :disabled="!!editingUser" />
        </a-form-item>

        <a-form-item label="用户名" field="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model="editForm.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="昵称" field="nickname">
          <a-input v-model="editForm.nickname" placeholder="请输入昵称（可选）" />
        </a-form-item>

        <a-form-item label="邮箱" field="email" :rules="[{ required: true, message: '请输入邮箱' }]">
          <a-input v-model="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>

        <a-form-item v-if="!editingUser" label="密码" field="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model="editForm.password" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item label="个人简介" field="bio">
          <a-textarea v-model="editForm.bio" placeholder="请输入个人简介" :max-length="200" show-word-limit />
        </a-form-item>

        <a-form-item label="兴趣标签" field="interests">
          <a-select v-model="editForm.interests" placeholder="选择兴趣标签" multiple allow-create>
            <a-option v-for="tag in interestOptions" :key="tag" :value="tag">
              {{ tag }}
            </a-option>
          </a-select>
        </a-form-item>

        <a-form-item label="角色" field="role">
          <a-radio-group v-model="editForm.role">
            <a-radio value="user">普通用户</a-radio>
            <a-radio value="admin">管理员</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="状态" field="isActive">
          <a-switch v-model="editForm.isActive" checked-text="启用" unchecked-text="禁用" />
        </a-form-item>
      </a-form>
    </a-modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { getAvatarUrl } from '@/utils/avatar'
import { 
  getAdminStats as fetchAdminStats, 
  getUsers as fetchUsers, 
  createUser as createUserAPI, 
  updateUser as updateUserAPI, 
  deleteUser as deleteUserAPI, 
  toggleUserStatus as toggleUserStatusAPI 
} from '@/api/admin'
import AppLayout from '@/components/AppLayout.vue'

// 状态管理
const loading = ref(false)
const saving = ref(false)
const showEditModal = ref(false)
const showCreateModal = ref(false)
const editingUser = ref<any>(null)
const searchKeyword = ref('')
const formRef = ref()

// 统计数据
const stats = reactive({
  totalUsers: 0,
  activeUsers: 0,
  todayNewUsers: 0,
  adminUsers: 0
})

// 用户列表
const users = ref<any[]>([])

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showPageSize: true
})

// 表格列配置
const columns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    slotName: 'avatar',
    width: 80
  },
  {
    title: '学号',
    dataIndex: 'studentId',
    width: 120
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 200
  },
  {
    title: '角色',
    dataIndex: 'role',
    slotName: 'role',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'isActive',
    slotName: 'isActive',
    width: 80
  },
  {
    title: '最后活跃',
    dataIndex: 'lastActiveAt',
    slotName: 'lastActiveAt',
    width: 120
  },
  {
    title: '注册时间',
    dataIndex: 'createdAt',
    slotName: 'createdAt',
    width: 120
  },
  {
    title: '操作',
    slotName: 'actions',
    width: 200,
    fixed: 'right'
  }
]

// 编辑表单
const editForm = reactive({
  studentId: '',
  username: '',
  nickname: '',
  email: '',
  password: '',
  bio: '',
  interests: [],
  role: 'user',
  isActive: true
})

// 兴趣选项
const interestOptions = [
  '编程', '音乐', '电影', '阅读', '运动',
  '游戏', '摄影', '美食', '旅行', '学习',
  '设计', '创业', '科技', '艺术', '动漫'
]

// 初始化
onMounted(() => {
  loadUsers()
  loadStats()
})

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await fetchUsers({
      page: pagination.current,
      limit: pagination.pageSize,
      search: searchKeyword.value
    })
    
    console.log('用户列表响应:', response)
    
    const data = response as any
    if (data && data.success) {
      // 处理MongoDB的_id字段，转换为id
      const userData = data.data?.map((user: any) => ({
        ...user,
        id: user._id || user.id  // 确保有id字段
      })) || []
      
      users.value = userData
      console.log('处理后的用户数据:', userData)
      
      if (data.pagination) {
        pagination.total = data.pagination.total
        console.log('分页信息:', data.pagination)
      }
    } else {
      users.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('加载用户失败:', error)
    Message.error('加载用户失败')
    users.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await fetchAdminStats()
    console.log('完整响应:', response)
    
    const data = response as any
    if (data && data.success && data.stats) {
      console.log('更新统计数据:', data.stats)
      // 直接赋值确保响应式更新
      const statsData = data.stats
      stats.totalUsers = statsData.totalUsers || 0
      stats.activeUsers = statsData.activeUsers || 0
      stats.todayNewUsers = statsData.todayNewUsers || 0
      stats.adminUsers = statsData.adminUsers || 0
      console.log('更新后的stats:', stats)
    } else {
      console.error('统计数据格式错误:', data)
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    Message.error('加载统计数据失败')
  }
}

// 刷新数据
const refreshData = () => {
  loadUsers()
  loadStats()
}

// 搜索处理
const handleSearch = () => {
  pagination.current = 1
  loadUsers()
}

// 分页处理
const handlePageChange = (page: number) => {
  pagination.current = page
  loadUsers()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.current = 1
  loadUsers()
}

// 编辑用户
const editUser = (user: any) => {
  editingUser.value = user
  editForm.studentId = user.studentId
  editForm.username = user.username
  editForm.nickname = user.nickname || ''
  editForm.email = user.email
  editForm.password = ''
  editForm.bio = user.bio || ''
  editForm.interests = user.interests || []
  editForm.role = user.role
  editForm.isActive = user.isActive
  showEditModal.value = true
}

// 创建用户
const createUser = () => {
  editingUser.value = null
  resetEditForm()
  showEditModal.value = true
}

// 监听创建用户状态变化
watch(() => showCreateModal.value, (val) => {
  if (val) {
    createUser()
    showCreateModal.value = false
  }
})

// 保存用户
const handleSaveUser = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return

  saving.value = true
  try {
    if (editingUser.value) {
      // 更新用户
      const response = await updateUserAPI(editingUser.value.id, {
        username: editForm.username,
        nickname: editForm.nickname,
        email: editForm.email,
        bio: editForm.bio,
        interests: editForm.interests,
        role: editForm.role,
        isActive: editForm.isActive
      })
      
      const data = response as any
      if (data && data.user) {
        // 更新本地数据
        const index = users.value.findIndex(u => u.id === editingUser.value.id)
        if (index !== -1) {
          users.value[index] = data.user
        }
      }
      Message.success('用户更新成功')
    } else {
      // 创建用户
      const response = await createUserAPI({
        studentId: editForm.studentId,
        username: editForm.username,
        nickname: editForm.nickname,
        email: editForm.email,
        password: editForm.password,
        bio: editForm.bio,
        interests: editForm.interests,
        role: editForm.role,
        isActive: editForm.isActive
      })
      
      const data = response as any
      if (data && data.user) {
        users.value.unshift(data.user)
        pagination.total++
      }
      Message.success('用户创建成功')
    }
    
    showEditModal.value = false
    loadStats()
  } catch (error: any) {
    console.error('保存用户失败:', error)
    Message.error(error.message || '操作失败')
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetEditForm = () => {
  editForm.studentId = ''
  editForm.username = ''
  editForm.nickname = ''
  editForm.email = ''
  editForm.password = ''
  editForm.bio = ''
  editForm.interests = []
  editForm.role = 'user'
  editForm.isActive = true
}

// 切换用户状态
const toggleUserStatus = async (user: any) => {
  try {
    const response = await toggleUserStatusAPI(user.id)
    
    const data = response as any
    if (data && data.user) {
      user.isActive = data.user.isActive
      Message.success(`用户已${user.isActive ? '启用' : '禁用'}`)
      loadStats()
    }
  } catch (error: any) {
    console.error('切换用户状态失败:', error)
    Message.error(error.message || '操作失败')
  }
}

// 删除用户
const deleteUser = async (user: any) => {
  try {
    await deleteUserAPI(user.id)
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value.splice(index, 1)
      pagination.total--
    }
    
    Message.success('用户删除成功')
    loadStats()
  } catch (error: any) {
    console.error('删除用户失败:', error)
    Message.error(error.response?.data?.message || '删除失败')
  }
}

// 格式化时间
const formatTime = (date: any) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDate = (date: any) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped lang="less">
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

:deep(.arco-table) {
  .arco-table-cell {
    vertical-align: middle;
  }
}

:deep(.arco-page-header) {
  margin-bottom: 20px;
}

// 响应式处理
@media (max-width: 768px) {
  .admin-container {
    padding: 16px;
  }
  
  :deep(.arco-col) {
    margin-bottom: 16px;
  }
}
</style> 