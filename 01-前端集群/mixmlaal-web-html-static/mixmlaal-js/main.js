// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
})

// 导航高亮
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav a')
  
  let current = ''
  sections.forEach(section => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (scrollY >= sectionTop - 100) {
      current = section.getAttribute('id')
    }
  })
  
  navLinks.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active')
    }
  })
})

// 联系表单提交
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault()
  const formData = new FormData(this)
  const data = Object.fromEntries(formData)
  
  console.log('表单数据:', data)
  alert('感谢您的咨询！我们会尽快联系您。')
  this.reset()
})

// 滚动动画
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate')
    }
  })
}, observerOptions)

document.querySelectorAll('.feature-item, .solution-item, .pricing-item').forEach(item => {
  observer.observe(item)
})

// 数字动画
function animateNumbers() {
  const stats = document.querySelectorAll('.stat-number')
  stats.forEach(stat => {
    const target = stat.textContent
    const isPercent = target.includes('%')
    const hasPlus = target.includes('+')
    const hasX = target.includes('x')
    const has7 = target.includes('7x')
    
    let numStr = target.replace(/[^0-9.]/g, '')
    let num = parseFloat(numStr)
    
    if (isNaN(num) || !numStr) return
    
    let current = 0
    const increment = num / 50
    const duration = 2000
    const stepTime = duration / 50
    
    const timer = setInterval(() => {
      current += increment
      if (current >= num) {
        current = num
        clearInterval(timer)
      }
      
      let display = Math.floor(current)
      if (current % 1 !== 0) {
        display = current.toFixed(2)
      }
      
      if (hasPlus) display += '+'
      if (hasPercent) display += '%'
      if (hasX) display += 'x'
      if (has7) display = '7x' + Math.floor(current) + '24'
      
      stat.textContent = display
    }, stepTime)
  })
}

let hasPercent = false

// 页面加载完成后执行
window.addEventListener('load', () => {
  setTimeout(animateNumbers, 500)
})

// 按钮悬停效果
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)'
  })
  
  btn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)'
  })
})

// 控制台欢迎信息
console.log('%c亿级商用全平台超级综合体', 'font-size: 24px; font-weight: bold; color: #1890ff;')
console.log('%c让商业更简单', 'font-size: 16px; color: #666;')
console.log('%c技术栈: Vue3 + React + Java + Python + Node', 'font-size: 14px; color: #999;')
