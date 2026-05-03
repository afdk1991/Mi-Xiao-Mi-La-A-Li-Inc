<template>
  <div class="chat-page">
    <div v-if="!isLoggedIn" class="login-box">
      <el-card>
        <h3>请先登录聊天</h3>
        <el-form :model="loginForm" label-width="80px" style="margin-top: 20px;">
          <el-form-item label="用户名">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" style="width: 100%;">登录聊天</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <div v-else class="chat-container">
      <OnlineUsers
        :users="onlineUsers"
        :current-user-id="currentUser?.id"
        @select="handleSelectUser"
      />
      
      <div class="chat-main">
        <div class="chat-header">
          <div v-if="selectedUser" class="chat-title">
            <el-avatar :size="32">{{ selectedUser.username ? selectedUser.username.substring(0, 2) : '?' }}</el-avatar>
            <span style="margin-left: 10px;">{{ selectedUser.username }}</span>
          </div>
          <div v-else class="chat-title">
            <el-icon><ChatDotRound /></el-icon>
            <span style="margin-left: 8px;">公共聊天</span>
          </div>
          <div class="chat-status">
            <el-tag :type="isConnected ? 'success' : 'danger'" size="small">
              {{ isConnected ? '已连接' : '已断开' }}
            </el-tag>
          </div>
        </div>
        
        <MessageList
          :messages="messages"
          :current-user-id="currentUser?.id"
        />
        
        <ChatInput @send="handleSendMessage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatDotRound } from '@element-plus/icons-vue'
import OnlineUsers from '@/components/OnlineUsers.vue'
import MessageList from '@/components/MessageList.vue'
import ChatInput from '@/components/ChatInput.vue'
import { useSocketIO } from '@/utils/socketio'

const router = useRouter()
const {
  isConnected,
  onlineUsers,
  messages,
  currentUser,
  connect,
  sendMessage,
  disconnect
} = useSocketIO()

const isLoggedIn = ref(false)
const loginForm = ref({
  username: ''
})
const selectedUser = ref(null)

const handleLogin = async () => {
  if (!loginForm.value.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  
  const userId = 'user_' + Date.now()
  try {
    await connect(userId, loginForm.value.username)
    isLoggedIn.value = true
    ElMessage.success('登录聊天成功！')
  } catch (error) {
    ElMessage.error('连接失败，请检查后端服务是否启动')
  }
}

const handleSelectUser = (user) => {
  selectedUser.value = user
}

const handleSendMessage = (content) => {
  if (selectedUser.value) {
    sendMessage(content, selectedUser.value.id, 'private')
  } else {
    sendMessage(content, null, 'group')
  }
}

onMounted(() => {
})

onUnmounted(() => {
  disconnect()
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px;
}

.login-box h3 {
  text-align: center;
  margin: 0;
}

.chat-container {
  display: flex;
  height: 100vh;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.chat-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.chat-title {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
}

.chat-status {
  display: flex;
  align-items: center;
}
</style>