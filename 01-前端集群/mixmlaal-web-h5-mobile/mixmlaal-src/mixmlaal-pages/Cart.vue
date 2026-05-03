<template>
  <div class="cart-page">
    <van-nav-bar title="购物车" left-arrow @click-left="$router.back()" />

    <div class="cart-list" v-if="cartList.length > 0">
      <van-card
        v-for="item in cartList"
        :key="item.id"
        :price="item.price"
        :title="item.name"
        :thumb="item.image"
      >
        <template #num>
          <van-stepper v-model="item.num" min="1" @change="updateCart(item)" />
        </template>
        <template #footer>
          <van-button size="small" type="danger" @click="removeFromCart(item)">
            删除
          </van-button>
        </template>
      </van-card>
    </div>

    <van-empty v-else description="购物车是空的" />

    <van-submit-bar
      :price="totalPrice"
      button-text="结算"
      @submit="onSubmit"
      class="submit-bar"
    >
      <van-checkbox v-model="selectAll" @change="toggleSelectAll">
        全选
      </van-checkbox>
    </van-submit-bar>

    <van-tabbar v-model="activeTab">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref(2)
const selectAll = ref(false)

const cartList = ref([
  { id: 1, name: '商品1', price: '99.00', num: 1, image: '' },
  { id: 2, name: '商品2', price: '199.00', num: 2, image: '' }
])

const totalPrice = computed(() => {
  return cartList.value.reduce((sum, item) => {
    return sum + parseFloat(item.price) * item.num * 100
  }, 0)
})

const updateCart = (item) => {
  console.log('更新购物车:', item)
}

const removeFromCart = (item) => {
  const index = cartList.value.indexOf(item)
  if (index > -1) {
    cartList.value.splice(index, 1)
  }
}

const toggleSelectAll = () => {
  cartList.value.forEach(item => {
    item.selected = selectAll.value
  })
}

const onSubmit = () => {
  console.log('提交订单')
}
</script>

<style scoped>
.cart-page {
  padding-bottom: 120px;
}

.cart-list {
  padding: 10px;
}

.submit-bar {
  bottom: 50px;
}
</style>
