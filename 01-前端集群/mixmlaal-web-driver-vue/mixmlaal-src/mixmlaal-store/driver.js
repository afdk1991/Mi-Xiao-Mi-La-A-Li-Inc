import { defineStore } from 'pinia'
import api from '../mixmlaal-api'

export const useDriverStore = defineStore('driver', {
  state: () => ({
    token: localStorage.getItem('driver_token') || '',
    driverInfo: JSON.parse(localStorage.getItem('driver_info') || 'null'),
    onlineStatus: false,
    currentOrder: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isOnline: (state) => state.onlineStatus
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
        this.driverInfo = userInfo
        
        localStorage.setItem('driver_token', token)
        localStorage.setItem('driver_info', JSON.stringify(userInfo))
        
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
        this.driverInfo = userInfo
        
        localStorage.setItem('driver_token', token)
        localStorage.setItem('driver_info', JSON.stringify(userInfo))
        
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
        this.driverInfo = {}
        this.onlineStatus = false
        this.currentOrder = null
        
        localStorage.removeItem('driver_token')
        localStorage.removeItem('driver_info')
      }
    },

    async getCurrentDriver() {
      try {
        const response = await api.get('/auth/profile')
        const userInfo = response.data.data
        
        this.driverInfo = userInfo
        
        localStorage.setItem('driver_info', JSON.stringify(userInfo))
        
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    async toggleOnlineStatus(status) {
      try {
        const response = await api.post('/driver/online', { status })
        this.onlineStatus = status
        return response.data
      } catch (error) {
        throw error.response?.data || error
      }
    },

    setCurrentOrder(order) {
      this.currentOrder = order
    }
  }
})
