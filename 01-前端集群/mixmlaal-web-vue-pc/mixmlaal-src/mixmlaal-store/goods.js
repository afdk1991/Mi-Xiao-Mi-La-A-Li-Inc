import { createStore } from 'pinia'
import { goodsAPI, categoryAPI } from '../utils/api'

export const useGoodsStore = createStore({
  id: 'goods',
  state: () => ({
    goodsList: [],
    goodsDetail: null,
    categoryList: [],
    recommendList: [],
    hotList: [],
    searchResult: [],
    loading: false,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0
    }
  }),
  getters: {
    getGoodsList: (state) => state.goodsList,
    getGoodsDetail: (state) => state.goodsDetail,
    getCategoryList: (state) => state.categoryList,
    getRecommendList: (state) => state.recommendList,
    getHotList: (state) => state.hotList,
    getSearchResult: (state) => state.searchResult,
    isLoading: (state) => state.loading
  },
  actions: {
    async getGoodsList(params = {}) {
      this.loading = true
      try {
        const res = await goodsAPI.list(params)
        this.goodsList = res.data.list || []
        this.pagination.total = res.data.total || 0
      } catch (error) {
        console.error('获取商品列表失败:', error)
      } finally {
        this.loading = false
      }
    },
    async getGoodsDetail(id) {
      this.loading = true
      try {
        const res = await goodsAPI.detail(id)
        this.goodsDetail = res.data
      } catch (error) {
        console.error('获取商品详情失败:', error)
      } finally {
        this.loading = false
      }
    },
    async searchGoods(keyword) {
      this.loading = true
      try {
        const res = await goodsAPI.search({ keyword })
        this.searchResult = res.data.list || []
      } catch (error) {
        console.error('搜索商品失败:', error)
      } finally {
        this.loading = false
      }
    },
    async getCategoryList() {
      try {
        const res = await categoryAPI.list()
        this.categoryList = res.data || []
      } catch (error) {
        console.error('获取分类列表失败:', error)
      }
    },
    async getRecommendList() {
      try {
        const res = await goodsAPI.recommend()
        this.recommendList = res.data || []
      } catch (error) {
        console.error('获取推荐商品失败:', error)
      }
    },
    async getHotList() {
      try {
        const res = await goodsAPI.hot()
        this.hotList = res.data || []
      } catch (error) {
        console.error('获取热门商品失败:', error)
      }
    },
    setPage(page) {
      this.pagination.page = page
    },
    resetState() {
      this.goodsList = []
      this.goodsDetail = null
      this.searchResult = []
      this.pagination.page = 1
      this.pagination.total = 0
    }
  }
})
