import { ref, reactive } from 'vue'

const socket = ref(null)
const isConnected = ref(false)
const onlineUsers = ref([])
const messages = ref([])
const currentUser = ref(null)

export function useWebSocket() {
  const connect = (userId, username, avatar = '') => {
    return new Promise((resolve, reject) => {
      try {
        socket.value = new WebSocket(`ws://localhost:8003/im`)
        
        socket.value.onopen = () => {
          console.log('WebSocket 连接成功')
          isConnected.value = true
          
          send('login', { userId, username, avatar })
        }
        
        socket.value.onmessage = (event) => {
          const data = JSON.parse(event.data)
          handleMessage(data)
        }
        
        socket.value.onclose = () => {
          console.log('WebSocket 连接关闭')
          isConnected.value = false
        }
        
        socket.value.onerror = (error) => {
          console.error('WebSocket 错误:', error)
          reject(error)
        }
        
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
  
  const send = (event, data) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify({ event, data }))
    }
  }
  
  const handleMessage = (data) => {
    switch (data.event) {
      case 'loginSuccess':
        currentUser.value = data.user
        onlineUsers.value = data.onlineUsers
        if (data.messageHistory) {
          messages.value = data.messageHistory
        }
        break
      case 'userOnline':
        const exists = onlineUsers.value.find(u => u.id === data.user.id)
        if (!exists) {
          onlineUsers.value.push(data.user)
        }
        break
      case 'userOffline':
        onlineUsers.value = onlineUsers.value.filter(u => u.id !== data.userId)
        break
      case 'newMessage':
      case 'newGroupMessage':
        messages.value.push(data)
        break
      case 'messageSent':
        messages.value.push(data.message)
        break
      case 'userTyping':
        console.log('对方正在输入:', data)
        break
    }
  }
  
  const sendMessage = (content, to = null, type = 'private') => {
    send('sendMessage', { content, to, type })
  }
  
  const sendGroupMessage = (groupId, content) => {
    send('sendGroupMessage', { groupId, content })
  }
  
  const getOnlineUsers = () => {
    send('getOnlineUsers', {})
  }
  
  const joinGroup = (groupId) => {
    send('joinGroup', { groupId })
  }
  
  const leaveGroup = (groupId) => {
    send('leaveGroup', { groupId })
  }
  
  const markAsRead = (messageId) => {
    send('markAsRead', { messageId })
  }
  
  const typing = (to, isTyping) => {
    send('typing', { to, isTyping })
  }
  
  const disconnect = () => {
    if (socket.value) {
      socket.value.close()
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
    send,
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