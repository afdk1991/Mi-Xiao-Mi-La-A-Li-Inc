<template>
  <div class="footer-service">
    <div class="service-container">
      <div class="service-item">
        <el-icon class="service-icon"><Setting /></el-icon>
        <div class="service-info">
          <h4>正品保障</h4>
          <p>全部商品正品行货</p>
        </div>
      </div>
      <div class="service-item">
        <el-icon class="service-icon"><Van /></el-icon>
        <div class="service-info">
          <h4>急速物流</h4>
          <p>全场次日达配送</p>
        </div>
      </div>
      <div class="service-item">
        <el-icon class="service-icon"><CircleCheck /></el-icon>
        <div class="service-info">
          <h4>无忧售后</h4>
          <p>7天无理由退换货</p>
        </div>
      </div>
      <div class="service-item">
        <el-icon class="service-icon"><Wallet /></el-icon>
        <div class="service-info">
          <h4>支付安全</h4>
          <p>多重支付安全机制</p>
        </div>
      </div>
      <div class="service-item">
        <el-icon class="service-icon"><Headset /></el-icon>
        <div class="service-info">
          <h4>在线客服</h4>
          <p>24小时在线解答</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Setting,
  Van,
  CircleCheck,
  Wallet,
  Headset
} from '@element-plus/icons-vue'
</script>

<style scoped>
.footer-service {
  background: #f8f9fa;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.service-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.service-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  font-size: 24px;
  color: white;
}

.service-info h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.service-info p {
  font-size: 12px;
  color: #999;
}
</style>
