<template>
  <div class="category-sidebar">
    <div class="category-title">
      <el-icon><Grid /></el-icon>
      <span>商品分类</span>
    </div>
    <div class="category-list">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @mouseenter="handleMouseEnter(category)"
        @mouseleave="handleMouseLeave"
        :class="{ active: activeCategory?.id === category.id }"
      >
        <el-icon><component :is="category.icon" /></el-icon>
        <span>{{ category.name }}</span>
        <el-icon class="arrow"><ArrowRight /></el-icon>
      </div>
    </div>

    <el-card
      v-if="showSubMenu && activeCategory?.children?.length"
      class="sub-category-menu"
      @mouseenter="handleSubMenuEnter"
      @mouseleave="handleSubMenuLeave"
    >
      <div
        v-for="sub in activeCategory.children"
        :key="sub.id"
        class="sub-category-item"
        @click="goToCategory(sub)"
      >
        <span>{{ sub.name }}</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Grid, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const activeCategory = ref(null)
const showSubMenu = ref(false)

const categories = ref([
  {
    id: 1,
    name: '手机数码',
    icon: 'Iphone',
    children: [
      { id: 11, name: '手机' },
      { id: 12, name: '平板' },
      { id: 13, name: '耳机' }
    ]
  },
  {
    id: 2,
    name: '电脑办公',
    icon: 'Monitor',
    children: [
      { id: 21, name: '笔记本电脑' },
      { id: 22, name: '台式机' },
      { id: 23, name: '显示器' }
    ]
  },
  {
    id: 3,
    name: '服装鞋帽',
    icon: 'Coordinate',
    children: [
      { id: 31, name: '男装' },
      { id: 32, name: '女装' },
      { id: 33, name: '童装' }
    ]
  },
  {
    id: 4,
    name: '食品生鲜',
    icon: 'Food',
    children: [
      { id: 41, name: '水果' },
      { id: 42, name: '蔬菜' },
      { id: 43, name: '肉类' }
    ]
  },
  {
    id: 5,
    name: '美妆护肤',
    icon: 'Brush',
    children: [
      { id: 51, name: '护肤品' },
      { id: 52, name: '化妆品' },
      { id: 53, name: '香水' }
    ]
  },
  {
    id: 6,
    name: '家用电器',
    icon: 'Refrigerator',
    children: [
      { id: 61, name: '冰箱' },
      { id: 62, name: '洗衣机' },
      { id: 63, name: '空调' }
    ]
  }
])

let leaveTimer = null

const handleMouseEnter = (category) => {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  activeCategory.value = category
  showSubMenu.value = true
}

const handleMouseLeave = () => {
  leaveTimer = setTimeout(() => {
    showSubMenu.value = false
    activeCategory.value = null
  }, 100)
}

const handleSubMenuEnter = () => {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
}

const handleSubMenuLeave = () => {
  showSubMenu.value = false
  activeCategory.value = null
}

const goToCategory = (sub) => {
  router.push({
    path: '/goods/list',
    query: { categoryId: sub.id }
  })
}
</script>

<style scoped>
.category-sidebar {
  width: 200px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.category-list {
  padding: 10px 0;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.3s;
  color: #333;
}

.category-item:hover,
.category-item.active {
  background: #f5f7fa;
  color: #667eea;
}

.category-item .arrow {
  margin-left: auto;
  font-size: 12px;
}

.sub-category-menu {
  position: absolute;
  left: 200px;
  top: 50px;
  width: 300px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sub-category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;
  color: #333;
}

.sub-category-item:hover {
  background: #f5f7fa;
  color: #667eea;
}
</style>
