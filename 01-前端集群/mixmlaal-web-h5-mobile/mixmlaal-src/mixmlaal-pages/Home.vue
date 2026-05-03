<template>
  <div class="home-page">
    <van-search
      v-model="searchValue"
      placeholder="搜索商品"
      @search="onSearch"
    />

    <van-swipe class="banner" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="i in 3" :key="i">
        <div class="banner-item">轮播图 {{ i }}</div>
      </van-swipe-item>
    </van-swipe>

    <van-grid :column-num="4" class="category-grid">
      <van-grid-item v-for="item in categories" :key="item.id" :icon="item.icon" :text="item.name" />
    </van-grid>

    <div class="section-title">
      <h3>热门商品</h3>
      <van-button size="small" type="primary" plain @click="$router.push('/category')">
        查看更多
      </van-button>
    </div>

    <van-row :gutter="10" class="goods-list">
      <van-col span="12" v-for="goods in goodsList" :key="goods.id">
        <van-card
          :price="goods.price"
          :title="goods.name"
          :thumb="goods.image"
          @click="$router.push(`/goods/${goods.id}`)"
        />
      </van-col>
    </van-row>

    <van-tabbar v-model="activeTab" @change="onTabChange">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchValue = ref('')
const activeTab = ref(0)

const categories = [
  { id: 1, name: '数码', icon: 'phone-o' },
  { id: 2, name: '服装', icon: 'coupon-o' },
  { id: 3, name: '食品', icon: 'shop-o' },
  { id: 4, name: '图书', icon: 'bookmark-o' }
]

const goodsList = ref([
  { id: 1, name: '商品1', price: '99.00', image: '' },
  { id: 2, name: '商品2', price: '199.00', image: '' },
  { id: 3, name: '商品3', price: '299.00', image: '' },
  { id: 4, name: '商品4', price: '399.00', image: '' }
])

const onSearch = () => {
  console.log('搜索:', searchValue.value)
}

const onTabChange = (index) => {
  const routes = ['/', '/category', '/cart', '/user']
  router.push(routes[index])
}
</script>

<style scoped>
.home-page {
  padding-bottom: 60px;
}

.banner {
  height: 200px;
}

.banner-item {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.category-grid {
  margin: 15px 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.section-title h3 {
  font-size: 18px;
}

.goods-list {
  padding: 0 10px;
}
</style>
