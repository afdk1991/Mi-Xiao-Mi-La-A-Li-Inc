<template>
  <div class="user-page">
    <van-nav-bar title="个人中心" />

    <div class="user-header">
      <van-image round width="60" height="60" fit="cover" />
      <div class="user-info">
        <h3>未登录</h3>
        <p>登录后享受更多权益</p>
      </div>
    </div>

    <van-grid :column-num="4" class="order-grid">
      <van-grid-item icon="orders-o" text="待付款" />
      <van-grid-item icon="logistics" text="待发货" />
      <van-grid-item icon="todo-list-o" text="待收货" />
      <van-grid-item icon="completed" text="已完成" />
    </van-grid>

    <van-cell-group class="menu-group">
      <van-cell title="我的订单" is-link value="全部订单" />
      <van-cell title="收货地址" is-link icon="location-o" />
      <van-cell title="优惠券" is-link icon="coupon-o" />
      <van-cell title="收藏夹" is-link icon="star-o" />
      <van-cell title="设置" is-link icon="setting-o" />
    </van-cell-group>

    <van-button type="primary" block class="login-btn" @click="$router.push('/login')">
      登录/注册
    </van-button>

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

const activeTab = ref(3)
</script>

<style scoped>
.user-page {
  padding-bottom: 60px;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-info {
  margin-left: 15px;
}

.user-info h3 {
  font-size: 20px;
  margin-bottom: 5px;
}

.order-grid {
  margin: 15px 0;
}

.menu-group {
  margin-bottom: 20px;
}

.login-btn {
  margin: 20px;
}
</style>
