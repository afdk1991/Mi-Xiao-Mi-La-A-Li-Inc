<template>
  <div class="home-page">
    <el-carousel height="400px" style="margin-bottom: 40px;">
      <el-carousel-item v-for="i in 3" :key="i">
        <div class="carousel-item">
          <h2>超级电商平台 - 轮播图{{ i }}</h2>
          <p>亿级商用全平台超级综合体</p>
        </div>
      </el-carousel-item>
    </el-carousel>

    <h2 class="section-title">热门商品</h2>
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in goodsList" :key="item.id" style="margin-bottom: 20px;">
        <el-card class="goods-card" @click="goDetail(item.id)" shadow="hover">
          <div class="goods-image">
            <img :src="item.goods_img" :alt="item.goods_name" />
          </div>
          <div class="goods-info">
            <h3>{{ item.goods_name }}</h3>
            <p class="goods-price">
              <span class="current-price">¥{{ item.price }}</span>
              <span class="market-price">¥{{ item.market_price }}</span>
            </p>
            <div class="goods-meta">
              <span>库存: {{ item.stock }}</span>
              <span>销量: {{ item.sales }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const goodsList = ref([])

const loadGoods = async () => {
  try {
    const res = await request.get('/products')
    if (res.success) {
      goodsList.value = res.data
    }
  } catch (e) {
    console.error('加载商品失败', e)
    goodsList.value = [
      { id: 1, goods_name: 'iPhone 15 Pro', goods_img: 'https://picsum.photos/id/1/300/300', price: 7999, market_price: 8999, stock: 100, sales: 256 },
      { id: 2, goods_name: 'MacBook Pro', goods_img: 'https://picsum.photos/id/2/300/300', price: 12999, market_price: 14999, stock: 50, sales: 128 },
      { id: 3, goods_name: 'AirPods Pro', goods_img: 'https://picsum.photos/id/3/300/300', price: 1999, market_price: 2499, stock: 200, sales: 512 },
      { id: 4, goods_name: 'iPad Air', goods_img: 'https://picsum.photos/id/4/300/300', price: 4799, market_price: 5499, stock: 80, sales: 192 }
    ]
  }
}

const goDetail = (id) => {
  router.push(`/goods/${id}`)
}

onMounted(() => {
  loadGoods()
})
</script>

<style scoped>
.carousel-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}
.carousel-item h2 {
  font-size: 36px;
  margin-bottom: 20px;
}
.carousel-item p {
  font-size: 18px;
  opacity: 0.9;
}
.section-title {
  margin: 30px 0 20px;
  font-size: 24px;
  color: #333;
}
.goods-card {
  cursor: pointer;
}
.goods-image {
  text-align: center;
  padding: 10px;
}
.goods-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.goods-info h3 {
  font-size: 16px;
  margin: 10px 0;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-price {
  margin: 10px 0;
}
.current-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
}
.market-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}
.goods-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}
</style>
