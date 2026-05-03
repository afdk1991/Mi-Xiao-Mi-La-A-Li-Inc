<template>
  <div class="carousel-banner">
    <el-carousel :interval="5000" trigger="click" height="400px" indicator-position="outside">
      <el-carousel-item v-for="(banner, index) in banners" :key="index">
        <div
          class="banner-item"
          :style="{
            background: `linear-gradient(135deg, ${banner.color1} 0%, ${banner.color2} 100%)`
          }"
          @click="handleClick(banner)"
        >
          <div class="banner-content">
            <h2 class="banner-title">{{ banner.title }}</h2>
            <p class="banner-desc">{{ banner.description }}</p>
            <el-button type="primary" size="large" class="banner-btn">
              {{ banner.buttonText }}
            </el-button>
          </div>
          <div class="banner-image">
            <img :src="banner.image" :alt="banner.title" />
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const banners = ref([
  {
    id: 1,
    title: 'iPhone 15 Pro',
    description: '全新A17 Pro芯片，钛金属设计',
    buttonText: '立即购买',
    image: 'https://picsum.photos/id/1/600/400',
    link: '/goods/1',
    color1: '#667eea',
    color2: '#764ba2'
  },
  {
    id: 2,
    title: 'MacBook Pro',
    description: 'M3芯片，性能飞跃提升',
    buttonText: '了解更多',
    image: 'https://picsum.photos/id/2/600/400',
    link: '/goods/2',
    color1: '#f093fb',
    color2: '#f5576c'
  },
  {
    id: 3,
    title: 'AirPods Pro',
    description: '主动降噪，空间音频',
    buttonText: '去选购',
    image: 'https://picsum.photos/id/3/600/400',
    link: '/goods/3',
    color1: '#4facfe',
    color2: '#00f2fe'
  },
  {
    id: 4,
    title: 'iPad Air',
    description: '轻巧强大，随身携带',
    buttonText: '查看详情',
    image: 'https://picsum.photos/id/4/600/400',
    link: '/goods/4',
    color1: '#43e97b',
    color2: '#38f9d7'
  }
])

const handleClick = (banner) => {
  if (banner.link) {
    router.push(banner.link)
  }
}
</script>

<style scoped>
.carousel-banner {
  width: 100%;
  margin-bottom: 30px;
}

.banner-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px;
  color: white;
  cursor: pointer;
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-desc {
  font-size: 20px;
  margin-bottom: 30px;
  opacity: 0.95;
}

.banner-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  backdrop-filter: blur(10px);
}

.banner-btn:hover {
  background: white;
  color: #667eea;
}

.banner-image {
  flex: 1;
  text-align: right;
}

.banner-image img {
  width: 450px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.banner-item:hover .banner-image img {
  transform: scale(1.05);
}
</style>
