const app = getApp()
const { api } = require('../../mixmlaal-utils/api')

Page({
  data: {
    activeTab: 'account',
    account: '',
    password: '',
    phone: '',
    email: '',
    code: '',
    errorMsg: '',
    loading: false,
    codeCountdown: 0
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab,
      errorMsg: ''
    })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value,
      errorMsg: ''
    })
  },

  sendCode() {
    const { activeTab, phone, email } = this.data

    if (activeTab === 'phone') {
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        this.setData({ errorMsg: '请输入正确的手机号' })
        return
      }
    } else {
      if (!email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
        this.setData({ errorMsg: '请输入正确的邮箱' })
        return
      }
    }

    const data = activeTab === 'phone' ? { phone } : { email }

    api.sendCode(data).then(res => {
      if (res.success) {
        wx.showToast({ title: '验证码已发送', icon: 'success' })
        this.setData({ codeCountdown: 60 })
        const timer = setInterval(() => {
          const countdown = this.data.codeCountdown - 1
          this.setData({ codeCountdown: countdown })
          if (countdown <= 0) clearInterval(timer)
        }, 1000)
      } else {
        this.setData({ errorMsg: res.msg || '发送验证码失败' })
      }
    }).catch(err => {
      this.setData({ errorMsg: '网络错误' })
    })
  },

  handleLogin() {
    const { activeTab, account, password, phone, email, code } = this.data

    if (activeTab === 'account') {
      if (!account || !password) {
        this.setData({ errorMsg: '账号和密码不能为空' })
        return
      }
    } else if (activeTab === 'phone') {
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
        this.setData({ errorMsg: '请输入正确的手机号' })
        return
      }
      if (!code) {
        this.setData({ errorMsg: '请输入验证码' })
        return
      }
    } else {
      if (!email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
        this.setData({ errorMsg: '请输入正确的邮箱' })
        return
      }
      if (!code) {
        this.setData({ errorMsg: '请输入验证码' })
        return
      }
    }

    this.setData({ loading: true, errorMsg: '' })

    const loginData = {
      loginType: activeTab
    }

    if (activeTab === 'account') {
      loginData.account = account
      loginData.password = password
    } else if (activeTab === 'phone') {
      loginData.phone = phone
      loginData.verifyCode = code
    } else {
      loginData.email = email
      loginData.verifyCode = code
    }

    api.login(loginData).then(res => {
      if (res.success) {
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('userInfo', res.data.userInfo)
        wx.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } else {
        this.setData({ errorMsg: res.msg || '登录失败' })
      }
    }).catch(err => {
      this.setData({ errorMsg: '网络错误' })
    }).finally(() => {
      this.setData({ loading: false })
    })
  },

  thirdPartyLogin(e) {
    const platform = e.currentTarget.dataset.platform

    api.thirdPartyLogin({
      platform,
      openId: platform + '_' + Date.now(),
      nickname: platform + '用户'
    }).then(res => {
      if (res.success) {
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('userInfo', res.data.userInfo)
        wx.showToast({
          title: res.data.isNewUser ? '欢迎新用户' : '登录成功',
          icon: 'success'
        })
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' })
        }, 1500)
      } else {
        wx.showToast({ title: res.msg || '登录失败', icon: 'none' })
      }
    }).catch(err => {
      wx.showToast({ title: '网络错误', icon: 'none' })
    })
  }
})
