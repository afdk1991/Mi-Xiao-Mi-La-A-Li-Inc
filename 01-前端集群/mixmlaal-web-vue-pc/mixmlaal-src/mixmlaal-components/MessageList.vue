<template>
  <div class="message-list" ref="messageListRef">
    <div
      v-for="msg in messages"
      :key="msg.id"
      :class="['message-item', { 'message-self': isSelf(msg) }]"
    >
      <div class="message-avatar">
        <el-avatar :size="40">{{ getAvatarText(msg) }}</el-avatar>
      </div>
      <div class="message-content">
        <div class="message-info">
          <span class="message-sender">{{ getSenderName(msg) }}</span>
          <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div class="message-bubble">{{ msg.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  currentUserId: {
    type: String,
    default: ''
  }
})

const messageListRef = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

const isSelf = (msg) => {
  return msg.from === props.currentUserId
}

const getAvatarText = (msg) => {
  return msg.from ? msg.from.substring(0, 2) : '?'
}

const getSenderName = (msg) => {
  return msg.from || '未知用户'
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

watch(() => props.messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f5f5f5;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.message-self {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 10px;
  flex-shrink: 0;
}

.message-content {
  max-width: 60%;
}

.message-self .message-content {
  text-align: right;
}

.message-info {
  margin-bottom: 5px;
  font-size: 12px;
  color: #999;
}

.message-sender {
  margin-right: 10px;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 8px;
  background: #fff;
  word-wrap: break-word;
  line-height: 1.5;
}

.message-self .message-bubble {
  background: #667eea;
  color: #fff;
}
</style>