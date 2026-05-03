/**
 * 亿级商城全局常量配置
 * 包含接口地址、枚举值、配置参数等
 */

// ==================== 接口地址配置 ====================
export const API_BASE_URL = {
  // 开发环境
  development: {
    node: 'http://localhost:3001',
    python: 'http://localhost:8001',
    nest: 'http://localhost:8002'
  },
  // 测试环境
  test: {
    node: 'http://test-api.yijimall.com',
    python: 'http://test-data.yijimall.com',
    nest: 'http://test-gateway.yijimall.com'
  },
  // 生产环境
  production: {
    node: 'http://api.yijimall.com',
    python: 'http://data.yijimall.com',
    nest: 'http://gateway.yijimall.com'
  }
}

// 当前环境
export const CURRENT_ENV = 'development'

// 获取当前环境的接口地址
export const getApiUrl = (type) => {
  return API_BASE_URL[CURRENT_ENV][type]
}

// ==================== 订单状态枚举 ====================
export const ORDER_STATUS = {
  PENDING_PAYMENT: { code: 0, label: '待付款', color: 'orange' },
  PENDING_SHIPMENT: { code: 1, label: '待发货', color: 'blue' },
  SHIPPED: { code: 2, label: '已发货', color: 'cyan' },
  COMPLETED: { code: 3, label: '已完成', color: 'green' },
  CANCELLED: { code: 4, label: '已取消', color: 'gray' },
  REFUNDING: { code: 5, label: '退款中', color: 'purple' },
  REFUNDED: { code: 6, label: '已退款', color: 'red' }
}

// ==================== 用户状态枚举 ====================
export const USER_STATUS = {
  ENABLED: { code: 1, label: '正常', color: 'green' },
  DISABLED: { code: 0, label: '禁用', color: 'red' }
}

// ==================== 商品状态枚举 ====================
export const GOODS_STATUS = {
  ON_SHELF: { code: 1, label: '上架中', color: 'green' },
  OFF_SHELF: { code: 0, label: '已下架', color: 'orange' }
}

// ==================== 支付方式枚举 ====================
export const PAYMENT_TYPE = {
  WECHAT: { code: 1, label: '微信支付', icon: 'wechat' },
  ALIPAY: { code: 2, label: '支付宝', icon: 'alipay' },
  BALANCE: { code: 3, label: '余额支付', icon: 'wallet' },
  BANK: { code: 4, label: '银行卡', icon: 'bank' }
}

// ==================== 用户等级枚举 ====================
export const USER_LEVEL = {
  NORMAL: { code: 1, label: '普通会员', discount: 1.0 },
  SILVER: { code: 2, label: '银卡会员', discount: 0.95 },
  GOLD: { code: 3, label: '金卡会员', discount: 0.9 },
  VIP: { code: 4, label: 'VIP会员', discount: 0.85 }
}

// ==================== 通用配置 ====================
export const CONFIG = {
  // 分页默认值
  PAGE_SIZE: 20,
  
  // 文件上传配置
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // 缓存时间（秒）
  CACHE_TIME: {
    SHORT: 60,        // 1分钟
    MEDIUM: 300,      // 5分钟
    LONG: 3600        // 1小时
  },
  
  // Cookie过期时间（天）
  COOKIE_EXPIRES: 7,
  
  // Token过期时间（分钟）
  TOKEN_EXPIRES: 1440 // 24小时
}

// ==================== 正则表达式 ====================
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  ID_CARD: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/,
  URL: /^https?:\/\/[^\s]+$/,
  IP: /^(\d{1,3}\.){3}\d{1,3}$/
}

// ==================== 消息提示 ====================
export const MESSAGE = {
  SUCCESS: {
    LOGIN: '登录成功',
    LOGOUT: '退出成功',
    REGISTER: '注册成功',
    ADD: '添加成功',
    UPDATE: '更新成功',
    DELETE: '删除成功',
    SAVE: '保存成功'
  },
  ERROR: {
    LOGIN: '登录失败，请检查用户名或密码',
    AUTH: '请先登录',
    NETWORK: '网络异常，请稍后重试',
    VALIDATE: '请填写完整信息',
    PERMISSION: '暂无权限',
    SYSTEM: '系统错误，请联系管理员'
  },
  WARN: {
    CONFIRM: '确定要执行此操作吗？',
    DELETE: '确定要删除吗？此操作不可恢复',
    LOGOUT: '确定要退出登录吗？'
  }
}

// ==================== 路由路径 ====================
export const ROUTE_PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  GOODS_LIST: '/goods/list',
  GOODS_DETAIL: '/goods/detail/:id',
  CART: '/cart',
  ORDER: '/order',
  USER: '/user',
  ABOUT: '/about',
  ADMIN: {
    DASHBOARD: '/dashboard',
    USER_MANAGE: '/user',
    GOODS_MANAGE: '/goods',
    ORDER_MANAGE: '/order'
  }
}

export default {
  API_BASE_URL,
  CURRENT_ENV,
  getApiUrl,
  ORDER_STATUS,
  USER_STATUS,
  GOODS_STATUS,
  PAYMENT_TYPE,
  USER_LEVEL,
  CONFIG,
  REGEX,
  MESSAGE,
  ROUTE_PATH
}
