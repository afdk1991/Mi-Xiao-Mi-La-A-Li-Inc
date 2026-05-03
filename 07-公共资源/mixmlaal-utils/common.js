/**
 * 亿级商城通用工具函数
 * 包含日期格式化、字符串处理、数字格式化等通用方法
 */

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {string} format - 格式化字符串，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的金额字符串
 */
export const formatAmount = (amount, decimals = 2) => {
  return Number(amount).toFixed(decimals)
}

/**
 * 格式化数字（千分位）
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
export const formatNumber = (num) => {
  return Number(num).toLocaleString()
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 节流时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, delay = 300) => {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝对象
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 数组去重
 * @param {Array} arr - 数组
 * @param {string} key - 根据哪个字段去重（可选）
 * @returns {Array} 去重后的数组
 */
export const uniqueArray = (arr, key) => {
  if (!key) return [...new Set(arr)]
  const seen = new Set()
  return arr.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

/**
 * 获取URL参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export const getUrlParam = (name) => {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(name)
}

/**
 * 设置本地存储
 * @param {string} key - 键名
 * @param {any} value - 键值
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

/**
 * 获取本地存储
 * @param {string} key - 键名
 * @returns {any} 键值
 */
export const getStorage = (key) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (e) {
    console.error('Storage get error:', e)
    return null
  }
}

/**
 * 删除本地存储
 * @param {string} key - 键名
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Storage remove error:', e)
  }
}

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export const validateEmail = (email) => {
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return reg.test(email)
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const validatePhone = (phone) => {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证身份证号格式
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
export const validateIdCard = (idCard) => {
  const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  return reg.test(idCard)
}

/**
 * 金额相加（避免浮点数精度问题）
 * @param  {...number} nums - 要相加的金额
 * @returns {number} 总和
 */
export const addAmount = (...nums) => {
  return nums.reduce((sum, num) => sum + Number(num), 0)
}

/**
 * 金额相减（避免浮点数精度问题）
 * @param {number} num1 - 被减数
 * @param {number} num2 - 减数
 * @returns {number} 差
 */
export const subtractAmount = (num1, num2) => {
  return Number(num1) - Number(num2)
}

/**
 * 金额相乘（避免浮点数精度问题）
 * @param {number} num1 - 被乘数
 * @param {number} num2 - 乘数
 * @returns {number} 积
 */
export const multiplyAmount = (num1, num2) => {
  return Number(num1) * Number(num2)
}

/**
 * 金额相除（避免浮点数精度问题）
 * @param {number} num1 - 被除数
 * @param {number} num2 - 除数
 * @returns {number} 商
 */
export const divideAmount = (num1, num2) => {
  if (num2 === 0) return 0
  return Number(num1) / Number(num2)
}

/**
 * 获取随机颜色
 * @returns {string} 十六进制颜色值
 */
export const getRandomColor = () => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#ff4d4f', 
    '#722ed1', '#eb2f96', '#13c2c2', '#fa8c16'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default {
  formatDate,
  formatAmount,
  formatNumber,
  generateId,
  debounce,
  throttle,
  deepClone,
  uniqueArray,
  getUrlParam,
  setStorage,
  getStorage,
  removeStorage,
  validateEmail,
  validatePhone,
  validateIdCard,
  addAmount,
  subtractAmount,
  multiplyAmount,
  divideAmount,
  getRandomColor
}
