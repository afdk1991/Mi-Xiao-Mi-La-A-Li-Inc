<template>
  <div class="register-page">
    <van-nav-bar title="用户注册" left-arrow @click-left="$router.back()" />

    <div class="register-content">
      <van-tabs v-model:active="activeTab" line-width="50">
        <van-tab title="账号注册" name="account">
          <van-form @submit="handleAccountRegister">
            <van-cell-group inset>
              <van-field
                v-model="accountForm.account"
                name="account"
                label="账号"
                placeholder="请输入账号"
                :rules="[{ required: true, message: '请输入账号' }]"
              />
              <van-field
                v-model="accountForm.nickname"
                name="nickname"
                label="昵称"
                placeholder="请输入昵称"
                :rules="[{ required: true, message: '请输入昵称' }]"
              />
              <van-field
                v-model="accountForm.password"
                type="password"
                name="password"
                label="密码"
                placeholder="请输入密码"
                :rules="[{ required: true, message: '请输入密码' }]"
              />
              <van-field
                v-model="accountForm.confirmPassword"
                type="password"
                name="confirmPassword"
                label="确认密码"
                placeholder="请再次输入密码"
                :rules="[
                  { required: true, message: '请再次输入密码' },
                  {
                    validator: (val) => val === accountForm.password,
                    message: '两次密码不一致'
                  }
                ]"
              />
            </van-cell-group>
            <div class="submit-btn">
              <van-button round block type="primary" native-type="submit" :loading="loading">
                注册
              </van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="手机注册" name="phone">
          <van-form @submit="handlePhoneRegister">
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
              <van-field
                v-model="phoneForm.nickname"
                name="nickname"
                label="昵称"
                placeholder="请输入昵称（可选）"
              />
              <van-field
                v-model="phoneForm.password"
                type="password"
                name="password"
                label="密码"
                placeholder="请输入密码（可选）"
              />
            </van-cell-group>
            <div class="submit-btn">
              <van-button round block type="primary" native-type="submit" :loading="loading">
                注册
              </van-button>
            </div>
          </van-form>
        </van-tab>

        <van-tab title="邮箱注册" name="email">
          <van-form @submit="handleEmailRegister">
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
              <van-field
                v-model="emailForm.nickname"
                name="nickname"
                label="昵称"
                placeholder="请输入昵称（可选）"
              />
              <van-field
                v-model="emailForm.password"
                type="password"
                name="password"
                label="密码"
                placeholder="请输入密码（可选）"
              />
            </van-cell-group>
            <div class="submit-btn">
              <van-button round block type="primary" native-type="submit" :loading="loading">
                注册
              </van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>

      <div class="footer">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>

    <van-dialog
      v-model:show="showSuccess"
      title="注册成功"
      show-cancel-button
      @confirm="goToLogin"
    >
      <div class="success-dialog">
        <van-icon name="passed" size="80" color="#07c160" />
        <p>恭喜您，注册成功！</p>
        <p class="user-id">您的用户ID：{{ registeredUserId }}</p>
        <p class="tip">请牢记您的用户ID</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { authAPI } from '../utils/api'

const router = useRouter()

const activeTab = ref('account')
const loading = ref(false)
const showSuccess = ref(false)
const registeredUserId = ref('')
const codeCountdown = ref(0)
const codeTimer = ref(null)

const accountForm = reactive({
  account: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const phoneForm = reactive({
  phone: '',
  code: '',
  nickname: '',
  password: ''
})

const emailForm = reactive({
  email: '',
  code: '',
  nickname: '',
  password: ''
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

const handleRegisterSuccess = (res) => {
  registeredUserId.value = res.data.id
  showSuccess.value = true
}

const handleAccountRegister = async () => {
  loading.value = true
  try {
    const res = await authAPI.register({
      account: accountForm.account,
      nickname: accountForm.nickname,
      password: accountForm.password,
      registerType: 'account'
    })
    handleRegisterSuccess(res)
  } catch (error) {
    showToast(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

const handlePhoneRegister = async () => {
  loading.value = true
  try {
    const res = await authAPI.register({
      phone: phoneForm.phone,
      verifyCode: phoneForm.code,
      nickname: phoneForm.nickname || undefined,
      password: phoneForm.password || undefined,
      registerType: 'phone'
    })
    handleRegisterSuccess(res)
  } catch (error) {
    showToast(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

const handleEmailRegister = async () => {
  loading.value = true
  try {
    const res = await authAPI.register({
      email: emailForm.email,
      verifyCode: emailForm.code,
      nickname: emailForm.nickname || undefined,
      password: emailForm.password || undefined,
      registerType: 'email'
    })
    handleRegisterSuccess(res)
  } catch (error) {
    showToast(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  showSuccess.value = false
  router.replace('/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-content {
  padding: 20px;
}

.submit-btn {
  margin: 30px 16px;
}

.footer {
  text-align: center;
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.8);
}

.footer a {
  color: #fff;
  text-decoration: none;
  margin-left: 5px;
  font-weight: bold;
}

.success-dialog {
  text-align: center;
  padding: 20px 0;
}

.success-dialog p {
  font-size: 16px;
  margin: 15px 0;
}

.success-dialog .user-id {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #1989fa;
  margin: 20px 0;
}

.success-dialog .tip {
  color: #909399;
  font-size: 14px;
}
</style>