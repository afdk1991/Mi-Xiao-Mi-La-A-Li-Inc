<template>
  <div class="login-page">
    <van-nav-bar title="用户登录" left-arrow @click-left="$router.back()" />

    <div class="login-content">
      <div class="logo">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mall" alt="logo" />
        <h2>亿级商城</h2>
      </div>

      <van-tabs v-model:active="activeTab" line-width="50">
        <van-tab title="账号密码" name="account">
          <van-form @submit="handleAccountLogin">
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
            <div class="submit-btn">
              <van-button round block type="primary" native-type="submit" :loading="loading">
                登录
              </van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="手机登录" name="phone">
          <van-form @submit="handlePhoneLogin">
            <van-cell-group inset>
              <van-field
                v-model="phoneForm.phone"
                name="phone"
                label="手机号"
                placeholder="请输入手机号"
                :rules="[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
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
                  <van-button size="small" type="primary" @click="sendCode('phone')" :disabled="codeCountdown > 0">
                    {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>
            <div class="submit-btn">
              <van-button round block type="primary" native-type="submit" :loading="loading">
                登录
              </van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="邮箱登录" name="email">
          <van-form @submit="handleEmailLogin">
            <van-cell-group inset>
              <van-field
                v-model="emailForm.email"
                name="email"
                label="邮箱"
                placeholder="请输入邮箱"
                :rules="[
                  { required: true, message: '请输入邮箱' },
                  { pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/, message: '邮箱格式不正确' }
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
                  <van-button size="small" type="primary" @click="sendCode('email')" :disabled="codeCountdown > 0">
                    {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
                  </van-button>
                </template>
              </van-field>
            </van-cell-group>
            <div class="submit-btn">
              <van-button round block type="primary" native-type="submit" :loading="loading">
                登录
              </van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>

      <div class="divider">
        <span>其他登录方式</span>
      </div>

      <div class="third-party">
        <div class="third-party-btn" @click="handleThirdPartyLogin('wechat')">
          <div class="icon wechat">W</div>
          <span>微信</span>
        </div>
        <div class="third-party-btn" @click="handleThirdPartyLogin('qq')">
          <div class="icon qq">Q</div>
          <span>QQ</span>
        </div>
        <div class="third-party-btn" @click="handleThirdPartyLogin('weibo')">
          <div class="icon weibo">V</div>
          <span>微博</span>
        </div>
        <div class="third-party-btn" @click="handleThirdPartyLogin('alipay')">
          <div class="icon alipay">A</div>
          <span>支付宝</span>
        </div>
      </div>

      <div class="footer">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { useUserStore } from '../store/user'
import { authAPI } from '../utils/api'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('account')
const loading = ref(false)
const codeCountdown = ref(0)
const codeTimer = ref(null)

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

const startCountdown = () => {
  let count = 60
  codeCountdown.value = count
  codeTimer.value = setInterval(() => {
    count--
    codeCountdown.value = count
    if (count <= 0) {
      clearInterval(codeTimer.value)
    }
  }, 1000)
}

const sendCode = async (type) => {
  try {
    let data
    if (type === 'phone') {
      if (!phoneForm.phone) {
        showToast('请先输入手机号')
        return
      }
      data = { phone: phoneForm.phone }
    } else {
      if (!emailForm.email) {
        showToast('请先输入邮箱')
        return
      }
      data = { email: emailForm.email }
    }
    
    const res = await authAPI.sendCode(data)
    showSuccessToast(res.data.message)
    startCountdown()
  } catch (error) {
    showToast(error.message || '发送验证码失败')
  }
}

const handleLoginSuccess = (res) => {
  showSuccessToast('登录成功')
  setTimeout(() => {
    router.replace('/user')
  }, 1000)
}

const handleAccountLogin = async () => {
  loading.value = true
  try {
    const res = await userStore.login({
      account: accountForm.account,
      password: accountForm.password,
      loginType: 'account'
    })
    handleLoginSuccess(res)
  } catch (error) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handlePhoneLogin = async () => {
  loading.value = true
  try {
    const res = await userStore.login({
      phone: phoneForm.phone,
      verifyCode: phoneForm.code,
      loginType: 'phone'
    })
    handleLoginSuccess(res)
  } catch (error) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleEmailLogin = async () => {
  loading.value = true
  try {
    const res = await userStore.login({
      email: emailForm.email,
      verifyCode: emailForm.code,
      loginType: 'email'
    })
    handleLoginSuccess(res)
  } catch (error) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleThirdPartyLogin = async (platform) => {
  loading.value = true
  try {
    const mockOpenId = `${platform}_${Date.now()}`
    const mockNickname = `${platform}用户`
    
    const res = await userStore.thirdPartyLogin({
      platform,
      openId: mockOpenId,
      nickname: mockNickname
    })
    
    if (res.isNewUser) {
      showToast('欢迎新用户！')
    }
    
    handleLoginSuccess(res)
  } catch (error) {
    showToast(error.message || '第三方登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-content {
  padding: 30px 20px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.logo h2 {
  color: #fff;
  font-size: 24px;
  margin: 0;
}

.submit-btn {
  margin: 30px 16px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #909399;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.divider span {
  padding: 0 15px;
  color: rgba(255, 255, 255, 0.8);
}

.third-party {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.third-party-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.third-party-btn .icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.third-party-btn .icon.wechat {
  background: #07c160;
}

.third-party-btn .icon.qq {
  background: #12b7f5;
}

.third-party-btn .icon.weibo {
  background: #e6162d;
}

.third-party-btn .icon.alipay {
  background: #1677ff;
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: rgba(255, 255, 255, 0.8);
}

.footer a {
  color: #fff;
  text-decoration: none;
  margin-left: 5px;
  font-weight: bold;
}
</style>
