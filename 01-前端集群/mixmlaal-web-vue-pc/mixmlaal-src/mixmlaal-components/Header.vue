<template>
  <header class="header">
    <div class="header-top">
      <div class="container">
        <div class="top-left">
          <span>欢迎来到亿级商城！</span>
        </div>
        <div class="top-right">
          <template v-if="!isLogin">
            <router-link to="/login">登录</router-link>
            <router-link to="/register">注册</router-link>
          </template>
          <template v-else>
            <span class="user-info">{{ nickname }}</span>
            <router-link to="/user">个人中心</router-link>
            <a href="#" @click.prevent="handleLogout">退出</a>
          </template>
        </div>
      </div>
    </div>

    <div class="header-center">
      <div class="container">
        <div class="logo" @click="$router.push('/')">
          <h1>亿级商城</h1>
        </div>
        <div class="search-box">
          <input type="text" v-model="searchKey" placeholder="搜索商品..." @keyup.enter="handleSearch" />
          <button @click="handleSearch">搜索</button>
        </div>
        <div class="header-right">
          <router-link to="/cart" class="cart-btn">
            <span class="cart-icon">🛒</span>
            <span>购物车</span>
            <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="nav-bar">
      <div class="container">
        <div class="nav-list">
          <router-link to="/" :class="{ active: $route.path === '/' }">首页</router-link>
          <router-link to="/goods/list" :class="{ active: $route.path.includes('/goods/list') }">全部商品</router-link>
          <router-link to="/goods/list?category=1">数码产品</router-link>
          <router-link to="/goods/list?category=2">服装鞋帽</router-link>
          <router-link to="/goods/list?category=3">食品饮料</router-link>
          <router-link to="/chat" :class="{ active: $route.path === '/chat' }">
            <el-icon><ChatDotRound /></el-icon>
            聊天
          </router-link>
          <router-link to="/about">关于我们</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()

const searchKey = ref('')
const isLogin = ref(false)
const nickname = ref('用户')
const cartCount = ref(0)

const handleSearch = () => {
  if (searchKey.value.trim()) {
    router.push({ path: '/goods/list', query: { keyword: searchKey.value } })
  }
}

const handleLogout = () => {
  isLogin.value = false
  nickname.value = '用户'
  cartCount.value = 0
  router.push('/')
}
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-top {
  background: #f5f5f5;
  padding: 8px 0;
  font-size: 14px;
}

.header-top .container {
  display: flex;
  justify-content: space-between;
}

.top-right {
  display: flex;
  gap: 20px;
}

.top-right a {
  color: #666;
  text-decoration: none;
}

.user-info {
  color: #333;
}

.header-center {
  padding: 20px 0;
}

.header-center .container {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo h1 {
  font-size: 28px;
  color: #e74c3c;
  margin: 0;
  cursor: pointer;
}

.search-box {
  flex: 1;
  max-width: 600px;
  display: flex;
}

.search-box input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #e74c3c;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 14px;
}

.search-box button {
  padding: 12px 30px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 20px;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  position: relative;
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #e74c3c;
  color: #fff;
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-bar {
  background: #333;
}

.nav-list {
  display: flex;
  gap: 30px;
}

.nav-list a {
  color: #fff;
  text-decoration: none;
  padding: 15px 0;
  display: inline-block;
}

.nav-list a:hover,
.nav-list a.active {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .header-center .container {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .nav-list {
    overflow-x: auto;
    gap: 20px;
  }
}
</style>
