<template>
  <div class="login-container">
    <div class="login-form">
      <div class="logo">
        <h1>商家后台管理系统</h1>
        <p>欢迎登录</p>
      </div>

      <el-tabs v-model="activeTab" class="auth-tabs">
        <el-tab-pane label="账号登录" name="account"></el-tab-pane>
        <el-tab-pane label="手机登录" name="phone"></el-tab-pane>
        <el-tab-pane label="邮箱登录" name="email"></el-tab-pane>
      </el-tabs>

      <div v-if="errorMsg" class="error-msg">
        <el-icon><WarningFilled /></el-icon>
        {{ errorMsg }}
      </div>

      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="0" class="auth-form">
        <!-- 账号密码登录 -->
        <el-form-item prop="account" v-show="activeTab === 'account'">
          <el-input v-model="loginForm.account" placeholder="请输入账号" prefix-icon="User"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-show="activeTab === 'account'">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"></el-input>
        </el-form-item>

        <!-- 手机验证码登录 -->
        <el-form-item prop="phone" v-show="activeTab === 'phone'">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号" prefix-icon="Phone"></el-input>
        </el-form-item>
        <el-form-item prop="code" v-show="activeTab === 'phone'">
          <el-input v-model="loginForm.code" placeholder="请输入验证码" prefix-icon="Key">
            <template #append>
              <el-button @click="sendCode" :disabled="codeCountdown > 0">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <!-- 邮箱验证码登录 -->
        <el-form-item prop="email" v-show="activeTab === 'email'">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱" prefix-icon="Message"></el-input>
        </el-form-item>
        <el-form-item prop="code" v-show="activeTab === 'email'">
          <el-input v-model="loginForm.code" placeholder="请输入验证码" prefix-icon="Key">
            <template #append>
              <el-button @click="sendCode" :disabled="codeCountdown > 0">
                {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-password" @click="router.push('/reset-password')">忘记密码？</el-link>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="login-btn">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-divider">
        <el-divider content-position="center">其他登录方式</el-divider>
      </div>

      <div class="third-party-btns">
        <el-button circle @click="thirdPartyLogin('wechat')" title="微信登录">
          <span class="third-party-icon wechat">微</span>
        </el-button>
        <el-button circle @click="thirdPartyLogin('qq')" title="QQ登录">
          <span class="third-party-icon qq">Q</span>
        </el-button>
        <el-button circle @click="thirdPartyLogin('weibo')" title="微博登录">
          <span class="third-party-icon weibo">微</span>
        </el-button>
        <el-button circle @click="thirdPartyLogin('alipay')" title="支付宝登录">
          <span class="third-party-icon alipay">支</span>
        </el-button>
      </div>

      <div class="auth-footer">
        还没有账号？<el-link type="primary" :underline="false" @click="router.push('/register')">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import { WarningFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)

const activeTab = ref('account')
const errorMsg = ref('')
const loading = ref(false)
const codeCountdown = ref(0)

const loginForm = reactive({
  account: '',
  password: '',
  phone: '',
  email: '',
  code: '',
  remember: false
})

const loginRules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const sendCode = async () => {
  let target = ''
  if (activeTab.value === 'phone') {
    if (!loginForm.phone || !/^1[3-9]\d{9}$/.test(loginForm.phone)) {
      ElMessage.warning('请输入正确的手机号')
      return
    }
    target = loginForm.phone
  } else {
    if (!loginForm.email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(loginForm.email)) {
      ElMessage.warning('请输入正确的邮箱')
      return
    }
    target = loginForm.email
  }

  try {
    await userStore.sendCode({ phone: activeTab.value === 'phone' ? target : undefined, email: activeTab.value === 'email' ? target : undefined })
    ElMessage.success('验证码已发送')
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (error) {
    ElMessage.error(error.message || '发送验证码失败')
  }
}

const handleLogin = async () => {
  try {
    errorMsg.value = ''
    await loginFormRef.value.validate()
    loading.value = true

    const loginData = {
      loginType: activeTab.value
    }

    if (activeTab.value === 'account') {
      loginData.account = loginForm.account
      loginData.password = loginForm.password
    } else if (activeTab.value === 'phone') {
      loginData.phone = loginForm.phone
      loginData.verifyCode = loginForm.code
    } else {
      loginData.email = loginForm.email
      loginData.verifyCode = loginForm.code
    }

    await userStore.login(loginData)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    if (error.message) {
      errorMsg.value = error.message
    } else {
      errorMsg.value = '登录失败，请重试'
    }
  } finally {
    loading.value = false
  }
}

const thirdPartyLogin = async (platform) => {
  try {
    await userStore.thirdPartyLogin({
      platform,
      openId: platform + '_' + Date.now(),
      nickname: platform + '商户'
    })
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    ElMessage.error(error.message || '第三方登录失败')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-form {
  width: 100%;
  max-width: 420px;
  background: #fff;
  padding: 40px;
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
  color: #667eea;
  margin-bottom: 10px;
}

.logo p {
  color: #666;
  font-size: 14px;
}

.auth-tabs {
  margin-bottom: 20px;
}

.error-msg {
  background: #fef0f0;
  border: 1px solid #fde2e2;
  color: #f56c6c;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
}

.forgot-password {
  float: right;
}

.auth-divider {
  margin: 20px 0;
}

.third-party-btns {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.third-party-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.third-party-icon.wechat { background: #07c160; }
.third-party-icon.qq { background: #12b7f5; }
.third-party-icon.weibo { background: #e6162d; }
.third-party-icon.alipay { background: #1677ff; }

.auth-footer {
  text-align: center;
  color: #666;
}
</style>
