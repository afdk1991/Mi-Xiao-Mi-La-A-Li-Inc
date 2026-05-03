<template>
  <div class="user-center-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="user-profile">
            <el-avatar :size="80" :icon="UserFilled" />
            <h3>{{ userInfo?.nickname || '用户' }}</h3>
            <p>ID: {{ userInfo?.id || '-' }}</p>
          </div>
          <el-menu :default-active="activeMenu">
            <el-menu-item index="1">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><ShoppingBag /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><Setting /></el-icon>
              <span>账号设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
          <el-form :model="userForm" label-width="100px" style="max-width: 500px;">
            <el-form-item label="账号">
              <el-input v-model="userForm.account" disabled />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="userForm.nickname" />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="userForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserInfo">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>账户余额</span>
            </div>
          </template>
          <div class="balance-info">
            <p class="balance">¥{{ balance }}</p>
            <div class="balance-action">
              <el-button type="primary">充值</el-button>
            </div>
          </div>
        </el-card>

        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>数据概览</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover">
                <el-statistic title="订单数" :value="stats.orders" />
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <el-statistic title="收藏数" :value="stats.favorites" />
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <el-statistic title="积分" :value="stats.points" />
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled, User, ShoppingBag, Star, Setting } from '@element-plus/icons-vue'

const router = useRouter()

const activeMenu = ref('1')

const userInfo = computed(() => {
  const user = localStorage.getItem('userInfo')
  return user ? JSON.parse(user) : null
})

const userForm = ref({
  account: '',
  nickname: '',
  phone: '',
  email: ''
})

const balance = ref('100.00')

const stats = ref({
  orders: 12,
  favorites: 56,
  points: 2000
})

const saveUserInfo = () => {
  const savedUser = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const updatedUser = { ...savedUser, ...userForm.value }
  localStorage.setItem('userInfo', JSON.stringify(updatedUser))
  ElMessage.success('保存成功')
}

onMounted(() => {
  if (userInfo.value) {
    userForm.value.account = userInfo.value.account
    userForm.value.nickname = userInfo.value.nickname
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
.user-profile {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.user-profile h3 {
  margin-top: 15px;
}
.balance-info {
  text-align: center;
  padding: 30px 0;
}
.balance {
  font-size: 36px;
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
