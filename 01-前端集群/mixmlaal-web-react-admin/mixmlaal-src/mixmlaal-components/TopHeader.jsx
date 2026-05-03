import { Layout, Avatar, Dropdown, Space, message } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Header } = Layout

export default function TopHeader() {
  const navigate = useNavigate()

  const items = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('admin_token')
      message.success('退出成功')
      navigate('/login')
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
      >
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span>管理员</span>
        </Space>
      </Dropdown>
    </div>
  )
}
