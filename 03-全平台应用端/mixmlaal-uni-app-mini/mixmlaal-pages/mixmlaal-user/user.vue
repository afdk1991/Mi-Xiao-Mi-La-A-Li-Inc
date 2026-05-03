<script setup>
const userInfo = ref({
  nickname: '未登录',
  avatar: ''
})

const orderList = ref([
  { id: 0, name: '全部订单' },
  { id: 1, name: '待付款' },
  { id: 2, name: '待发货' },
  { id: 3, name: '待收货' }
])

const menuList = ref([
  { id: 1, name: '收货地址', icon: 'location' },
  { id: 2, name: '优惠券', icon: 'coupon' },
  { id: 3, name: '收藏夹', icon: 'star' },
  { id: 4, name: '设置', icon: 'settings' }
])

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  })
}

const goToOrder = (index) => {
  uni.showToast({
    title: `查看${orderList.value[index].name}`
  })
}
</script>

<template>
  <view class="user-page">
    <view class="user-header" @click="goToLogin">
      <image class="avatar" src="/static/avatar.jpg" mode="aspectFill" />
      <view class="user-info">
        <text class="nickname">{{ userInfo.nickname }}</text>
        <text class="tip">登录后享受更多权益</text>
      </view>
    </view>

    <view class="order-section">
      <view class="order-header">
        <text class="title">我的订单</text>
        <text class="more" @click="uni.navigateTo({url: '/pages/order/order'})">
          查看全部 >
        </text>
      </view>
      <view class="order-list">
        <view
          class="order-item"
          v-for="(item, index) in orderList"
          :key="item.id"
          @click="goToOrder(index)"
        >
          <text class="order-icon">📋</text>
          <text class="order-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view
        class="menu-item"
        v-for="item in menuList"
        :key="item.id"
        @click="uni.showToast({title: item.name})"
      >
        <text class="menu-icon">📁</text>
        <text class="menu-name">{{ item.name }}</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false
    }
  }
}
</script>

<style scoped>
.user-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50rpx;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 60rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: #fff;
}

.user-info {
  margin-left: 30rpx;
  color: #fff;
}

.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.tip {
  font-size: 24rpx;
  opacity: 0.8;
}

.order-section {
  background: #fff;
  margin-bottom: 20rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.more {
  font-size: 24rpx;
  color: #999;
}

.order-list {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 0;
}

.order-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.order-icon {
  font-size: 50rpx;
  margin-bottom: 10rpx;
}

.order-name {
  font-size: 24rpx;
  color: #666;
}

.menu-section {
  background: #fff;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-name {
  flex: 1;
  font-size: 28rpx;
}

.menu-arrow {
  color: #999;
}
</style>
