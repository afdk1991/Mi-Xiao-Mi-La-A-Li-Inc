<template>
  <div class="register-container">
    <div class="register-form">
      <div class="logo">
        <h1>商家后台管理系统</h1>
        <p>商家注册</p>
      </div>

      <el-tabs v-model="activeTab" class="auth-tabs">
        <el-tab-pane label="账号注册" name="account"></el-tab-pane>
        <el-tab-pane label="手机注册" name="phone"></el-tab-pane>
        <el-tab-pane label="邮箱注册" name="email"></el-tab-pane>
      </el-tabs>

      <div v-if="errorMsg" class="error-msg">
        <el-icon><WarningFilled /></el-icon>
        {{ errorMsg }}
      </div>

      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="0" class="auth-form">
        <!-- 账号密码注册 -->
        <template v-if="activeTab === 'account'">
          <el-form-item prop="account">
            <el-input v-model="registerForm.account" placeholder="请输入账号" prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input v-model="registerForm.nickname" placeholder="请输入昵称" prefix-icon="UserFilled"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" prefix-icon="Lock"></el-input>
          </el-form-item>
        </template>

        <!-- 手机验证码注册 -->
        <template v-if="activeTab === 'phone'">
          <el-form-item prop="phone">
            <el-input v-model="registerForm.phone" placeholder="请输入手机号" prefix-icon="Phone"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="registerForm.code" placeholder="请输入验证码" prefix-icon="Key">
              <template #append>
                <el-button @click="sendCode" :disabled="codeCountdown > 0">
                  {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input v-model="registerForm.nickname" placeholder="请输入昵称（可选）" prefix-icon="UserFilled"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（可选）" prefix-icon="Lock"></el-input>
          </el-form-item>
        </template>

        <!-- 邮箱验证码注册 -->
        <template v-if="activeTab === 'email'">
          <el-form-item prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入邮箱" prefix-icon="Message"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="registerForm.code" placeholder="请输入验证码" prefix-icon="Key">
              <template #append>
                <el-button @click="sendCode" :disabled="codeCountdown > 0">
                  {{ codeCountdown > 0 ? codeCountdown + 's' : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="nickname">
            <el-input v-model="registerForm.nickname" placeholder="请输入昵称（可选）" prefix-icon="UserFilled"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码（可选）" prefix-icon="Lock"></el-input>
          </el-form-item>
        </template>

        <el-form-item>
          <el-checkbox v-model="registerForm.agree">
            我已阅读并同意<a href="#" @click.prevent="showAgreement">《商家入驻协议》</a>
          </el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading" class="register-btn">
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <div class="auth-footer">
        已有账号？<el-link type="primary" :underline="false" @click="router.push('/login')">立即登录</el-link>
      </div>
    </div>

    <el-dialog v-model="showSuccessDialog" title="注册成功" width="400px" :close-on-click-modal="false">
      <div class="success-content">
        <el-icon color="#67C23A" size="48"><CircleCheckFilled /></el-icon>
        <p>恭喜您，注册成功！</p>
        <div class="user-id-display">
          <span class="label">您的用户ID：</span>
          <span class="user-id">{{ registeredUserId }}</span>
        </div>
        <p class="tip">请牢记您的用户ID，可用于登录</p>
      </div>
      <template #footer>
        <el-button type="primary" @click="goToLogin">立即登录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import { WarningFilled, CircleCheckFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const registerFormRef = ref(null)

const activeTab = ref('account')
const errorMsg = ref('')
const loading = ref(false)
const codeCountdown = ref(0)
const showSuccessDialog = ref(false)
const registeredUserId = ref('')

const registerForm = reactive({
  account: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  phone: '',
  email: '',
  code: '',
  agree: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
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
    if (!registerForm.phone || !/^1[3-9]\d{9}$/.test(registerForm.phone)) {
      ElMessage.warning('请输入正确的手机号')
      return
    }
    target = registerForm.phone
  } else {
    if (!registerForm.email || !/^[\w\.-]+@[\w\.-]+\.\w+$/.test(registerForm.email)) {
      ElMessage.warning('请输入正确的邮箱')
      return
    }
    target = registerForm.email
  }

  try {
    await userStore.sendCode({
      phone: activeTab.value === 'phone' ? target : undefined,
      email: activeTab.value === 'email' ? target : undefined
    })
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

const handleRegister = async () => {
  if (!registerForm.agree) {
    ElMessage.warning('请阅读并同意商家入驻协议')
    return
  }

  try {
    errorMsg.value = ''
    await registerFormRef.value.validate()
    loading.value = true

    const registerData = {
      registerType: activeTab.value,
      nickname: registerForm.nickname || undefined,
      password: registerForm.password || undefined
    }

    if (activeTab.value === 'account') {
      registerData.account = registerForm.account
      registerData.password = registerForm.password
    } else if (activeTab.value === 'phone') {
      registerData.phone = registerForm.phone
      registerData.verifyCode = registerForm.code
    } else {
      registerData.email = registerForm.email
      registerData.verifyCode = registerForm.code
    }

    const result = await userStore.register(registerData)

    registeredUserId.value = result.data.id
    showSuccessDialog.value = true
  } catch (error) {
    if (error.message) {
      errorMsg.value = error.message
    } else {
      errorMsg.value = '注册失败，请重试'
    }
  } finally {
    loading.value = false
  }
}

const showAgreement = () => {
  ElMessage.info('商家入驻协议内容（此处应弹窗展示）')
}

const goToLogin = () => {
  showSuccessDialog.value = false
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-form {
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

.register-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
}

.auth-footer {
  text-align: center;
  color: #666;
  margin-top: 20px;
}

.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-content p {
  margin: 15px 0;
  font-size: 16px;
}

.user-id-display {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.user-id-display .label {
  color: #909399;
}

.user-id-display .user-id {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-left: 10px;
}

.tip {
  color: #909399;
  font-size: 14px;
}
</style>