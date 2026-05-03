import axios from 'axios'
import { useDriverStore } from '../mixmlaal-store/driver'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求日志（仅开发环境）
if (import.meta.env.DEV && import.meta.env.VITE_SHOW_CONSOLE) {
  api.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '')
      return config
    },
    (error) => {
      console.error('[API Request Error]', error)
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    (response) => {
      console.log(`[API Response] ${response.config.url}`, response.data)
      return response
    },
    (error) => {
      console.error('[API Response Error]', error)
      return Promise.reject(error)
    }
  )
}

// 认证拦截器
api.interceptors.request.use(
  (config) => {
    const driverStore = useDriverStore()
    const token = driverStore.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const driverStore = useDriverStore()
      await driverStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
