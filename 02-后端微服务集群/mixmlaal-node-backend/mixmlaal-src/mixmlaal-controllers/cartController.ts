import { Response } from 'express';
import { runQuery, getOne, getAll } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getCart = (req: AuthRequest, res: Response): void => {
  try {
    const items = getAll(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `, [req.userId]);

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    res.json({ items, total: Math.round(total * 100) / 100 });
  } catch (error) {
    res.status(500).json({ error: '获取购物车失败' });
  }
};

export const addToCart = (req: AuthRequest, res: Response): void => {
  try {
    const { product_id, quantity = 1 } = req.body;

    const product = getOne('SELECT * FROM products WHERE id = ?', [product_id]);
    if (!product) {
      res.status(404).json({ error: '商品不存在' });
      return;
    }

    const existingItem = getOne(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.userId, product_id]
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      runQuery('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, existingItem.id]);
    } else {
      runQuery('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.userId, product_id, quantity]);
    }

    res.json({ message: '添加成功' });
  } catch (error) {
    res.status(500).json({ error: '添加购物车失败' });
  }
};

export const updateCartItem = (req: AuthRequest, res: Response): void => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      res.status(400).json({ error: '数量必须大于0' });
      return;
    }

    const item = getOne('SELECT * FROM cart_items WHERE id = ? AND user_id = ?', [itemId, req.userId]);
    if (!item) {
      res.status(404).json({ error: '购物车商品不存在' });
      return;
    }

    runQuery('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ error: '更新购物车失败' });
  }
};

export const removeFromCart = (req: AuthRequest, res: Response): void => {
  try {
    const { itemId } = req.params;
    const item = getOne('SELECT * FROM cart_items WHERE id = ? AND user_id = ?', [itemId, req.userId]);

    if (!item) {
      res.status(404).json({ error: '购物车商品不存在' });
      return;
    }

    runQuery('DELETE FROM cart_items WHERE id = ?', [itemId]);
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除购物车商品失败' });
  }
};

export const clearCart = (req: AuthRequest, res: Response): void => {
  try {
    runQuery('DELETE FROM cart_items WHERE user_id = ?', [req.userId]);
    res.json({ message: '清空购物车成功' });
  } catch (error) {
    res.status(500).json({ error: '清空购物车失败' });
  }
};
