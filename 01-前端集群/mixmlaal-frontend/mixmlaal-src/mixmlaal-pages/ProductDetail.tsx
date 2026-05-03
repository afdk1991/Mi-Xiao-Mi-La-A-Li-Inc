import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { productService, cartService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface ProductDetailProps {
  onCartUpdate: () => void;
}

function ProductDetail({ onCartUpdate }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productService.getProductById(Number(id));
      setProduct(response.data.product);
    } catch (err) {
      setError('商品不存在');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await cartService.addToCart(product!.id, quantity);
      onCartUpdate();
      navigate('/cart');
    } catch (err: any) {
      alert(err.response?.data?.error || '添加购物车失败');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">加载中...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-10 text-red-500">{error || '商品不存在'}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image_url || 'https://via.placeholder.com/400?text=No+Image'}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="text-3xl font-bold text-blue-600">¥{product.price}</span>
          </div>

          <div className="mb-4">
            <span className="text-gray-600">分类: {product.category}</span>
            <span className="ml-4 text-gray-600">库存: {product.stock}</span>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">数量</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="border border-gray-300 rounded px-4 py-1 w-20 text-center"
                min={1}
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {adding ? '添加中...' : product.stock === 0 ? '暂无库存' : '加入购物车'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
