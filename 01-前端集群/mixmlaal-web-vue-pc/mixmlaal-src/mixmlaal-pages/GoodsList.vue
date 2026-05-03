<template>
  <div class="goods-list-page">
    <div class="container">
      <div class="filter-bar">
        <div class="filter-left">
          <span class="label">分类：</span>
          <span 
            v-for="item in categories"
            :key="item.id"
            :class="{ active: activeCategory === item.id"
            @click="selectCategory(item.id)"
          >
            {{ item.name }}
          </span>
        </div>
        <div class="filter-right">
          <select v-model="sortType" @change="handleSort">
            <option value="">默认</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="sales">销量优先</option>
          </select>
        </div>
      </div>

      <div class="goods-grid">
        <div class="goods-item" v-for="goods in goodsList" :key="goods.id" @click="goToDetail(goods.id)">
          <div class="goods-image">{{ goods.imageIcon }}</div>
          <div class="goods-info">
            <h4 class="goods-name">{{ goods.name }}</h4>
            <p class="goods-desc">{{ goods.desc }}</p>
            <div class="goods-bottom">
              <span class="goods-price">¥{{ goods.price }}</span>
              <span class="goods-sales">销量{{ goods.sales }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeCategory = ref(null)
const sortType = ref('')

const categories = ref([
  { id: 1, name: '数码产品' },
  { id: 2, name: '服装鞋帽' },
  { id: 3, name: '食品饮料' },
  { id: 4, name: '家居用品' },
  { id: 5, name: '图书影音' },
  { id: 6, name: '美妆护肤' }
])

const goodsList = ref([
  { id: 1, name: 'iPhone 15 Pro Max', desc: '全新A17芯片，钛金属边框', price: '9999', sales: 5680, imageIcon: '📱' },
  { id: 2, name: 'MacBook Pro 14寸', desc: 'M3芯片，专业创作', price: '14999', sales: 3210, imageIcon: '💻' },
  { id: 3, name: 'AirPods Pro 2', desc: '主动降噪，空间音频', price: '1799', sales: 12580, imageIcon: '🎧' },
  { id: 4, name: 'Apple Watch Series 9', desc: '健康监测，运动追踪', price: '3199', sales: 4520, imageIcon: '⌚' },
  { id: 5, name: 'iPad Pro 12.9寸', desc: 'M2芯片，Liquid Retina XDR', price: '9299', sales: 2890, imageIcon: '📱' },
  { id: 6, name: 'AirTag 四件装', desc: '物品追踪，防丢提醒', price: '779', sales: 8650, imageIcon: '🏷️' }
])

const selectCategory = (id) => {
  activeCategory.value = id
}

const handleSort = () => {
}

const goToDetail = (id) => {
  router.push(`/goods/detail/${id}')
}
</script>

<style scoped>
.goods-list-page {
  padding: 20px 0;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 18px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.filter-left .label {
  color: #666;
  font-size: 14px;
}

.filter-left span {
  padding: 8px 18px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
}

.filter-left span:hover,
.filter-left span.active {
  background: #667eea;
  color: #fff;
}

.filter-right select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.goods-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.goods-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.goods-image {
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}

.goods-info {
  padding: 18px;
}

.goods-name {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

.goods-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 15px;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  font-size: 24px;
  color: #e74c3c;
  font-weight: bold;
}

.goods-sales {
  font-size: 13px;
  color: #999;
}

@media (max-width: 1024px) {
  .goods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-left {
    flex-wrap: wrap;
  }
  
  .goods-grid {
    grid-template-columns: 1fr;
  }
}
</style>
