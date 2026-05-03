<template>
  <div class="goods-detail-page">
    <van-nav-bar
      title="商品详情"
      left-arrow
      @click-left="$router.back()"
      right-text="分享"
    />

    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="i in 3" :key="i">
        <div class="swipe-item">商品图片 {{ i }}</div>
      </van-swipe-item>
    </van-swipe>

    <div class="goods-info">
      <div class="price">¥{{ goods.price }}</div>
      <h3 class="name">{{ goods.name }}</h3>
      <p class="desc">{{ goods.description }}</p>
    </div>

    <van-cell-group>
      <van-cell title="选择规格" is-link @click="showSku = true" />
      <van-cell title="配送至" is-link value="北京市朝阳区" />
      <van-cell title="运费" value="免运费" />
    </van-cell-group>

    <van-goods-action class="goods-action">
      <van-goods-action-icon icon="chat-o" text="客服" />
      <van-goods-action-icon icon="star" text="收藏" />
      <van-goods-action-icon icon="cart-o" text="购物车" @click="$router.push('/cart')" />
      <van-goods-action-button type="warning" text="加入购物车" @click="addToCart" />
      <van-goods-action-button type="danger" text="立即购买" @click="buyNow" />
    </van-goods-action>

    <van-sku
      v-model:show="showSku"
      :sku="skuData"
      :goods="goods"
      @buy-clicked="onBuyClicked"
      @add-cart-clicked="onAddCartClicked"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showSku = ref(false)

const goods = ref({
  id: route.params.id,
  name: '商品名称',
  price: '99.00',
  description: '这是商品的详细描述信息'
})

const skuData = {
  tree: [],
  list: [
    { id: 1, price: '9900', stock_num: 100 }
  ],
  price: '99.00'
}

const addToCart = () => {
  showSku.value = true
}

const buyNow = () => {
  showSku.value = true
}

const onBuyClicked = () => {
  console.log('立即购买')
}

const onAddCartClicked = () => {
  console.log('加入购物车')
}
</script>

<style scoped>
.goods-detail-page {
  padding-bottom: 50px;
}

.goods-swipe {
  height: 300px;
}

.swipe-item {
  height: 300px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.goods-info {
  padding: 15px;
  background: white;
  margin-bottom: 10px;
}

.price {
  font-size: 28px;
  color: #ff6b6b;
  font-weight: bold;
}

.name {
  font-size: 18px;
  margin: 10px 0;
}

.desc {
  color: #666;
  font-size: 14px;
}

.goods-action {
  bottom: 50px;
}
</style>
