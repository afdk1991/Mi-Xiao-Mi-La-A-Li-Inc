import React from 'react'
import { Table, Button, Space, Tag, Input, message, Select, DatePicker } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'

const { Option } = Select
const { RangePicker } = DatePicker

const OrderManage = () => {
  const [data, setData] = React.useState([
    { key: 1, orderNo: 'ORD20240501001', username: '张三', totalAmount: 9999, payAmount: 9999, status: 1, createTime: '2024-05-01 10:30:00' },
    { key: 2, orderNo: 'ORD20240501002', username: '李四', totalAmount: 1799, payAmount: 1799, status: 2, createTime: '2024-05-01 11:20:00' },
    { key: 3, orderNo: 'ORD20240501003', username: '王五', totalAmount: 3199, payAmount: 3199, status: 3, createTime: '2024-05-01 12:10:00' },
    { key: 4, orderNo: 'ORD20240501004', username: '赵六', totalAmount: 14999, payAmount: 0, status: 0, createTime: '2024-05-01 13:00:00' }
  ])

  const getStatusText = (status) => {
    switch (status) {
      case 0: return <Tag color="orange">待付款</Tag>
      case 1: return <Tag color="blue">待发货</Tag>
      case 2: return <Tag color="cyan">已发货</Tag>
      case 3: return <Tag color="green">已完成</Tag>
      default: return <Tag>未知</Tag>
    }
  }

  const columns = [
    { title: '订单编号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '用户', dataIndex: 'username', key: 'username' },
    { title: '订单金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (amt) => `¥${amt}` },
    { title: '实付金额', dataIndex: 'payAmount', key: 'payAmount', render: (amt) => amt > 0 ? `¥${amt}` : '-' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: getStatusText
    },
    { title: '下单时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EyeOutlined />}>查看详情</Button>
          {record.status === 1 && <Button type="primary">发货</Button>}
          {record.status === 0 && <Button type="primary">取消</Button>}
        </Space>
      )
    }
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>订单管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Space>
          <Input 
            placeholder="搜索订单编号" 
            style={{ width: 200 }} 
            prefix={<SearchOutlined />}
          />
          <Select placeholder="订单状态" style={{ width: 150 }}>
            <Option value="">全部状态</Option>
            <Option value="0">待付款</Option>
            <Option value="1">待发货</Option>
            <Option value="2">已发货</Option>
            <Option value="3">已完成</Option>
          </Select>
          <RangePicker />
        </Space>
      </div>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
    </div>
  )
}

export default OrderManage
