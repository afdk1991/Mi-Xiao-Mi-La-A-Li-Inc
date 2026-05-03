import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  user: User | null;
}

function Navbar({ cartCount, user }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            电商平台
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              首页
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                  购物车
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                  我的订单
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  {user.nickname}
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/products" className="text-gray-700 hover:text-blue-600">
                      商品管理
                    </Link>
                    <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600">
                      订单管理
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  登录
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
