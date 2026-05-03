import React from 'react'
import { Row, Col, Card, Statistic } from 'antd'
import { 
  UserOutlined, 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined 
} from '@ant-design/icons'

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={12568}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总商品数"
              value={8642}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={45896}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总交易额"
              value={2856980}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="今日数据" style={{ height: 300 }}>
            <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
              图表区域（待接入真实数据）
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="本周趋势" style={{ height: 300 }}>
            <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
              图表区域（待接入真实数据）
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
