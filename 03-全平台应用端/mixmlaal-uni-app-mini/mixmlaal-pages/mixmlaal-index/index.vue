<script setup>
import { ref, onMounted } from 'vue'

const bannerList = ref([
  { id: 1, image: '/static/banner1.jpg' },
  { id: 2, image: '/static/banner2.jpg' }
])

const categoryList = ref([
  { id: 1, name: '数码', icon: 'phone' },
  { id: 2, name: '服装', icon: 'shop' },
  { id: 3, name: '食品', icon: 'gift' },
  { id: 4, name: '图书', icon: 'star' }
])

const goodsList = ref([
  { id: 1, name: '商品1', price: 99.00, image: '/static/goods.jpg' },
  { id: 2, name: '商品2', price: 199.00, image: '/static/goods.jpg' },
  { id: 3, name: '商品3', price: 299.00, image: '/static/goods.jpg' },
  { id: 4, name: '商品4', price: 399.00, image: '/static/goods.jpg' }
])

const goToGoodsDetail = (id) => {
  uni.navigateTo({
    url: `/pages/goods/detail?id=${id}`
  })
}

const goToCart = () => {
  uni.switchTab({
    url: '/pages/cart/cart'
  })
}

onMounted(() => {
  console.log('首页加载')
})
</script>

<template>
  <view class="container">
    <view class="search-bar" @click="uni.navigateTo({url: '/pages/search/search'})">
      <text>搜索商品</text>
    </view>

    <swiper class="banner" indicator-dots autoplay circular>
      <swiper-item v-for="item in bannerList" :key="item.id">
        <image :src="item.image" mode="aspectFill" class="banner-image" />
      </swiper-item>
    </swiper>

    <view class="category-grid">
      <view
        class="category-item"
        v-for="item in categoryList"
        :key="item.id"
      >
        <view class="category-icon">📱</view>
        <text class="category-name">{{ item.name }}</text>
      </view>
    </view>

    <view class="section-title">
      <text class="title">热门商品</text>
      <text class="more" @click="uni.switchTab({url: '/pages/category/category'})">更多 ></text>
    </view>

    <view class="goods-grid">
      <view
        class="goods-item"
        v-for="goods in goodsList"
        :key="goods.id"
        @click="goToGoodsDetail(goods.id)"
      >
        <image :src="goods.image" mode="aspectFill" class="goods-image" />
        <view class="goods-info">
          <text class="goods-name">{{ goods.name }}</text>
          <text class="goods-price">¥{{ goods.price }}</text>
        </view>
        <view class="goods-action">
          <text @click.stop="goToCart">加入购物车</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.search-bar {
  background: #fff;
  padding: 20rpx;
  border-radius: 8rpx;
  text-align: center;
  margin-bottom: 20rpx;
  color: #999;
}

.banner {
  height: 300rpx;
  margin-bottom: 20rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.category-grid {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  font-size: 60rpx;
  margin-bottom: 10rpx;
}

.category-name {
  font-size: 24rpx;
  color: #666;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.more {
  font-size: 24rpx;
  color: #999;
}

.goods-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goods-item {
  width: 48%;
  background: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.goods-image {
  width: 100%;
  height: 300rpx;
}

.goods-info {
  padding: 20rpx;
}

.goods-name {
  display: block;
  font-size: 28rpx;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  color: #ff6b6b;
  font-size: 32rpx;
  font-weight: bold;
}

.goods-action {
  padding: 0 20rpx 20rpx;
}

.goods-action text {
  display: inline-block;
  padding: 10rpx 20rpx;
  background: #007aff;
  color: #fff;
  border-radius: 4rpx;
  font-size: 24rpx;
}
</style>
