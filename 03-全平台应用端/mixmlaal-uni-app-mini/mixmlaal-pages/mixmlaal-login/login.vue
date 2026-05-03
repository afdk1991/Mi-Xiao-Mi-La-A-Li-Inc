<script setup>
const handleLogin = () => {
  uni.showToast({
    title: '登录成功',
    icon: 'success'
  })
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }, 1000)
}
</script>

<template>
  <view class="login-page">
    <view class="logo">
      <text class="logo-text">亿级商城</text>
    </view>

    <view class="login-form">
      <input type="text" placeholder="请输入账号" class="input" v-model="account" />
      <input type="password" placeholder="请输入密码" class="input" v-model="password" />

      <button class="login-btn" @click="handleLogin">登录</button>

      <view class="register-link">
        <text @click="uni.navigateTo({url: '/pages/register/register'})">
          还没有账号？立即注册
        </text>
      </view>
    </view>

    <view class="third-party">
      <text class="divider">其他登录方式</text>
      <view class="third-party-icons">
        <text @click="uni.showToast({title: '微信登录'})">微信</text>
        <text @click="uni.showToast({title: 'QQ登录'})">QQ</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: ''
    }
  }
}
</script>

<style scoped>
.login-page {
  padding: 100rpx 50rpx;
  min-height: 100vh;
  background: #fff;
}

.logo {
  text-align: center;
  margin-bottom: 100rpx;
}

.logo-text {
  font-size: 60rpx;
  font-weight: bold;
  color: #007aff;
}

.login-form {
  margin-bottom: 100rpx;
}

.input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
}

.login-btn {
  width: 100%;
  height: 80rpx;
  background: #007aff;
  color: #fff;
  border-radius: 8rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-link {
  text-align: center;
  margin-top: 30rpx;
}

.register-link text {
  color: #007aff;
  font-size: 28rpx;
}

.third-party {
  text-align: center;
}

.divider {
  display: block;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 30rpx;
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 50rpx;
}

.third-party-icons text {
  padding: 20rpx 40rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  color: #666;
}
</style>
