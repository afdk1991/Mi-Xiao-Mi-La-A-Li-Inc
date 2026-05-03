<template>
  <div class="goods-item" @click="goToDetail">
    <div class="goods-image">
      <el-image :src="goods.goods_img || goods.goods_image" fit="cover" />
      <el-tag v-if="goods.is_hot" class="goods-tag" type="danger">热门</el-tag>
      <el-tag v-if="goods.is_new" class="goods-tag">新品</el-tag>
    </div>
    <div class="goods-info">
      <h3 class="goods-name">{{ goods.goods_name || goods.name }}</h3>
      <div class="goods-desc">{{ goods.goods_desc || goods.description }}</div>
      <div class="goods-price">
        <span class="current-price">¥{{ goods.price }}</span>
        <span class="market-price">¥{{ goods.market_price || goods.original_price }}</span>
      </div>
      <div class="goods-meta">
        <span>销量 {{ goods.sales || 0 }}</span>
        <span>库存 {{ goods.stock || 0 }}</span>
      </div>
      <div class="goods-actions">
        <el-button type="primary" size="small" @click.stop="handleAddCart">
          <el-icon><ShoppingCart /></el-icon>
          加入购物车
        </el-button>
        <el-button type="danger" size="small" @click.stop="handleBuyNow">
          立即购买
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useCartStore } from '@/store/cart'

const props = defineProps({
  goods: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()

const goToDetail = () => {
  router.push(`/goods/${props.goods.id}`)
}

const handleAddCart = async () => {
  try {
    await cartStore.addToCart({
      goods_id: props.goods.id,
      goods_name: props.goods.goods_name || props.goods.name,
      goods_img: props.goods.goods_img || props.goods.goods_image,
      price: props.goods.price,
      quantity: 1
    })
    ElMessage.success('添加购物车成功')
  } catch (e) {
    ElMessage.error('添加失败，请重试')
  }
}

const handleBuyNow = () => {
  router.push(`/goods/${props.goods.id}`)
}
</script>

<style scoped>
.goods-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.goods-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.goods-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.goods-image .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.goods-item:hover .el-image {
  transform: scale(1.05);
}

.goods-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.goods-info {
  padding: 15px;
}

.goods-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  margin-bottom: 10px;
}

.current-price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: bold;
  margin-right: 10px;
}

.market-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.goods-actions {
  display: flex;
  gap: 8px;
}

.goods-actions .el-button {
  flex: 1;
}
</style>
