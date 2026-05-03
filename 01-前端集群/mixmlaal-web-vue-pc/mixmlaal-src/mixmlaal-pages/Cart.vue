<template>
  <div class="cart-page">
    <div class="container">
      <h2 class="page-title">我的购物车</h2>
      
      <div class="cart-content" v-if="cartList.length > 0">
        <div class="cart-header">
          <div class="col-check">
            <label><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />全选</label>
          </div>
          <div class="col-goods">商品信息</div>
          <div class="col-price">单价</div>
          <div class="col-num">数量</div>
          <div class="col-total">小计</div>
          <div class="col-action">操作</div>
        </div>
        
        <div class="cart-item" v-for="item in cartList" :key="item.id">
          <div class="col-check">
            <input type="checkbox" v-model="item.selected" @change="updateSelection" />
          </div>
          <div class="col-goods">
            <div class="goods-item">
              <span class="goods-icon">{{ item.imageIcon }}</span>
              <span class="goods-name">{{ item.name }}</span>
            </div>
          </div>
          <div class="col-price">¥{{ item.price }}</div>
          <div class="col-num">
            <div class="num-control">
              <button @click="decreaseNum(item.id)">-</button>
              <span>{{ item.num }}</span>
              <button @click="increaseNum(item.id)">+</button>
            </div>
          </div>
          <div class="col-total">¥{{ getSubtotal(item).toFixed(2) }}</div>
          <div class="col-action">
            <button class="remove-btn" @click="removeItem(item.id)">删除</button>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="footer-left">
            <label><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />全选</label>
            <button class="remove-selected" @click="removeSelected">删除选中</button>
          </div>
          <div class="footer-right">
            <span class="selected-count">已选 {{ selectedCount }} 件</span>
            <span class="total-price">合计：<strong>¥{{ totalPrice.toFixed(2) }}</strong></span>
            <button class="checkout-btn" @click="checkout">去结算</button>
          </div>
        </div>
      </div>
      
      <div class="cart-empty" v-else>
        <div class="empty-icon">🛒</div>
        <p>购物车空空如也~</p>
        <router-link to="/" class="go-shopping">去逛逛</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const cartList = ref([
  { id: 1, name: 'iPhone 15 Pro Max', price: 9999, num: 1, selected: true, imageIcon: '📱' },
  { id: 2, name: 'AirPods Pro 2', price: 1799, num: 2, selected: true, imageIcon: '🎧' },
  { id: 3, name: 'Apple Watch Series 9', price: 3199, num: 1, selected: false, imageIcon: '⌚' }
])

const selectAll = ref(true)

const selectedCount = computed(() => {
  return cartList.value.filter(item => item.selected).length
})

const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.price * item.num), 0)
})

const toggleSelectAll = () => {
  cartList.value.forEach(item => {
    item.selected = selectAll.value
  })
}

const updateSelection = () => {
  selectAll.value = cartList.value.every(item => item.selected)
}

const getSubtotal = (item) => {
  return item.price * item.num
}

const increaseNum = (id) => {
  const item = cartList.value.find(item => item.id === id)
  if (item) {
    item.num++
  }
}

const decreaseNum = (id) => {
  const item = cartList.value.find(item => item.id === id)
  if (item && item.num > 1) {
    item.num--
  }
}

const removeItem = (id) => {
  const index = cartList.value.findIndex(item => item.id === id)
  if (index > -1) {
    cartList.value.splice(index, 1)
  }
}

const removeSelected = () => {
  cartList.value = cartList.value.filter(item => !item.selected)
  selectAll.value = false
}

const checkout = () => {
  alert('正在跳转到结算页面...')
}
</script>

<style scoped>
.cart-page {
  padding: 20px 0;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 25px;
}

.cart-content {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.cart-header,
.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.cart-header {
  background: #f5f5f5;
  font-size: 14px;
  font-weight: 600;
}

.col-check { flex: 0 0 80px; }
.col-goods { flex: 3; }
.col-price { flex: 1; text-align: center; }
.col-num { flex: 1; text-align: center; }
.col-total { flex: 1; text-align: center; }
.col-action { flex: 1; text-align: center; }

.goods-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.goods-icon {
  font-size: 60px;
}

.goods-name {
  font-size: 14px;
  color: #333;
}

.num-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.num-control button {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
}

.num-control button:hover {
  background: #667eea;
  color: #fff;
}

.num-control span {
  width: 50px;
  text-align: center;
}

.remove-btn {
  padding: 8px 16px;
  background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
}

.footer-left {
  display: flex;
  gap: 20px;
}

.remove-selected {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #fff;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.total-price {
  font-size: 16px;
  color: #666;
}

.total-price strong {
  color: #e74c3c;
  font-size: 28px;
}

.checkout-btn {
  padding: 14px 40px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.cart-empty {
  background: #fff;
  padding: 100px;
  text-align: center;
  border-radius: 8px;
}

.empty-icon {
  font-size: 100px;
  margin-bottom: 20px;
}

.cart-empty p {
  color: #999;
  font-size: 18px;
  margin-bottom: 30px;
}

.go-shopping {
  padding: 14px 40px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
}
</style>
