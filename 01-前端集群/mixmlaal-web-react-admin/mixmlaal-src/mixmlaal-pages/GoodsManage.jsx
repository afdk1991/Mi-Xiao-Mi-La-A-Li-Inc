import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons'

const { TextArea } = Input

const GoodsManage = () => {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingGoods, setEditingGoods] = useState(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [form] = Form.useForm()

  useEffect(() => {
    loadData()
  }, [pagination.current, pagination.pageSize])

  const loadData = async () => {
    setLoading(true)
    try {
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        goods_name: `商品${i + 1}`,
        category_name: ['手机数码', '电脑办公', '服装鞋帽'][i % 3],
        price: (Math.random() * 1000 + 100).toFixed(2),
        market_price: (Math.random() * 1500 + 200).toFixed(2),
        stock: Math.floor(Math.random() * 500),
        sales: Math.floor(Math.random() * 1000),
        status: i % 5 === 0 ? 0 : 1,
        is_hot: i % 3 === 0,
        is_new: i % 4 === 0,
        create_time: '2024-01-01 10:00:00'
      }))

      setDataSource(mockData)
      setPagination(prev => ({ ...prev, total: 100 }))
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (record) => {
    setEditingGoods(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = (record) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除商品 ${record.goods_name} 吗？`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        message.success('删除成功')
        loadData()
      }
    })
  }

  const handleAdd = () => {
    setEditingGoods(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingGoods) {
        message.success('更新成功')
      } else {
        message.success('添加成功')
      }
      setModalVisible(false)
      loadData()
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: '商品名称',
      dataIndex: 'goods_name',
      key: 'goods_name',
      ellipsis: true
    },
    {
      title: '分类',
      dataIndex: 'category_name',
      key: 'category_name'
    },
    {
      title: '售价',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span style={{ color: '#f56c6c' }}>¥{price}</span>
    },
    {
      title: '市场价',
      dataIndex: 'market_price',
      key: 'market_price',
      render: (price) => <span style={{ color: '#999' }}>¥{price}</span>
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales'
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (_, record) => (
        <>
          {record.is_hot && <Tag color="red" style={{ marginRight: 5 }}>热门</Tag>}
          {record.is_new && <Tag color="blue">新品</Tag>}
        </>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'orange'}>
          {status === 1 ? '上架' : '下架'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="table-header">
        <h2>商品管理</h2>
        <Space>
          <Input
            placeholder="搜索商品名称"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select placeholder="选择分类" style={{ width: 150 }}>
            <Select.Option value={1}>手机数码</Select.Option>
            <Select.Option value={2}>电脑办公</Select.Option>
            <Select.Option value={3}>服装鞋帽</Select.Option>
          </Select>
          <Select placeholder="商品状态" style={{ width: 120 }}>
            <Select.Option value={1}>上架</Select.Option>
            <Select.Option value={0}>下架</Select.Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加商品
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        }}
      />

      <Modal
        title={editingGoods ? '编辑商品' : '添加商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="goods_name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>

          <Form.Item name="category_id" label="商品分类">
            <Select placeholder="请选择商品分类">
              <Select.Option value={1}>手机数码</Select.Option>
              <Select.Option value={2}>电脑办公</Select.Option>
              <Select.Option value={3}>服装鞋帽</Select.Option>
              <Select.Option value={4}>食品生鲜</Select.Option>
              <Select.Option value={5}>美妆护肤</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="商品图片">
            <Upload
              action="/api/upload"
              listType="picture-card"
              maxCount={5}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              name="price"
              label="售价"
              rules={[{ required: true, message: '请输入售价' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="market_price"
              label="市场价"
              style={{ flex: 1 }}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="stock"
              label="库存"
              rules={[{ required: true, message: '请输入库存' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item name="goods_desc" label="商品描述">
            <TextArea rows={4} placeholder="请输入商品描述" />
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态">
              <Select.Option value={1}>上架</Select.Option>
              <Select.Option value={0}>下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default GoodsManage
