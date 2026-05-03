import router from '../router'
import { ElMessage } from 'element-plus'

const whiteList = ['/login', '/register', '/goods/list', '/goods/detail', '/']

router.beforeEach(async (to, from, next) => {
  const hasToken = localStorage.getItem('token')

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasUserInfo = localStorage.getItem('userInfo')
      if (hasUserInfo) {
        next()
      } else {
        try {
          next()
        } catch (error) {
          ElMessage.error('获取用户信息失败，请重新登录')
          localStorage.removeItem('token')
          next('/login')
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      ElMessage.warning('请先登录')
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 亿级商城` : '亿级商城'
})
