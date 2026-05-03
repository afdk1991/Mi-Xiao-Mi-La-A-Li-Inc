<template>
  <div class="chat-input">
    <el-input
      v-model="inputMessage"
      type="textarea"
      :rows="2"
      placeholder="请输入消息..."
      @keydown.enter="handleKeyDown"
      resize="none"
    />
    <div class="input-actions">
      <el-button type="primary" @click="handleSend" :disabled="!inputMessage.trim()">
        <el-icon><Promotion /></el-icon>
        发送
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Promotion } from '@element-plus/icons-vue'

const inputMessage = ref('')

const emit = defineEmits(['send'])

const handleKeyDown = (event) => {
  if (!event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

const handleSend = () => {
  if (inputMessage.value.trim()) {
    emit('send', inputMessage.value)
    inputMessage.value = ''
  }
}
</script>

<style scoped>
.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  background: #fff;
}

.input-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>