import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/api';

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const response = await productService.getCategories();
      setCategories(['全部', ...response.data.categories]);
    } catch {
      setCategories(['全部', '电子产品', '服装', '食品', '家居']);
    }
  }, []);

  const loadProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { page, limit: 8 };
      if (selectedCategory !== '全部') params.category = selectedCategory;
      if (searchKeyword.trim()) params.search = searchKeyword.trim();

      const response = await productService.getProducts(params);
      const { products: data, total, limit } = response.data;
      
      if (page === 1) {
        setProducts(data);
      } else {
        setProducts(prev => [...prev, ...data]);
      }
      setTotalPages(Math.ceil(total / limit));
    } catch {
      setError('加载商品失败，请稍后重试');
      setProducts([
        { id: 1, name: 'iPhone 15 Pro', description: '最新款苹果手机，搭载A17芯片', price: 7999, stock: 100, category: '电子产品', image_url: 'https://picsum.photos/id/1/300/300' },
        { id: 2, name: 'MacBook Pro 14寸', description: 'M3 Pro芯片，专业级性能', price: 14999, stock: 50, category: '电子产品', image_url: 'https://picsum.photos/id/2/300/300' },
        { id: 3, name: 'AirPods Pro 2', description: '主动降噪，空间音频', price: 1899, stock: 200, category: '电子产品', image_url: 'https://picsum.photos/id/3/300/300' },
        { id: 4, name: 'Nike Air Max', description: '经典运动鞋，舒适透气', price: 899, stock: 150, category: '服装', image_url: 'https://picsum.photos/id/4/300/300' },
        { id: 5, name: '有机牛奶', description: '新西兰进口，纯天然有机', price: 68, stock: 500, category: '食品', image_url: 'https://picsum.photos/id/5/300/300' },
        { id: 6, name: '北欧风台灯', description: '简约设计，护眼照明', price: 299, stock: 80, category: '家居', image_url: 'https://picsum.photos/id/6/300/300' },
        { id: 7, name: '无线蓝牙耳机', description: '超长续航，Hi-Fi音质', price: 399, stock: 300, category: '电子产品', image_url: 'https://picsum.photos/id/7/300/300' },
        { id: 8, name: '纯棉T恤', description: '100%纯棉，舒适亲肤', price: 129, stock: 400, category: '服装', image_url: 'https://picsum.photos/id/8/300/300' },
      ]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [selectedCategory, searchKeyword]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    setCurrentPage(1);
    const timer = setTimeout(() => {
      loadProducts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchKeyword, loadProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    loadProducts(1);
  };

  const handleLoadMore = () => {
    if (!loading && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      loadProducts(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">欢迎来到 MIXMLAAL 商城</h1>
          <p className="text-gray-600 text-lg">发现优质商品，享受品质生活</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  placeholder="搜索商品、品牌..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-5 py-3 pr-12 focus:outline-none focus:border-blue-500 transition-colors text-gray-700 placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {isSearching ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="text-red-500 text-lg font-medium mb-2">😔 加载失败</div>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => loadProducts(1)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              重试
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-b-transparent" style={{ animationDuration: '1.5s' }} />
            </div>
            <span className="ml-4 text-gray-500 font-medium">加载中...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">未找到相关商品</h3>
            <p className="text-gray-500 mb-6">试试其他关键词或分类</p>
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedCategory('全部');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              浏览全部商品
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || 'https://picsum.photos/300/300'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        仅剩 {product.stock} 件
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        已售罄
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-red-500">¥{product.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">库存: {product.stock}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {currentPage < totalPages && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading ? '加载中...' : '加载更多商品'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;