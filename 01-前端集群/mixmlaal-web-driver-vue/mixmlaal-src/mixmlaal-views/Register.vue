<template>
  <div class="register-container">
    <div class="register-form">
      <div class="logo">
        <h1>司机/配送员端</h1>
        <p>用户注册</p>
      </div>

      <van-tabs v-model:active="activeTab" class="register-tabs" animated>
        <van-tab title="账号注册" name="account"></van-tab>
        <van-tab title="手机注册" name="phone"></van-tab>
        <van-tab title="邮箱注册" name="email"></van-tab>
      </van-tabs>

      <van-form @submit="handleSubmit" ref="formRef">
        <van-cell-group inset v-if="activeTab === 'account'">
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
            :rules="[{ required: true, message: '请再次输入密码' }]"
          />
        </van-cell-group>

        <van-cell-group inset v-if="activeTab === 'phone'">
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

        <van-cell-group inset v-if="activeTab === 'email'">
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

        <van-checkbox-group v-model="checked" direction="horizontal" class="agreement-checkbox">
          <van-checkbox name="agree">我已阅读并同意用户协议</van-checkbox>
        </van-checkbox-group>

        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading" @click="handleSubmit">
            注册
          </van-button>
        </div>
      </van-form>

      <div class="login-link">
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
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDriverStore } from '../mixmlaal-store/driver'
import { showToast } from 'vant'

const router = useRouter()
const driverStore = useDriverStore()
const formRef = ref(null)

const activeTab = ref('account')
const loading = ref(false)
const codeCountdown = ref(0)
const emailCodeCountdown = ref(0)
const checked = ref([])
const showSuccess = ref(false)
const registeredUserId = ref('')

let phoneCodeTimer = null
let emailCodeTimer = null

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

const sendCode = async () => {
  if (!phoneForm.phone || !/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    showToast({ message: '请输入正确的手机号', position: 'top' })
    return
  }
  try {
    await driverStore.sendCode({ phone: phoneForm.phone })
    showToast({ message: '验证码已发送', position: 'top' })
    codeCountdown.value = 60
    // 清除旧定时器
    if (phoneCodeTimer) clearInterval(phoneCodeTimer)
    phoneCodeTimer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0 && phoneCodeTimer) {
        clearInterval(phoneCodeTimer)
        phoneCodeTimer = null
      }
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
    // 清除旧定时器
    if (emailCodeTimer) clearInterval(emailCodeTimer)
    emailCodeTimer = setInterval(() => {
      emailCodeCountdown.value--
      if (emailCodeCountdown.value <= 0 && emailCodeTimer) {
        clearInterval(emailCodeTimer)
        emailCodeTimer = null
      }
    }, 1000)
  } catch (error) {
    showToast({ message: error.message || '发送失败', position: 'top' })
  }
}

const handleSubmit = async () => {
  if (!checked.value.includes('agree')) {
    showToast({ message: '请阅读并同意用户协议', position: 'top' })
    return
  }

  // 先验证表单
  try {
    await formRef.value?.validate()
  } catch (error) {
    return // 验证失败，直接返回
  }

  if (activeTab.value === 'account') {
    await handleAccountRegister()
  } else if (activeTab.value === 'phone') {
    await handlePhoneRegister()
  } else {
    await handleEmailRegister()
  }
}

const handleAccountRegister = async () => {
  if (!accountForm.account || !accountForm.nickname || !accountForm.password) {
    showToast({ message: '请填写完整信息', position: 'top' })
    return
  }
  if (accountForm.password !== accountForm.confirmPassword) {
    showToast({ message: '两次输入的密码不一致', position: 'top' })
    return
  }
  try {
    loading.value = true
    const res = await driverStore.register({
      registerType: 'account',
      account: accountForm.account,
      nickname: accountForm.nickname,
      password: accountForm.password
    })
    registeredUserId.value = res.data.id
    showSuccess.value = true
  } catch (error) {
    showToast({ message: error.message || '注册失败', position: 'top' })
  } finally {
    loading.value = false
  }
}

const handlePhoneRegister = async () => {
  if (!phoneForm.phone || !phoneForm.code) {
    showToast({ message: '请填写完整信息', position: 'top' })
    return
  }
  try {
    loading.value = true
    const res = await driverStore.register({
      registerType: 'phone',
      phone: phoneForm.phone,
      verifyCode: phoneForm.code,
      nickname: phoneForm.nickname || undefined,
      password: phoneForm.password || undefined
    })
    registeredUserId.value = res.data.id
    showSuccess.value = true
  } catch (error) {
    showToast({ message: error.message || '注册失败', position: 'top' })
  } finally {
    loading.value = false
  }
}

const handleEmailRegister = async () => {
  if (!emailForm.email || !emailForm.code) {
    showToast({ message: '请填写完整信息', position: 'top' })
    return
  }
  try {
    loading.value = true
    const res = await driverStore.register({
      registerType: 'email',
      email: emailForm.email,
      verifyCode: emailForm.code,
      nickname: emailForm.nickname || undefined,
      password: emailForm.password || undefined
    })
    registeredUserId.value = res.data.id
    showSuccess.value = true
  } catch (error) {
    showToast({ message: error.message || '注册失败', position: 'top' })
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  showSuccess.value = false
  router.push('/login')
}

// 组件卸载时清理定时器，防止内存泄漏
onUnmounted(() => {
  if (phoneCodeTimer) {
    clearInterval(phoneCodeTimer)
    phoneCodeTimer = null
  }
  if (emailCodeTimer) {
    clearInterval(emailCodeTimer)
    emailCodeTimer = null
  }
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-form {
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

.register-tabs {
  margin-bottom: 20px;
}

.agreement-checkbox {
  margin: 16px;
  padding: 0;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #f5576c;
  text-decoration: none;
  margin-left: 5px;
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