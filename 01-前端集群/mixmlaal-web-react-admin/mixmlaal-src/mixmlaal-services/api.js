import axios from 'axios'
import { message } from 'antd'

const apiClient = axios.create({
  baseURL: '/api/admin',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      message.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未授权，请重新登录')
          localStorage.removeItem('adminToken')
          window.location.href = '/login'
          break
        case 403:
          message.error('拒绝访问')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(error.response.data?.msg || '请求失败')
      }
    } else {
      message.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default apiClient

export const authAPI = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  sendCode: (data) => apiClient.post('/auth/send-code', data),
  thirdPartyLogin: (data) => apiClient.post('/auth/third-party-login', data),
  getThirdPartyUrl: (platform) => apiClient.get(`/auth/third-party-url?platform=${platform}`),
  bindPhone: (userId, phone, code) => apiClient.post(`/auth/bind-phone?userId=${userId}&phone=${phone}&code=${code}`),
  bindEmail: (userId, email, code) => apiClient.post(`/auth/bind-email?userId=${userId}&email=${email}&code=${code}`),
  resetPassword: (data) => apiClient.post('/auth/reset-password', data),
  getUserInfo: () => apiClient.get('/user/info')
}

export const loginAPI = {
  login: (data) => apiClient.post('/login', data),
  logout: () => apiClient.post('/logout'),
  getUserInfo: () => apiClient.get('/info')
}

export const userManageAPI = {
  list: (params) => apiClient.get('/user/list', { params }),
  detail: (id) => apiClient.get(`/user/${id}`),
  add: (data) => apiClient.post('/user/add', data),
  update: (id, data) => apiClient.put(`/user/${id}`, data),
  delete: (id) => apiClient.delete(`/user/${id}`),
  export: () => apiClient.get('/user/export', { responseType: 'blob' })
}

export const goodsManageAPI = {
  list: (params) => apiClient.get('/goods/list', { params }),
  detail: (id) => apiClient.get(`/goods/${id}`),
  add: (data) => apiClient.post('/goods/add', data),
  update: (id, data) => apiClient.put(`/goods/${id}`, data),
  delete: (id) => apiClient.delete(`/goods/${id}`),
  onShelf: (id) => apiClient.put(`/goods/${id}/onShelf`),
  offShelf: (id) => apiClient.put(`/goods/${id}/offShelf`)
}

export const orderManageAPI = {
  list: (params) => apiClient.get('/order/list', { params }),
  detail: (id) => apiClient.get(`/order/${id}`),
  update: (id, data) => apiClient.put(`/order/${id}`, data),
  export: () => apiClient.get('/order/export', { responseType: 'blob' })
}

export const categoryManageAPI = {
  list: () => apiClient.get('/category/list'),
  tree: () => apiClient.get('/category/tree'),
  add: (data) => apiClient.post('/category/add', data),
  update: (id, data) => apiClient.put(`/category/${id}`, data),
  delete: (id) => apiClient.delete(`/category/${id}`)
}

export const dashboardAPI = {
  overview: () => apiClient.get('/dashboard/overview'),
  trend: (params) => apiClient.get('/dashboard/trend', { params }),
  rank: (type) => apiClient.get(`/dashboard/rank/${type}`)
}
