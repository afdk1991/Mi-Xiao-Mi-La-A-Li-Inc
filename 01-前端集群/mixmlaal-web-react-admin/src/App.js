import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/users">用户管理</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/products">商品管理</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/orders">订单管理</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: '0 16px' }}>
            <Title level={3} style={{ margin: '16px 0' }}>MIXMLAAL 管理后台</Title>
          </Header>
          <Content style={{ margin: '16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<div>欢迎使用MIXMLAAL管理后台</div>} />
                <Route path="/users" element={<div>用户管理页面</div>} />
                <Route path="/products" element={<div>商品管理页面</div>} />
                <Route path="/orders" element={<div>订单管理页面</div>} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            MIXMLAAL Admin ©2025
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;