<template>
  <div class="login-container">
    <div class="login-form">
      <div class="logo">
        <h1>司机/配送员端</h1>
        <p>欢迎登录</p>
      </div>

      <van-tabs v-model:active="activeTab" class="login-tabs" animated>
        <van-tab title="账号登录" name="account"></van-tab>
        <van-tab title="手机登录" name="phone"></van-tab>
        <van-tab title="邮箱登录" name="email"></van-tab>
      </van-tabs>

      <van-form @submit="handleLogin" v-if="activeTab === 'account'">
        <van-cell-group inset>
          <van-field
            v-model="accountForm.account"
            name="account"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请输入账号' }]"
          />
          <van-field
            v-model="accountForm.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          />
        </van-cell-group>
      </van-form>

      <van-form @submit="handlePhoneLogin" v-if="activeTab === 'phone'">
        <van-cell-group inset>
          <van-field
            v-model="phoneForm.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
          />
          <van-field
            v-model="phoneForm.code"
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button size="small" type="primary" plain @click="sendCode" :disabled="codeCountdown > 0">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>

      <van-form @submit="handleEmailLogin" v-if="activeTab === 'email'">
        <van-cell-group inset>
          <van-field
            v-model="emailForm.email"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/, message: '请输入正确的邮箱' }
            ]"
          />
          <van-field
            v-model="emailForm.code"
            name="code"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <template #button>
              <van-button size="small" type="primary" plain @click="sendEmailCode" :disabled="emailCodeCountdown > 0">
                {{ emailCodeCountdown > 0 ? emailCodeCountdown + 's' : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
      </van-form>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="loading" @click="handleSubmit">
          登录
        </van-button>
      </div>

      <div class="third-party-login">
        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-text">其他登录方式</span>
          <div class="divider-line"></div>
        </div>
        <div class="third-party-buttons">
          <button class="third-party-btn wechat" @click="thirdPartyLogin('wechat')">微</button>
          <button class="third-party-btn alipay" @click="thirdPartyLogin('alipay')">支</button>
        </div>
      </div>

      <div class="register-link">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useDriverStore } from '../mixmlaal-store/driver'
import { showToast } from 'vant'

const router = useRouter()
const driverStore = useDriverStore()

const activeTab = ref('account')
const loading = ref(false)
const codeCountdown = ref(0)
const emailCodeCountdown = ref(0)

const accountForm = reactive({
  account: '',
  password: ''
})

const phoneForm = reactive({
  phone: '',
  code: ''
})

const emailForm = reactive({
  email: '',
  code: ''
})

const sendCode = async () => {
  if (!phoneForm.phone || !/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    showToast({ message: '请输入正确的手机号', position: 'top' })
    return
  }
  try {
    await driverStore.sendCode({ phone: phoneForm.phone })
    showToast({ message: '验证码已发送', position: 'top' })
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    showToast({ message: error.message || '发送失败', position: 'top' })
  }
}

const sendEmailCode = async () => {
  if (!emailForm.email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(emailForm.email)) {
    showToast({ message: '请输入正确的邮箱', position: 'top' })
    return
  }
  try {
    await driverStore.sendCode({ email: emailForm.email })
    showToast({ message: '验证码已发送', position: 'top' })
    emailCodeCountdown.value = 60
    const timer = setInterval(() => {
      emailCodeCountdown.value--
      if (emailCodeCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    showToast({ message: error.message || '发送失败', position: 'top' })
  }
}

const handleSubmit = async () => {
  if (activeTab.value === 'account') {
    await handleAccountLogin()
  } else if (activeTab.value === 'phone') {
    await handlePhoneLogin()
  } else {
    await handleEmailLogin()
  }
}

const handleAccountLogin = async () => {
  if (!accountForm.account || !accountForm.password) {
    showToast({ message: '请填写完整信息', position: 'top' })
    return
  }
  try {
    loading.value = true
    await driverStore.login({
      loginType: 'account',
      account: accountForm.account,
      password: accountForm.password
    })
    showToast({ message: '登录成功', position: 'top' })
    router.push('/home')
  } catch (error) {
    showToast({ message: error.message || '登录失败', position: 'top' })
  } finally {
    loading.value = false
  }
}

const handlePhoneLogin = async () => {
  if (!phoneForm.phone || !phoneForm.code) {
    showToast({ message: '请填写完整信息', position: 'top' })
    return
  }
  try {
    loading.value = true
    await driverStore.login({
      loginType: 'phone',
      phone: phoneForm.phone,
      verifyCode: phoneForm.code
    })
    showToast({ message: '登录成功', position: 'top' })
    router.push('/home')
  } catch (error) {
    showToast({ message: error.message || '登录失败', position: 'top' })
  } finally {
    loading.value = false
  }
}

const handleEmailLogin = async () => {
  if (!emailForm.email || !emailForm.code) {
    showToast({ message: '请填写完整信息', position: 'top' })
    return
  }
  try {
    loading.value = true
    await driverStore.login({
      loginType: 'email',
      email: emailForm.email,
      verifyCode: emailForm.code
    })
    showToast({ message: '登录成功', position: 'top' })
    router.push('/home')
  } catch (error) {
    showToast({ message: error.message || '登录失败', position: 'top' })
  } finally {
    loading.value = false
  }
}

const thirdPartyLogin = async (platform) => {
  try {
    loading.value = true
    await driverStore.thirdPartyLogin({
      platform,
      openId: platform + '_' + Date.now(),
      nickname: platform + '司机'
    })
    showToast({ message: '登录成功', position: 'top' })
    router.push('/home')
  } catch (error) {
    showToast({ message: error.message || '登录失败', position: 'top' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 40px 20px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo h1 {
  font-size: 24px;
  font-weight: bold;
  color: #f5576c;
  margin-bottom: 10px;
}

.logo p {
  color: #666;
  font-size: 14px;
}

.login-tabs {
  margin-bottom: 20px;
}

.third-party-login {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.divider-text {
  padding: 0 15px;
  color: #999;
  font-size: 14px;
}

.third-party-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.third-party-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s;
}

.third-party-btn:hover {
  transform: scale(1.1);
}

.third-party-btn.wechat {
  background: #07c160;
}

.third-party-btn.alipay {
  background: #1677ff;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #f5576c;
  text-decoration: none;
  margin-left: 5px;
}
</style>
