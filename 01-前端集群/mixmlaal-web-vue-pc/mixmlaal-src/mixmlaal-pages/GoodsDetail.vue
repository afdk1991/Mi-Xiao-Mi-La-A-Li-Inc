<template>
  <div class="goods-detail-page">
    <div class="container">
      <div class="detail-top">
        <div class="goods-image">
          <div class="main-image">{{ goodsDetail.imageIcon }}</div>
        </div>
        <div class="goods-info">
          <h1>{{ goodsDetail.name }}</h1>
          <p class="goods-desc">{{ goodsDetail.desc }}</p>
          <div class="goods-price">
            <span class="price-label">售价</span>
            <span class="price-value">¥{{ goodsDetail.price }}</span>
          </div>
          <div class="goods-other">
            <span>销量：{{ goodsDetail.sales }}</span>
            <span>库存：{{ goodsDetail.stock }}</span>
          </div>
          <div class="goods-actions">
            <div class="num-control">
              <span>购买数量：</span>
              <button @click="decrease">-</button>
              <span class="num-display">{{ purchaseNum }}</span>
              <button @click="increase">+</button>
            </div>
            <div class="action-buttons">
              <button class="add-cart" @click="addToCart">加入购物车</button>
              <button class="buy-now" @click="buyNow">立即购买</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goodsDetail = ref({
  id: null,
  name: 'iPhone 15 Pro Max',
  desc: '全新A17芯片，钛金属边框，专业级摄影系统',
  price: '9999',
  sales: 5680,
  stock: 999,
  imageIcon: '📱'
})

const purchaseNum = ref(1)

const increase = () => {
  if (purchaseNum.value < goodsDetail.value.stock) {
    purchaseNum.value++
  }
}

const decrease = () => {
  if (purchaseNum.value > 1) {
    purchaseNum.value--
  }
}

const addToCart = () => {
  alert('已加入购物车！')
}

const buyNow = () => {
  alert('正在跳转支付页面...')
}
</script>

<style scoped>
.goods-detail-page {
  padding: 20px 0;
}

.detail-top {
  display: flex;
  gap: 40px;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
}

.goods-image {
  flex: 0 0 400px;
}

.main-image {
  height: 400px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 160px;
}

.goods-info {
  flex: 1;
}

.goods-info h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.goods-desc {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.goods-price {
  background: linear-gradient(90deg, #ff6b6b, #ff4c4c;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  align-items: baseline;
}

.price-label {
  color: #fff;
  font-size: 14px;
  margin-right: 10px;
}

.price-value {
  color: #fff;
  font-size: 36px;
  font-weight: bold;
}

.goods-other {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  color: #666;
  font-size: 14px;
}

.goods-actions {
  padding-top: 20px;
}

.num-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.num-control button {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 18px;
  cursor: pointer;
}

.num-control button:hover {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.num-display {
  min-width: 60px;
  height: 40px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 20px;
}

.add-cart {
  flex: 1;
  padding: 16px;
  background: #ff9500;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.buy-now {
  flex: 1;
  padding: 16px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .detail-top {
    flex-direction: column;
  }
  
  .goods-image {
    flex: none;
  }
  
  .main-image {
    height: 300px;
    font-size: 120px;
  }
}
</style>
