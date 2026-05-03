import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import { useAuth, useCart } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();
  const { cartCount, updateCartCount } = useCart();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar cartCount={cartCount} user={user} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail onCartUpdate={updateCartCount} />} />
            <Route path="/cart" element={isAuthenticated ? <Cart onCartUpdate={updateCartCount} /> : <Navigate to="/login" />} />
            <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/admin/products" element={user?.role === 'admin' ? <AdminProducts /> : <Navigate to="/" />} />
            <Route path="/admin/orders" element={user?.role === 'admin' ? <AdminOrders /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
