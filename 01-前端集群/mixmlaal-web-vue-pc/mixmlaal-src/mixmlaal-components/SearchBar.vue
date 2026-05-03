<template>
  <div class="search-bar">
    <div class="search-container">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品..."
        class="search-input"
        @keyup.enter="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
    </div>
    <div class="search-tags">
      <span
        v-for="tag in hotTags"
        :key="tag"
        class="tag-item"
        @click="handleTagClick(tag)"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')

const hotTags = ref(['手机', '电脑', '数码', '服装', '食品', '美妆'])

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/goods/list',
      query: { keyword: searchKeyword.value }
    })
  }
}

const handleTagClick = (tag) => {
  router.push({
    path: '/goods/list',
    query: { keyword: tag }
  })
}
</script>

<style scoped>
.search-bar {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-container {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
}

.search-btn {
  width: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.search-tags {
  margin-top: 15px;
  display: flex;
  gap: 15px;
}

.tag-item {
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s;
}

.tag-item:hover {
  color: #667eea;
}
</style>
