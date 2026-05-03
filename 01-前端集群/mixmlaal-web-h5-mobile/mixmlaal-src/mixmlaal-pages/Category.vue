<template>
  <div class="category-page">
    <van-nav-bar title="商品分类" left-arrow @click-left="$router.back()" />

    <van-sidebar v-model="activeCategory" class="category-sidebar">
      <van-sidebar-item
        v-for="category in categories"
        :key="category.id"
        :title="category.name"
      />
    </van-sidebar>

    <div class="category-content">
      <div
        v-for="goods in goodsList"
        :key="goods.id"
        class="goods-item"
        @click="$router.push(`/goods/${goods.id}`)"
      >
        <van-image width="80" height="80" fit="cover" />
        <div class="goods-info">
          <h4>{{ goods.name }}</h4>
          <p class="price">¥{{ goods.price }}</p>
        </div>
        <van-button size="small" type="primary">加入购物车</van-button>
      </div>
    </div>

    <van-tabbar v-model="activeTab">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeCategory = ref(0)
const activeTab = ref(1)

const categories = [
  { id: 1, name: '数码电子' },
  { id: 2, name: '服装鞋帽' },
  { id: 3, name: '食品饮料' },
  { id: 4, name: '图书音像' },
  { id: 5, name: '家居用品' }
]

const goodsList = ref([
  { id: 1, name: '商品名称', price: '99.00' },
  { id: 2, name: '商品名称', price: '199.00' },
  { id: 3, name: '商品名称', price: '299.00' }
])
</script>

<style scoped>
.category-page {
  display: flex;
  height: 100vh;
  padding-bottom: 50px;
}

.category-sidebar {
  width: 30%;
  background: #f5f5f5;
}

.category-content {
  flex: 1;
  padding: 10px;
}

.goods-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  margin-bottom: 10px;
  border-radius: 8px;
}

.goods-info {
  flex: 1;
  margin-left: 10px;
}

.goods-info h4 {
  margin-bottom: 5px;
}

.price {
  color: #ff6b6b;
  font-weight: bold;
}
</style>
