import request from './request'

export const authAPI = {
  login: (data) => request.post('/auth/login', data),
  register: (data) => request.post('/auth/register', data),
  logout: () => request.post('/auth/logout'),
  sendCode: (data) => request.post('/auth/send-code', data),
  thirdPartyLogin: (data) => request.post('/auth/third-party-login', data),
  getThirdPartyUrl: (platform) => request.get(`/auth/third-party-url?platform=${platform}`),
  bindPhone: (userId, phone, code) => request.post(`/auth/bind-phone?userId=${userId}&phone=${phone}&code=${code}`),
  bindEmail: (userId, email, code) => request.post(`/auth/bind-email?userId=${userId}&email=${email}&code=${code}`),
  resetPassword: (data) => request.post('/auth/reset-password', data)
}

export const userAPI = {
  getInfo: () => request.get('/user/info'),
  getProfile: (userId) => request.get(`/user/profile?userId=${userId}`)
}
