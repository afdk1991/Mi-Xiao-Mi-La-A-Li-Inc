<script setup>
const cartList = ref([
  { id: 1, name: '商品1', price: 99.00, num: 1, checked: true },
  { id: 2, name: '商品2', price: 199.00, num: 2, checked: true }
])

const totalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => {
    if (item.checked) {
      return sum + item.price * item.num
    }
    return sum
  }, 0)
})

const allChecked = ref(true)

const toggleAll = () => {
  cartList.value.forEach(item => {
    item.checked = !allChecked.value
  })
}

const updateNum = (item, type) => {
  if (type === 'add') {
    item.num++
  } else if (type === 'reduce' && item.num > 1) {
    item.num--
  }
}

const deleteItem = (index) => {
  cartList.value.splice(index, 1)
}

const checkout = () => {
  uni.showToast({
    title: '提交订单成功',
    icon: 'success'
  })
}
</script>

<template>
  <view class="cart-page">
    <view class="cart-header">
      <text class="title">购物车</text>
      <text class="edit" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</text>
    </view>

    <view class="cart-list" v-if="cartList.length > 0">
      <view
        class="cart-item"
        v-for="(item, index) in cartList"
        :key="item.id"
      >
        <checkbox
          :checked="item.checked"
          @click="item.checked = !item.checked"
        />
        <image src="/static/goods.jpg" mode="aspectFill" class="item-image" />
        <view class="item-info">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-price">¥{{ item.price }}</text>
          <view class="item-num">
            <text @click="updateNum(item, 'reduce')">-</text>
            <text class="num">{{ item.num }}</text>
            <text @click="updateNum(item, 'add')">+</text>
          </view>
        </view>
        <text class="delete" @click="deleteItem(index)">删除</text>
      </view>
    </view>

    <view class="empty" v-else>
      <text>购物车是空的</text>
      <button @click="uni.switchTab({url: '/pages/index/index'})">去购物</button>
    </view>

    <view class="cart-footer" v-if="cartList.length > 0">
      <view class="select-all" @click="toggleAll">
        <checkbox :checked="allChecked" />
        <text>全选</text>
      </view>
      <view class="total">
        <text>合计：</text>
        <text class="total-price">¥{{ totalPrice }}</text>
      </view>
      <button class="checkout-btn" @click="checkout">结算</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isEdit: false
    }
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100rpx;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: #fff;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.edit {
  color: #007aff;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.item-image {
  width: 160rpx;
  height: 160rpx;
  margin-left: 20rpx;
  border-radius: 8rpx;
}

.item-info {
  flex: 1;
  margin-left: 20rpx;
}

.item-name {
  display: block;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.item-price {
  color: #ff6b6b;
  font-weight: bold;
}

.item-num {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.item-num text {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
}

.num {
  margin: 0 20rpx;
}

.delete {
  color: #ff6b6b;
  font-size: 24rpx;
}

.empty {
  text-align: center;
  padding: 200rpx 0;
}

.empty button {
  margin-top: 30rpx;
  background: #007aff;
  color: #fff;
  width: 200rpx;
}

.cart-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 1px solid #eee;
}

.select-all {
  display: flex;
  align-items: center;
}

.select-all text {
  margin-left: 10rpx;
}

.total {
  flex: 1;
  text-align: right;
  margin-right: 20rpx;
}

.total-price {
  color: #ff6b6b;
  font-size: 32rpx;
  font-weight: bold;
}

.checkout-btn {
  width: 200rpx;
  height: 70rpx;
  background: #007aff;
  color: #fff;
  border-radius: 35rpx;
  font-size: 28rpx;
}
</style>
