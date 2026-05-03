import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserManage from './pages/UserManage'
import GoodsManage from './pages/GoodsManage'
import OrderManage from './pages/OrderManage'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<UserManage />} />
          <Route path="goods" element={<GoodsManage />} />
          <Route path="order" element={<OrderManage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
