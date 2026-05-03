import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { cartService, orderService } from '../services/api';

interface CartProps {
  onCartUpdate: () => void;
}

function Cart({ onCartUpdate }: CartProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartService.getCart();
      setItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      loadCart();
      onCartUpdate();
    } catch (error) {
      alert('更新失败');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId);
      loadCart();
      onCartUpdate();
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleCheckout = async () => {
    setOrdering(true);
    try {
      await orderService.createOrder(address);
      onCartUpdate();
      navigate('/orders');
    } catch (err: any) {
      alert(err.response?.data?.error || '下单失败');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">购物车是空的</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          去购物
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">购物车</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">商品</th>
              <th className="px-6 py-3 text-left">单价</th>
              <th className="px-6 py-3 text-left">数量</th>
              <th className="px-6 py-3 text-left">小计</th>
              <th className="px-6 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">¥{item.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="border px-2 py-1 rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border px-2 py-1 rounded hover:bg-gray-100"
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold">¥{(item.price * item.quantity).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">收货地址</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="请输入收货地址..."
            className="w-full border border-gray-300 rounded px-4 py-2 h-24"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl">
            总计: <span className="text-2xl font-bold text-blue-600">¥{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={ordering || !address.trim()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {ordering ? '下单中...' : '结算'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
