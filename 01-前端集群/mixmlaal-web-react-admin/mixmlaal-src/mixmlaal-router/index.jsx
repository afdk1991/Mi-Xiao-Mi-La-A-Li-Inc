import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import UserManage from '../pages/UserManage'
import GoodsManage from '../pages/GoodsManage'
import OrderManage from '../pages/OrderManage'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'user', element: <UserManage /> },
      { path: 'goods', element: <GoodsManage /> },
      { path: 'order', element: <OrderManage /> }
    ]
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}
