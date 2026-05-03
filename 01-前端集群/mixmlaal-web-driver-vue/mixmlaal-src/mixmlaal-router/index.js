import { createRouter, createWebHistory } from 'vue-router'
import { useDriverStore } from '../mixmlaal-store/driver'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../mixmlaal-views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../mixmlaal-views/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../mixmlaal-views/Home.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../mixmlaal-views/mixmlaal-订单/List.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/order/detail/:id',
    name: 'OrderDetail',
    component: () => import('../mixmlaal-views/mixmlaal-订单/Detail.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('../mixmlaal-views/mixmlaal-财务/Index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/finance/withdraw',
    name: 'Withdraw',
    component: () => import('../mixmlaal-views/mixmlaal-财务/Withdraw.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../mixmlaal-views/mixmlaal-我的/Index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/mine/info',
    name: 'Info',
    component: () => import('../mixmlaal-views/mixmlaal-我的/Info.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/mine/vehicle',
    name: 'Vehicle',
    component: () => import('../mixmlaal-views/mixmlaal-我的/Vehicle.vue'),
    meta: { requireAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.meta.requireAuth
  const driverStore = useDriverStore()

  if (requireAuth && !driverStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router