<template>
  <div class="online-users">
    <div class="users-header">
      <span class="users-title">在线用户 ({{ users.length }})</span>
      <el-tag type="success" size="small">实时</el-tag>
    </div>
    <div class="users-list">
      <div
        v-for="user in users"
        :key="user.id"
        :class="['user-item', { 'user-active': selectedUserId === user.id }]"
        @click="selectUser(user)"
      >
        <div class="user-avatar">
          <el-avatar :size="36">{{ user.username ? user.username.substring(0, 2) : '?' }}</el-avatar>
          <span class="online-dot"></span>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user.username }}</div>
          <div class="user-status">在线</div>
        </div>
      </div>
      <div v-if="users.length === 0" class="no-users">
        <el-empty description="暂无在线用户" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  currentUserId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

const selectedUserId = ref(null)

const selectUser = (user) => {
  selectedUserId.value = user.id
  emit('select', user)
}
</script>

<style scoped>
.online-users {
  width: 280px;
  border-right: 1px solid #eee;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.users-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.users-title {
  font-weight: bold;
  font-size: 16px;
}

.users-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: background 0.2s;
}

.user-item:hover {
  background: #f5f5f5;
}

.user-active {
  background: #e8f0fe !important;
}

.user-avatar {
  position: relative;
  margin-right: 12px;
}

.online-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #67c23a;
  border-radius: 50%;
  border: 2px solid #fff;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  margin-bottom: 3px;
}

.user-status {
  font-size: 12px;
  color: #999;
}

.no-users {
  padding: 40px 0;
}
</style>