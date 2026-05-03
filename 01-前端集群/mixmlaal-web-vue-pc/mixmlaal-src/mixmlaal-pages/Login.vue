<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <h2 class="card-title">用户登录</h2>
      </template>

      <!-- 登录方式Tab -->
      <el-tabs v-model="activeTab" class="login-tabs">
        <!-- 账号密码登录 -->
        <el-tab-pane label="账号登录" name="account">
          <el-form :model="accountForm" :rules="accountRules" ref="accountFormRef" label-width="80px">
            <el-form-item label="账号" prop="account">
              <el-input v-model="accountForm.account" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="accountForm.password" type="password" placeholder="请输入密码" show-password clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAccountLogin" style="width: 100%">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 手机验证码登录 -->
        <el-tab-pane label="手机登录" name="phone">
          <el-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef" label-width="80px">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="phoneForm.phone" placeholder="请输入手机号" clearable />
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
              <el-input v-model="phoneForm.verifyCode" placeholder="请输入验证码" clearable style="width: 60%">
                <template #append>
                  <el-button @click="sendCode('phone')" :disabled="codeCountdown > 0">
                    {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePhoneLogin" style="width: 100%">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 邮箱验证码登录 -->
        <el-tab-pane label="邮箱登录" name="email">
          <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef" label-width="80px">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="emailForm.email" placeholder="请输入邮箱" clearable />
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
              <el-input v-model="emailForm.verifyCode" placeholder="请输入验证码" clearable style="width: 60%">
                <template #append>
                  <el-button @click="sendCode('email')" :disabled="codeCountdown > 0">
                    {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEmailLogin" style="width: 100%">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 第三方登录 -->
      <div class="third-party-section">
        <div class="divider">
          <span class="divider-text">其他登录方式</span>
        </div>
        <div class="third-party-buttons">
          <el-tooltip content="微信登录" placement="top">
            <el-button circle class="third-party-btn wechat" @click="handleThirdPartyLogin('wechat')">
              <span class="btn-icon">W</span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="QQ登录" placement="top">
            <el-button circle class="third-party-btn qq" @click="handleThirdPartyLogin('qq')">
              <span class="btn-icon">Q</span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="微博登录" placement="top">
            <el-button circle class="third-party-btn weibo" @click="handleThirdPartyLogin('weibo')">
              <span class="btn-icon">V</span>
            </el-button>
          </el-tooltip>
          <el-tooltip content="支付宝登录" placement="top">
            <el-button circle class="third-party-btn alipay" @click="handleThirdPartyLogin('alipay')">
              <span class="btn-icon">A</span>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 注册跳转 -->
      <div class="footer-links">
        <span>还没有账号？</span>
        <router-link to="/register">立即注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/utils/api'

const router = useRouter()

const activeTab = ref('account')
const codeCountdown = ref(0)
const codeTimer = ref(null)

const accountFormRef = ref(null)
const phoneFormRef = ref(null)
const emailFormRef = ref(null)

const accountForm = reactive({
  account: '',
  password: ''
})

const phoneForm = reactive({
  phone: '',
  verifyCode: ''
})

const emailForm = reactive({
  email: '',
  verifyCode: ''
})

const accountRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const emailRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const startCountdown = () => {
  codeCountdown.value = 60
  codeTimer.value = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(codeTimer.value)
    }
  }, 1000)
}

const sendCode = async (type) => {
  try {
    const data = type === 'phone' 
      ? { phone: phoneForm.phone }
      : { email: emailForm.email }

    const res = await authAPI.sendCode(data)
    ElMessage.success(res.data.message)
    startCountdown()
  } catch (error) {
    ElMessage.error(error.message || '发送验证码失败')
  }
}

const handleLoginSuccess = (res) => {
  const { token, user_id, nickname, login_type, is_new_user } = res.data
  localStorage.setItem('token', token)
  localStorage.setItem('user_id', user_id)
  localStorage.setItem('user_info', JSON.stringify({ nickname, login_type }))
  
  ElMessage.success('登录成功')
  
  if (is_new_user) {
    ElMessage.info('欢迎新用户！')
  }
  
  router.push('/')
}

const handleAccountLogin = async () => {
  if (!accountFormRef.value) return
  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await authAPI.login({
          account: accountForm.account,
          password: accountForm.password,
          login_type: 'account'
        })
        handleLoginSuccess(res)
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      }
    }
  })
}

const handlePhoneLogin = async () => {
  if (!phoneFormRef.value) return
  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await authAPI.login({
          phone: phoneForm.phone,
          verify_code: phoneForm.verifyCode,
          login_type: 'phone'
        })
        handleLoginSuccess(res)
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      }
    }
  })
}

const handleEmailLogin = async () => {
  if (!emailFormRef.value) return
  await emailFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await authAPI.login({
          email: emailForm.email,
          verify_code: emailForm.verifyCode,
          login_type: 'email'
        })
        handleLoginSuccess(res)
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      }
    }
  })
}

const handleThirdPartyLogin = async (platform) => {
  try {
    // 演示：使用模拟的openid进行第三方登录
    const mockOpenid = `${platform}_${Date.now()}`
    const mockNickname = `${platform}用户`
    
    const res = await authAPI.thirdPartyLogin({
      platform: platform,
      openid: mockOpenid,
      nickname: mockNickname
    })
    handleLoginSuccess(res)
  } catch (error) {
    ElMessage.error(error.message || '第三方登录失败')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.card-title {
  text-align: center;
  margin: 0;
  color: #303133;
}

.login-tabs {
  margin-bottom: 10px;
}

.third-party-section {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #dcdfe6;
}

.divider-text {
  padding: 0 15px;
  color: #909399;
  font-size: 14px;
}

.third-party-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.third-party-btn {
  width: 50px;
  height: 50px;
  font-size: 18px;
  border: none;
}

.third-party-btn.wechat {
  background: #07c160;
  color: white;
}

.third-party-btn.qq {
  background: #12b7f5;
  color: white;
}

.third-party-btn.weibo {
  background: #e6162d;
  color: white;
}

.third-party-btn.alipay {
  background: #1677ff;
  color: white;
}

.btn-icon {
  font-weight: bold;
}

.footer-links {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.footer-links a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}
</style>
