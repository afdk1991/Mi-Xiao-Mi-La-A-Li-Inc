<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>购物指南</h3>
          <ul>
            <li><a href="#">购物流程</a></li>
            <li><a href="#">会员介绍</a></li>
            <li><a href="#">生活旅行</a></li>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">联系客服</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>配送方式</h3>
          <ul>
            <li><a href="#">上门自提</a></li>
            <li><a href="#">211限时达</a></li>
            <li><a href="#">配送服务查询</a></li>
            <li><a href="#">配送费收取标准</a></li>
            <li><a href="#">海外配送</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>支付方式</h3>
          <ul>
            <li><a href="#">货到付款</a></li>
            <li><a href="#">在线支付</a></li>
            <li><a href="#">分期付款</a></li>
            <li><a href="#">公司转账</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>售后服务</h3>
          <ul>
            <li><a href="#">售后政策</a></li>
            <li><a href="#">价格保护</a></li>
            <li><a href="#">退款说明</a></li>
            <li><a href="#">返修/退换货</a></li>
            <li><a href="#">取消订单</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>关于我们</h3>
          <ul>
            <li><a href="#">关于我们</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">合作招商</a></li>
            <li><a href="#">商家帮助</a></li>
            <li><a href="#">营销中心</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-links">
          <a href="#">关于我们</a> |
          <a href="#">联系我们</a> |
          <a href="#">商家入驻</a> |
          <a href="#">营销中心</a> |
          <a href="#">手机版</a> |
          <a href="#">法律声明</a>
        </div>
        <div class="copyright">
          <p>© 2024 亿级商用全平台超级综合体 版权所有</p>
          <p>京ICP备12345678号 | 京ICP备12345678号-1</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2c3e50;
  color: #bdc3c7;
  padding: 60px 0 30px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 20px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #409eff;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 30px;
  text-align: center;
}

.footer-links {
  margin-bottom: 20px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  color: #409eff;
}

.copyright p {
  margin: 5px 0;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
