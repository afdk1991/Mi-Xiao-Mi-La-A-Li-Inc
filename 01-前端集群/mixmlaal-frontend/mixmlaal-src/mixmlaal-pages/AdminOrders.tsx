import { useState, useEffect } from 'react';
import { Order } from '../types';
import { orderService } from '../services/api';

interface AdminOrder extends Order {
  user_nickname?: string;
  user_email?: string;
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await orderService.getAllOrders(params);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      alert('更新状态失败');
    }
  };

  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return classMap[status] || '';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">订单管理</h1>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">全部订单</option>
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="shipped">已发货</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">加载中...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">暂无订单</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-gray-600">订单号: {order.id}</span>
                  <span className="ml-4 text-gray-600">用户: {order.user_nickname || order.user_email}</span>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`border-0 px-3 py-1 rounded-full text-sm ${getStatusClass(order.status)}`}
                >
                  <option value="pending">待支付</option>
                  <option value="paid">已支付</option>
                  <option value="shipped">已发货</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>

              <div className="border-t pt-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center mb-2">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <div className="flex-1">
                      <span className="block">{item.name}</span>
                      <span className="text-gray-500 text-sm">
                        ¥{item.price} x {item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ¥{order.total_amount.toFixed(2)}
                </span>
              </div>

              {order.shipping_address && (
                <div className="mt-2 text-gray-600 text-sm">
                  收货地址: {order.shipping_address}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
