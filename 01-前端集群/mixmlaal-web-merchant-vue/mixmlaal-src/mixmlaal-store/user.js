import { defineStore } from 'pinia'
import api from '../api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('merchant_token') || '',
    userInfo: JSON.parse(localStorage.getItem('merchant_userInfo')) || {},
    merchantInfo: JSON.parse(localStorage.getItem('merchant_merchantInfo')) || {}
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    async sendCode(data) {
      try {
        const response = await api.post('/auth/send-code', data)
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async register(data) {
      try {
        const response = await api.post('/auth/register', data)
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async login(credentials) {
      try {
        const response = await api.post('/auth/login', credentials)
        const { token, userInfo } = response.data.data

        this.token = token
        this.userInfo = userInfo

        localStorage.setItem('merchant_token', token)
        localStorage.setItem('merchant_userInfo', JSON.stringify(userInfo))

        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async thirdPartyLogin(data) {
      try {
        const response = await api.post('/auth/third-party-login', data)
        const { token, userInfo } = response.data.data

        this.token = token
        this.userInfo = userInfo

        localStorage.setItem('merchant_token', token)
        localStorage.setItem('merchant_userInfo', JSON.stringify(userInfo))

        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        this.token = ''
        this.userInfo = {}
        this.merchantInfo = {}

        localStorage.removeItem('merchant_token')
        localStorage.removeItem('merchant_userInfo')
        localStorage.removeItem('merchant_merchantInfo')
      }
    },

    async getCurrentUser() {
      try {
        const response = await api.get('/auth/profile')
        const user = response.data.data

        this.userInfo = user

        localStorage.setItem('merchant_userInfo', JSON.stringify(user))

        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    }
  }
})
