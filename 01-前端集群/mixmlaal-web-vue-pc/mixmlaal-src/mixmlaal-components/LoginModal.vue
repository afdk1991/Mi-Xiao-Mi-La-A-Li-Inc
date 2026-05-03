<template>
  <div class="login-modal">
    <el-dialog
      v-model="visible"
      title="用户登录"
      width="400px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input
            v-model="form.captcha"
            placeholder="请输入验证码"
            style="width: 150px"
          />
          <el-image
            :src="captchaUrl"
            class="captcha-image"
            @click="refreshCaptcha"
          />
        </el-form-item>
        <el-form-item>
          <div class="form-options">
            <el-checkbox v-model="form.remember">记住密码</el-checkbox>
            <el-link type="primary" @click="goToRegister">注册账号</el-link>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          登录
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const captchaUrl = ref('')

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const form = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
}

const refreshCaptcha = () => {
  captchaUrl.value = `/api/captcha?t=${Date.now()}`
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.value = true

    await userStore.login({
      username: form.username,
      password: form.password
    })

    ElMessage.success('登录成功')
    emit('success')
    handleClose()
  } catch (e) {
    ElMessage.error(e.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const goToRegister = () => {
  handleClose()
  router.push('/register')
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.form-options {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.captcha-image {
  width: 120px;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
