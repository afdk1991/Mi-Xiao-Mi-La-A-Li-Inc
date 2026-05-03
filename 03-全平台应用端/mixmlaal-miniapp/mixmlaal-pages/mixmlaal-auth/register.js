const { api } = require('../../mixmlaal-utils/api')

Page({
  data: {
    activeTab: 'account',
    account: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    code: '',
    agree: false,
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

  onAgreementChange(e) {
    this.setData({
      agree: e.detail.value.length > 0
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

  handleRegister() {
    const { activeTab, account, nickname, password, confirmPassword, phone, email, code, agree } = this.data

    if (!agree) {
      wx.showToast({ title: '请阅读并同意用户注册协议', icon: 'none' })
      return
    }

    if (activeTab === 'account') {
      if (!account) {
        this.setData({ errorMsg: '请输入账号' })
        return
      }
      if (!nickname) {
        this.setData({ errorMsg: '请输入昵称' })
        return
      }
      if (!password) {
        this.setData({ errorMsg: '请输入密码' })
        return
      }
      if (password !== confirmPassword) {
        this.setData({ errorMsg: '两次输入的密码不一致' })
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

    const registerData = {
      registerType: activeTab,
      nickname: nickname || undefined,
      password: password || undefined
    }

    if (activeTab === 'account') {
      registerData.account = account
      registerData.password = password
    } else if (activeTab === 'phone') {
      registerData.phone = phone
      registerData.verifyCode = code
    } else {
      registerData.email = email
      registerData.verifyCode = code
    }

    api.register(registerData).then(res => {
      if (res.success) {
        wx.showModal({
          title: '注册成功',
          content: '您的用户ID：' + res.data.userId + '，请牢记！',
          showCancel: false,
          success: () => {
            wx.redirectTo({ url: '/pages/auth/login' })
          }
        })
      } else {
        this.setData({ errorMsg: res.msg || '注册失败' })
      }
    }).catch(err => {
      this.setData({ errorMsg: '网络错误' })
    }).finally(() => {
      this.setData({ loading: false })
    })
  },

  showAgreement() {
    wx.showModal({
      title: '用户注册协议',
      content: '这里是用户注册协议的内容...',
      showCancel: false
    })
  }
})
