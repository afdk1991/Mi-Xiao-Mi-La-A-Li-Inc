<template>
  <div class="user-page">
    <div class="container">
      <div class="user-layout">
        <div class="user-sidebar">
          <div class="user-info">
            <div class="avatar-icon">👤</div>
            <div class="username">用户用户</div>
            <div class="level">VIP会员</div>
          </div>
          <div class="user-menu">
            <div 
              v-for="menu in userMenus"
              :key="menu.id"
              :class="{ active: activeMenu === menu.id"
              @click="activeMenu = menu.id"
            >
              <span class="menu-icon">{{ menu.icon }}</span>
              <span>{{ menu.name }}</span>
            </div>
          </div>
        </div>
        
        <div class="user-content">
          <div v-if="activeMenu === 'profile'" class="profile-section">
            <h3>个人信息</h3>
            <div class="form-group">
              <label>用户名</label>
              <input type="text" value="用户用户" disabled />
            </div>
            <div class="form-group">
              <label>手机号</label>
              <input type="text" value="13800138000" disabled />
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" value="user@example.com" disabled />
            </div>
            <div class="form-group">
              <label>注册时间</label>
              <input type="text" value="2024-01-01 10:00:00" disabled />
            </div>
          </div>
          
          <div v-else-if="activeMenu === 'address'" class="address-section">
            <h3>收货地址</h3>
            <div class="address-list">
              <div class="address-item" v-for="addr in addressList" :key="addr.id">
                <div class="address-info">
                  <span class="name">{{ addr.name }}</span>
                  <span class="phone">{{ addr.phone }}</span>
                  <span class="address">{{ addr.address }}</span>
                </div>
                <div class="address-actions">
                  <button>编辑</button>
                  <button>删除</button>
                </div>
              </div>
            </div>
            <button class="add-address-btn">添加新地址</button>
          </div>
          
          <div v-else-if="activeMenu === 'security'" class="security-section">
            <h3>账号安全</h3>
            <div class="security-list">
              <div class="security-item">
                <div class="security-info">
                  <div class="label">登录密码</div>
                  <div class="desc">定期更换密码，更安全</div>
                </div>
                <button>修改</button>
              </div>
              <div class="security-item">
                <div class="security-info">
                  <div class="label">手机绑定</div>
                  <div class="desc">已绑定手机：13800138000</div>
                </div>
                <button>更换</button>
              </div>
              <div class="security-item">
                <div class="security-info">
                  <div class="label">实名认证</div>
                  <div class="desc">已完成实名认证</div>
                </div>
                <button class="completed-btn">已认证</button>
              </div>
            </div>
          </div>
          
          <div v-else class="profile-section">
            <h3>我的订单</h3>
            <div class="order-summary">
              <div class="summary-item">
                <span class="number">12</span>
                <span>全部订单</span>
              </div>
              <div class="summary-item">
                <span class="number">2</span>
                <span>待付款</span>
              </div>
              <div class="summary-item">
                <span class="number">1</span>
                <span>待收货</span>
              </div>
              <div class="summary-item">
                <span class="number">9</span>
                <span>已完成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userMenus = ref([
  { id: 'profile', name: '个人信息', icon: '👤' },
  { id: 'order', name: '我的订单', icon: '📦' },
  { id: 'address', name: '收货地址', icon: '📍' },
  { id: 'security', name: '账号安全', icon: '🔐' }
])

const activeMenu = ref('profile')

const addressList = ref([
  { id: 1, name: '张三', phone: '13800138000', address: '北京市海淀区西二旗大街100号' },
  { id: 2, name: '李四', phone: '13900139000', address: '上海市浦东新区张江高科技园区科苑路100号' }
])
</script>

<style scoped>
.user-page {
  padding: 20px 0;
}

.user-layout {
  display: flex;
  gap: 30px;
}

.user-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.user-info {
  background: #667eea;
  color: #fff;
  padding: 30px 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.avatar-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.username {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.level {
  font-size: 14px;
  opacity: 0.9;
}

.user-menu {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.user-menu div {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-menu div:last-child {
  border-bottom: none;
}

.user-menu div:hover,
.user-menu div.active {
  background: #f5f5f5;
  color: #667eea;
}

.user-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 30px;
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  max-width: 400px;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #f5f5f5;
}

.address-list {
  margin-bottom: 20px;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 15px;
}

.address-info {
  flex: 1;
}

.address-info .name {
  font-weight: 600;
  margin-right: 15px;
}

.address-info .phone {
  color: #666;
  margin-right: 15px;
}

.address-info .address {
  color: #666;
  display: block;
  margin-top: 5px;
}

.address-actions button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  color: #333;
  margin-left: 10px;
  cursor: pointer;
}

.add-address-btn {
  padding: 12px 30px;
  border: 1px dashed #667eea;
  background: #fff;
  color: #667eea;
  border-radius: 4px;
  cursor: pointer;
}

.security-list {
  max-width: 600px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 15px;
}

.security-info .label {
  font-weight: 600;
  color: #333;
}

.security-info .desc {
  color: #666;
  font-size: 13px;
  margin-top: 5px;
}

.security-item button {
  padding: 10px 25px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
}

.completed-btn {
  border-color: #4caf50;
  background: #4caf50;
  color: #fff;
}

.order-summary {
  display: flex;
  gap: 40px;
  max-width: 500px;
}

.summary-item {
  text-align: center;
  cursor: pointer;
}

.summary-item .number {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: #667eea;
}

.summary-item span:last-child {
  color: #666;
  font-size: 14px;
}
</style>
