import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Tabs, Divider, Typography } from 'antd'
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined, WechatOutlined, QqOutlined, WeiboOutlined, WalletOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

const { Text } = Typography
const { TabPane } = Tabs

const Login = () => {
  const navigate = useNavigate()
  const { login, thirdPartyLogin, state } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const [codeCountdown, setCodeCountdown] = useState(0)
  const [codeTimer, setCodeTimer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accountForm] = Form.useForm()
  const [phoneForm] = Form.useForm()
  const [emailForm] = Form.useForm()

  const startCountdown = () => {
    let count = 60
    setCodeCountdown(count)
    const timer = setInterval(() => {
      count--
      setCodeCountdown(count)
      if (count <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    setCodeTimer(timer)
  }

  const handleSendCode = async (type) => {
    try {
      let data
      if (type === 'phone') {
        const phone = phoneForm.getFieldValue('phone')
        if (!phone) {
          message.error('请先输入手机号')
          return
        }
        data = { phone }
      } else {
        const email = emailForm.getFieldValue('email')
        if (!email) {
          message.error('请先输入邮箱')
          return
        }
        data = { email }
      }
      
      const res = await authAPI.sendCode(data)
      message.success(res.data.message)
      startCountdown()
    } catch (error) {
      message.error(error.message || '发送验证码失败')
    }
  }

  const handleLoginSuccess = (res) => {
    message.success('登录成功')
    setTimeout(() => {
      navigate('/dashboard')
    }, 500)
  }

  const handleAccountLogin = async (values) => {
    setLoading(true)
    try {
      const res = await login({
        account: values.username,
        password: values.password,
        loginType: 'account'
      })
      handleLoginSuccess(res)
    } catch (error) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneLogin = async (values) => {
    setLoading(true)
    try {
      const res = await login({
        phone: values.phone,
        verifyCode: values.code,
        loginType: 'phone'
      })
      handleLoginSuccess(res)
    } catch (error) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (values) => {
    setLoading(true)
    try {
      const res = await login({
        email: values.email,
        verifyCode: values.code,
        loginType: 'email'
      })
      handleLoginSuccess(res)
    } catch (error) {
      message.error(error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleThirdPartyLogin = async (platform) => {
    setLoading(true)
    try {
      const mockOpenId = `${platform}_${Date.now()}`
      const mockNickname = `${platform}管理员`
      
      const res = await thirdPartyLogin({
        platform,
        openId: mockOpenId,
        nickname: mockNickname
      })
      
      if (res.isNewUser) {
        message.info('欢迎新用户！')
      }
      
      handleLoginSuccess(res)
    } catch (error) {
      message.error(error.message || '第三方登录失败')
    } finally {
      setLoading(false)
    }
  }

  const thirdPartyButtons = [
    { key: 'wechat', icon: <WechatOutlined />, color: '#07c160' },
    { key: 'qq', icon: <QqOutlined />, color: '#12b7f5' },
    { key: 'weibo', icon: <WeiboOutlined />, color: '#e6162d' },
    { key: 'alipay', icon: <WalletOutlined />, color: '#1677ff' }
  ]

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ color: '#333', margin: 0 }}>亿级商城 - 管理后台</h1>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="账号密码" key="account">
            <Form
              form={accountForm}
              name="accountLogin"
              onFinish={handleAccountLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="请输入账号" 
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码" 
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="手机登录" key="phone">
            <Form
              form={phoneForm}
              name="phoneLogin"
              onFinish={handlePhoneLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
                ]}
              >
                <Input 
                  prefix={<MobileOutlined />} 
                  placeholder="请输入手机号" 
                />
              </Form.Item>
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Input 
                  prefix={<LockOutlined />} 
                  placeholder="请输入验证码" 
                  suffix={
                    <Button 
                      type="link" 
                      onClick={() => handleSendCode('phone')}
                      disabled={codeCountdown > 0}
                    >
                      {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="邮箱登录" key="email">
            <Form
              form={emailForm}
              name="emailLogin"
              onFinish={handleEmailLogin}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { pattern: /^[\w\.-]+@[\w\.-]+\.\w+$/, message: '邮箱格式不正确' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="请输入邮箱" 
                />
              </Form.Item>
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Input 
                  prefix={<LockOutlined />} 
                  placeholder="请输入验证码" 
                  suffix={
                    <Button 
                      type="link" 
                      onClick={() => handleSendCode('email')}
                      disabled={codeCountdown > 0}
                    >
                      {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary">其他登录方式</Text>
        </Divider>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {thirdPartyButtons.map(item => (
            <Button
              key={item.key}
              shape="circle"
              size="large"
              icon={item.icon}
              style={{ backgroundColor: item.color, borderColor: item.color, color: '#fff' }}
              onClick={() => handleThirdPartyLogin(item.key)}
              loading={loading}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: '#999', fontSize: '13px' }}>
          测试账号：admin / 123456
        </div>
      </Card>
    </div>
  )
}

export default Login
