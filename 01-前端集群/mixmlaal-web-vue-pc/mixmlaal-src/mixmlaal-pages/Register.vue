<template>
  <div class="register-page">
    <el-card class="register-card">
      <template #header>
        <h2 class="card-title">用户注册</h2>
      </template>

      <!-- 注册方式Tab -->
      <el-tabs v-model="activeTab" class="register-tabs">
        <!-- 账号密码注册 -->
        <el-tab-pane label="账号注册" name="account">
          <el-form :model="accountForm" :rules="accountRules" ref="accountFormRef" label-width="80px">
            <el-form-item label="账号" prop="account">
              <el-input v-model="accountForm.account" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="accountForm.nickname" placeholder="请输入昵称" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="accountForm.password" type="password" placeholder="请输入密码" show-password clearable />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="accountForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleAccountRegister" style="width: 100%">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 手机号注册 -->
        <el-tab-pane label="手机注册" name="phone">
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
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="phoneForm.nickname" placeholder="请输入昵称（可选）" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="phoneForm.password" type="password" placeholder="请输入密码（可选）" show-password clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePhoneRegister" style="width: 100%">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 邮箱注册 -->
        <el-tab-pane label="邮箱注册" name="email">
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
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="emailForm.nickname" placeholder="请输入昵称（可选）" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="emailForm.password" type="password" placeholder="请输入密码（可选）" show-password clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleEmailRegister" style="width: 100%">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 登录跳转 -->
      <div class="footer-links">
        <span>已有账号？</span>
        <router-link to="/login">立即登录</router-link>
      </div>
    </el-card>

    <!-- 注册成功弹窗 -->
    <el-dialog v-model="showSuccessDialog" title="注册成功" width="400px" :close-on-click-modal="false">
      <div class="success-content">
        <el-icon color="#67C23A" size="48">
          <CircleCheckFilled />
        </el-icon>
        <p class="success-text">恭喜您，注册成功！</p>
        <div class="user-id-display">
          <span class="label">您的用户ID：</span>
          <span class="user-id">{{ registeredUserId }}</span>
        </div>
        <p class="tip">请牢记您的用户ID</p>
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
import { ElMessage } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { authAPI } from '@/utils/api'

const router = useRouter()

const activeTab = ref('account')
const codeCountdown = ref(0)
const codeTimer = ref(null)
const showSuccessDialog = ref(false)
const registeredUserId = ref('')

const accountFormRef = ref(null)
const phoneFormRef = ref(null)
const emailFormRef = ref(null)

const accountForm = reactive({
  account: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const phoneForm = reactive({
  phone: '',
  verifyCode: '',
  nickname: '',
  password: ''
})

const emailForm = reactive({
  email: '',
  verifyCode: '',
  nickname: '',
  password: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== accountForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const accountRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
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

const handleRegisterSuccess = (res) => {
  registeredUserId.value = res.data.id
  showSuccessDialog.value = true
}

const handleAccountRegister = async () => {
  if (!accountFormRef.value) return
  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await authAPI.register({
          account: accountForm.account,
          nickname: accountForm.nickname,
          password: accountForm.password,
          register_type: 'account'
        })
        handleRegisterSuccess(res)
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
      }
    }
  })
}

const handlePhoneRegister = async () => {
  if (!phoneFormRef.value) return
  await phoneFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await authAPI.register({
          phone: phoneForm.phone,
          verify_code: phoneForm.verifyCode,
          nickname: phoneForm.nickname || undefined,
          password: phoneForm.password || undefined,
          register_type: 'phone'
        })
        handleRegisterSuccess(res)
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
      }
    }
  })
}

const handleEmailRegister = async () => {
  if (!emailFormRef.value) return
  await emailFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await authAPI.register({
          email: emailForm.email,
          verify_code: emailForm.verifyCode,
          nickname: emailForm.nickname || undefined,
          password: emailForm.password || undefined,
          register_type: 'email'
        })
        handleRegisterSuccess(res)
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
      }
    }
  })
}

const goToLogin = () => {
  showSuccessDialog.value = false
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 420px;
}

.card-title {
  text-align: center;
  margin: 0;
  color: #303133;
}

.register-tabs {
  margin-bottom: 10px;
}

.success-content {
  text-align: center;
  padding: 20px 0;
}

.success-text {
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
  color: #409eff;
  margin-left: 10px;
}

.tip {
  color: #909399;
  font-size: 14px;
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
