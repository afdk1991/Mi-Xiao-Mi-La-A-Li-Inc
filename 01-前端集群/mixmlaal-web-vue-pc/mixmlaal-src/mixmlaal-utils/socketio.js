import { ref } from 'vue'
import { io } from 'socket.io-client'

const socket = ref(null)
const isConnected = ref(false)
const onlineUsers = ref([])
const messages = ref([])
const currentUser = ref(null)

export function useSocketIO() {
  const connect = (userId, username, avatar = '') => {
    return new Promise((resolve, reject) => {
      try {
        socket.value = io('http://localhost:8003', {
          path: '/im',
          transports: ['websocket', 'polling']
        })
        
        socket.value.on('connect', () => {
          console.log('Socket.IO 连接成功')
          isConnected.value = true
          
          socket.value.emit('login', { userId, username, avatar })
        })
        
        socket.value.on('loginSuccess', (data) => {
          currentUser.value = data.user
          onlineUsers.value = data.onlineUsers
          if (data.messageHistory) {
            messages.value = data.messageHistory
          }
          resolve()
        })
        
        socket.value.on('userOnline', (data) => {
          const exists = onlineUsers.value.find(u => u.id === data.user.id)
          if (!exists) {
            onlineUsers.value.push(data.user)
          }
        })
        
        socket.value.on('userOffline', (data) => {
          onlineUsers.value = onlineUsers.value.filter(u => u.id !== data.userId)
        })
        
        socket.value.on('newMessage', (data) => {
          messages.value.push(data)
        })
        
        socket.value.on('newGroupMessage', (data) => {
          messages.value.push(data)
        })
        
        socket.value.on('messageSent', (data) => {
          messages.value.push(data.message)
        })
        
        socket.value.on('userTyping', (data) => {
          console.log('对方正在输入:', data)
        })
        
        socket.value.on('disconnect', () => {
          console.log('Socket.IO 连接关闭')
          isConnected.value = false
        })
        
        socket.value.on('error', (error) => {
          console.error('Socket.IO 错误:', error)
          reject(error)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
  
  const sendMessage = (content, to = null, type = 'private') => {
    if (socket.value) {
      socket.value.emit('sendMessage', { content, to, type })
    }
  }
  
  const sendGroupMessage = (groupId, content) => {
    if (socket.value) {
      socket.value.emit('sendGroupMessage', { groupId, content })
    }
  }
  
  const getOnlineUsers = () => {
    if (socket.value) {
      socket.value.emit('getOnlineUsers')
    }
  }
  
  const joinGroup = (groupId) => {
    if (socket.value) {
      socket.value.emit('joinGroup', { groupId })
    }
  }
  
  const leaveGroup = (groupId) => {
    if (socket.value) {
      socket.value.emit('leaveGroup', { groupId })
    }
  }
  
  const markAsRead = (messageId) => {
    if (socket.value) {
      socket.value.emit('markAsRead', { messageId })
    }
  }
  
  const typing = (to, isTyping) => {
    if (socket.value) {
      socket.value.emit('typing', { to, isTyping })
    }
  }
  
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }
  
  return {
    socket,
    isConnected,
    onlineUsers,
    messages,
    currentUser,
    connect,
    sendMessage,
    sendGroupMessage,
    getOnlineUsers,
    joinGroup,
    leaveGroup,
    markAsRead,
    typing,
    disconnect
  }
}