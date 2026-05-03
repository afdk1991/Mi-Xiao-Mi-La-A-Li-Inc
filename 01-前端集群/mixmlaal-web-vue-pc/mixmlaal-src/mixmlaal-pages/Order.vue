<template>
  <div class="order-page">
    <div class="container">
      <h2 class="page-title">我的订单</h2>
      
      <div class="order-tabs">
        <div 
          v-for="tab in orderTabs"
          :key="tab.id"
          :class="{ active: activeTab === tab.id"
          @click="activeTab = tab.id"
        >{{ tab.name }}</div>
      </div>
      
      <div class="order-list">
        <div class="order-item" v-for="order in orderList" :key="order.id">
          <div class="order-header">
            <span>订单号：{{ order.orderNo }}</span>
            <span>下单时间：{{ order.createTime }}</span>
            <span class="order-status">{{ order.statusText }}</span>
          </div>
          <div class="order-goods">
            <div class="goods-info" v-for="goods in order.goods" :key="goods.id">
              <span class="goods-icon">{{ goods.imageIcon }}</span>
              <span class="goods-name">{{ goods.name }}</span>
              <span class="goods-price">¥{{ goods.price }}</span>
              <span class="goods-num">x{{ goods.num }}</span>
            </div>
          </div>
          <div class="order-footer">
            <span class="total-price">共{{ order.goods.length }}件商品，合计：<strong>¥{{ order.totalAmount }}</strong></span>
            <div class="order-actions">
              <button v-if="order.status === 0" @click="cancelOrder(order.id)">取消订单</button>
              <button v-if="order.status === 1" @click="payOrder(order.id)">立即付款</button>
              <button v-if="order.status === 2" @click="confirmOrder(order.id)">确认收货</button>
              <button v-if="order.status === 3" @click="orderAgain(order.id)">再次购买</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orderTabs = ref([
  { id: 'all', name: '全部订单' },
  { id: 'pending', name: '待付款' },
  { id: 'shipping', name: '待收货' },
  { id: 'finish', name: '已完成' }
])

const activeTab = ref('all')

const orderList = ref([
  { 
    id: 1, 
    orderNo: 'ORD20240501001', 
    createTime: '2024-05-01 10:30:00', 
    status: 1, 
    statusText: '待付款', 
    totalAmount: '17598.00', 
    goods: [
      { id: 101, name: 'iPhone 15 Pro Max', price: '9999', num: 1, imageIcon: '📱' },
      { id: 102, name: 'AirPods Pro 2', price: '1799', num: 2, imageIcon: '🎧' }
    ]
  },
  { 
    id: 2, 
    orderNo: 'ORD20240428002', 
    createTime: '2024-04-28 15:20:00', 
    status: 2, 
    statusText: '待收货', 
    totalAmount: '3199.00', 
    goods: [
      { id: 103, name: 'Apple Watch Series 9', price: '3199', num: 1, imageIcon: '⌚' }
    ]
  },
  { 
    id: 3, 
    orderNo: 'ORD20240420003', 
    createTime: '2024-04-20 09:10:00', 
    status: 3, 
    statusText: '已完成', 
    totalAmount: '9299.00', 
    goods: [
      { id: 104, name: 'iPad Pro 12.9寸', price: '9299', num: 1, imageIcon: '📱' }
    ]
  }
])

const cancelOrder = (id) => {
  alert('订单已取消')
}

const payOrder = (id) => {
  alert('正在跳转到支付页面...')
}

const confirmOrder = (id) => {
  alert('已确认收货')
}

const orderAgain = (id) => {
  alert('已加入购物车')
}
</script>

<style scoped>
.order-page {
  padding: 20px 0;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 25px;
}

.order-tabs {
  display: flex;
  gap: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}

.order-tabs div {
  padding: 15px 0;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.order-tabs div.active {
  color: #667eea;
  border-bottom: 2px solid #667eea;
}

.order-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f5f5f5;
}

.order-header span {
  font-size: 14px;
  color: #666;
}

.order-status {
  color: #e74c3c;
  font-weight: 600;
}

.order-goods {
  padding: 20px;
}

.goods-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.goods-info:last-child {
  border-bottom: none;
}

.goods-icon {
  font-size: 50px;
}

.goods-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.goods-price {
  color: #e74c3c;
  font-weight: 600;
}

.goods-num {
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #fff;
}

.total-price {
  font-size: 14px;
  color: #666;
}

.total-price strong {
  color: #e74c3c;
  font-size: 20px;
}

.order-actions button {
  margin-left: 15px;
  padding: 10px 25px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.order-actions button:first-child {
  background: #f0f0f0;
  color: #333;
}

.order-actions button:last-child {
  background: #667eea;
  color: #fff;
}
</style>
