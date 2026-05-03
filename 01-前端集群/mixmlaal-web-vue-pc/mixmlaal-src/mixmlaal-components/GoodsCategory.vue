<template>
  <div class="goods-category">
    <div class="category-header">
      <h2 class="category-title">
        <el-icon><Goods /></el-icon>
        商品分类
      </h2>
    </div>
    <div class="category-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @click="handleCategoryClick(category)"
      >
        <div class="category-icon">
          <el-icon><component :is="category.icon" /></el-icon>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-desc">{{ category.description }}</p>
        </div>
        <el-icon class="category-arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Goods, ArrowRight, Iphone, Monitor, Coordinate, Food, Brush, Refrigerator } from '@element-plus/icons-vue'

const router = useRouter()

const categories = ref([
  { id: 1, name: '手机数码', description: '手机、平板、耳机', icon: Iphone },
  { id: 2, name: '电脑办公', description: '笔记本、台式机、配件', icon: Monitor },
  { id: 3, name: '服装鞋帽', description: '男装、女装、童装', icon: Coordinate },
  { id: 4, name: '食品生鲜', description: '水果、蔬菜、肉类', icon: Food },
  { id: 5, name: '美妆护肤', description: '护肤品、化妆品', icon: Brush },
  { id: 6, name: '家用电器', description: '冰箱、洗衣机、空调', icon: Refrigerator }
])

const handleCategoryClick = (category) => {
  router.push({
    path: '/goods/list',
    query: { categoryId: category.id }
  })
}
</script>

<style scoped>
.goods-category {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.category-header {
  margin-bottom: 20px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.category-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  font-size: 24px;
  color: white;
  margin-right: 15px;
}

.category-item:hover .category-icon {
  background: rgba(255, 255, 255, 0.2);
}

.category-info {
  flex: 1;
}

.category-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.category-desc {
  font-size: 12px;
  opacity: 0.8;
}

.category-arrow {
  font-size: 16px;
  opacity: 0.6;
}
</style>
