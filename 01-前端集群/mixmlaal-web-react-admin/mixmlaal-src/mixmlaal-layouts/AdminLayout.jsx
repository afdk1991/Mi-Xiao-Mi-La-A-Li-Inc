import React from 'react'
import { Layout, Menu, theme } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'

const { Sider, Content, Header } = Layout

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '数据概览'
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理'
    },
    {
      key: '/goods',
      icon: <ShoppingOutlined />,
      label: '商品管理'
    },
    {
      key: '/order',
      icon: <ShoppingCartOutlined />,
      label: '订单管理'
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={220}>
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#001529',
          fontSize: 18,
          fontWeight: 600,
          color: '#fff'
        }}>
          亿级商城 - 后台
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: colorBgContainer, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          padding: '0 24px'
        }}>
          <div style={{ marginRight: 15 }}>管理员: admin</div>
          <div style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => navigate('/login')}>退出登录</div>
        </Header>
        <Content style={{ 
          margin: '24px', 
          padding: '24px', 
          minHeight: 280, 
          background: colorBgContainer, 
          borderRadius: borderRadiusLG 
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
