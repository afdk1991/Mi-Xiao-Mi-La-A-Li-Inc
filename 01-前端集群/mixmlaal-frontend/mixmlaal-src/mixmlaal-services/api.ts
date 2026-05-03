import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginType');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  sendCode: (data: any) => api.post('/auth/send-code', data),
  thirdPartyLogin: (data: any) => api.post('/auth/third-party-login', data),
  getThirdPartyUrl: (platform: string) => api.get(`/auth/third-party-url?platform=${platform}`),
  bindPhone: (userId: number, phone: string, code: string) => 
    api.post(`/auth/bind-phone?userId=${userId}&phone=${phone}&code=${code}`),
  bindEmail: (userId: number, email: string, code: string) => 
    api.post(`/auth/bind-email?userId=${userId}&email=${email}&code=${code}`),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/user/info'),
};

export const productService = {
  getProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/products', { params }),
  getProductById: (id: number) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: number, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/products/${id}`),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (product_id: number, quantity: number) =>
    api.post('/cart', { product_id, quantity }),
  updateCartItem: (itemId: number, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId: number) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderService = {
  getOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/orders', { params }),
  getAllOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/orders/all', { params }),
  getOrderById: (id: number) => api.get(`/orders/${id}`),
  createOrder: (shipping_address: string) =>
    api.post('/orders', { shipping_address }),
  updateOrderStatus: (id: number, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

export default api;
