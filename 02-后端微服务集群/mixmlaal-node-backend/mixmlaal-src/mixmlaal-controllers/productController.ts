import { Response } from 'express';
import { runQuery, getOne, getAll } from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProducts = (req: AuthRequest, res: Response): void => {
  try {
    const { category, search, page = '1', limit = '10' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const totalResult = getOne('SELECT COUNT(*) as count FROM products WHERE 1=1' + 
      (category ? ' AND category = ?' : '') +
      (search ? ' AND (name LIKE ? OR description LIKE ?)' : ''),
      params
    );
    const total = totalResult?.count || 0;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const products = getAll(query, params);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取商品列表失败' });
  }
};

export const getProductById = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const product = getOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      res.status(404).json({ error: '商品不存在' });
      return;
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: '获取商品详情失败' });
  }
};

export const createProduct = (req: AuthRequest, res: Response): void => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;

    if (!name || price === undefined || stock === undefined) {
      res.status(400).json({ error: '请提供商品名称、价格和库存' });
      return;
    }

    const result = runQuery(
      'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', price, stock, category || '', image_url || '']
    );

    const product = getOne('SELECT * FROM products WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ message: '商品创建成功', product });
  } catch (error) {
    res.status(500).json({ error: '创建商品失败' });
  }
};

export const updateProduct = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, image_url } = req.body;

    const existing = getOne('SELECT * FROM products WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: '商品不存在' });
      return;
    }

    runQuery(
      `UPDATE products SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price), stock = COALESCE(?, stock), category = COALESCE(?, category), image_url = COALESCE(?, image_url) WHERE id = ?`,
      [name, description, price, stock, category, image_url, id]
    );

    const product = getOne('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ message: '商品更新成功', product });
  } catch (error) {
    res.status(500).json({ error: '更新商品失败' });
  }
};

export const deleteProduct = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = getOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!existing) {
      res.status(404).json({ error: '商品不存在' });
      return;
    }

    runQuery('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: '商品删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除商品失败' });
  }
};

export const getCategories = (req: AuthRequest, res: Response): void => {
  try {
    const categories = getAll('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ""');
    res.json({ categories: categories.map((c: any) => c.category) });
  } catch (error) {
    res.status(500).json({ error: '获取分类失败' });
  }
};
