import { Response } from 'express';
import { runQuery, getOne, getAll } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getOrders = (req: AuthRequest, res: Response): void => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params: any[] = [req.userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    const totalResult = getOne('SELECT COUNT(*) as count FROM orders WHERE user_id = ?' + (status ? ' AND status = ?' : ''), status ? [req.userId, status] : [req.userId]);
    const total = totalResult?.count || 0;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const orders = getAll(query, params);

    const ordersWithItems = orders.map((order: any) => {
      const items = getAll(`
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      return { ...order, items };
    });

    res.json({
      orders: ordersWithItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取订单列表失败' });
  }
};

export const getOrderById = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const order = getOne('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.userId]);

    if (!order) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }

    const items = getAll(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    res.json({ order: { ...order, items } });
  } catch (error) {
    res.status(500).json({ error: '获取订单详情失败' });
  }
};

export const createOrder = (req: AuthRequest, res: Response): void => {
  try {
    const { shipping_address } = req.body;

    const cartItems = getAll(`
      SELECT ci.*, p.price, p.stock, p.name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [req.userId]);

    if (cartItems.length === 0) {
      res.status(400).json({ error: '购物车为空' });
      return;
    }

    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        res.status(400).json({ error: `商品"${item.name}"库存不足` });
        return;
      }
    }

    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const orderResult = runQuery(
      'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
      [req.userId, totalAmount, 'pending', shipping_address || '']
    );

    const orderId = orderResult.lastInsertRowid;

    for (const item of cartItems) {
      runQuery(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      runQuery('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    runQuery('DELETE FROM cart_items WHERE user_id = ?', [req.userId]);

    const order = getOne('SELECT * FROM orders WHERE id = ?', [orderId]);
    res.status(201).json({ message: '订单创建成功', order });
  } catch (error) {
    res.status(500).json({ error: '创建订单失败' });
  }
};

export const updateOrderStatus = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: '无效的订单状态' });
      return;
    }

    const order = getOne('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }

    runQuery('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: '订单状态更新成功' });
  } catch (error) {
    res.status(500).json({ error: '更新订单状态失败' });
  }
};

export const getAllOrders = (req: AuthRequest, res: Response): void => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT o.*, u.nickname as user_nickname, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    const totalResult = getOne('SELECT COUNT(*) as count FROM orders o WHERE 1=1' + (status ? ' AND o.status = ?' : ''), status ? [status] : []);
    const total = totalResult?.count || 0;

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const orders = getAll(query, params);

    const ordersWithItems = orders.map((order: any) => {
      const items = getAll(`
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      return { ...order, items };
    });

    res.json({
      orders: ordersWithItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取订单列表失败' });
  }
};
