<template>
  <div class="about-page">
    <div class="container">
      <div class="about-header">
        <h1>关于我们</h1>
        <p>亿级商城 - 您值得信赖的购物平台</p>
      </div>
      
      <div class="about-section">
        <div class="section-content">
          <h2>关于亿级商城</h2>
          <p>亿级商城是一个集电商、社交、内容于一体的综合平台。我们致力于为用户提供便捷、安全、实惠的购物体验。自2024年成立以来，累计服务超过1000万用户，创造了良好的用户口碑。</p>
        </div>
      </div>
      
      <div class="about-section">
        <div class="section-content">
          <h2>我们的愿景</h2>
          <p>成为全球领先的综合性电商服务平台，让每一位用户都能享受到优质、便捷的购物服务。</p>
        </div>
      </div>
      
      <div class="about-section">
        <div class="section-content">
          <h2>我们的价值观</h2>
          <div class="values-grid">
            <div class="value-item">
              <span class="value-icon">🎯</span>
              <h3>用户至上</h3>
              <p>以用户需求为核心，不断优化产品和服务</p>
            </div>
            <div class="value-item">
              <span class="value-icon">💎</span>
              <h3>品质保证</h3>
              <p>严格把控商品质量，保障用户权益</p>
            </div>
            <div class="value-item">
              <span class="value-icon">🚀</span>
              <h3>高效服务</h3>
              <p>快速响应，高效处理，提升用户体验</p>
            </div>
            <div class="value-item">
              <span class="value-icon">🔐</span>
              <h3>安全可靠</h3>
              <p>全方位安全保障，让用户购物无忧</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="about-section">
        <div class="section-content">
          <h2>联系我们</h2>
          <div class="contact-grid">
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <h3>客服热线</h3>
              <p>400-000-0000</p>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <h3>电子邮箱</h3>
              <p>service@yijimall.com</p>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🏢</span>
              <h3>公司地址</h3>
              <p>北京市海淀区中关村大街100号</p>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🕐</span>
              <h3>服务时间</h3>
              <p>7x24小时全天候服务</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.about-page {
  padding: 40px 0;
}

.about-header {
  text-align: center;
  margin-bottom: 50px;
}

.about-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 15px;
}

.about-header p {
  font-size: 18px;
  color: #666;
}

.about-section {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 30px;
}

.section-content {
  padding: 40px;
}

.section-content h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.section-content p {
  line-height: 1.8;
  color: #666;
  font-size: 15px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
}

.value-item {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.value-icon {
  font-size: 45px;
  margin-bottom: 15px;
}

.value-item h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.value-item p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
}

.contact-item {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
  background: #f5f7fa;
}

.contact-icon {
  font-size: 45px;
  margin-bottom: 15px;
}

.contact-item h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.contact-item p {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}
</style>
