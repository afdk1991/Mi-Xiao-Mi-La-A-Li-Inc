import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

let db: SqlJsDatabase | null = null;

const dbPath = path.join(process.cwd(), 'data', 'ecommerce.db');

async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  const result = db.exec('SELECT COUNT(*) as count FROM products');
  if (result.length === 0 || result[0].values[0][0] === 0) {
    const seedProducts = [
      ['iPhone 15 Pro', '最新款苹果手机', 7999, 100, '手机', 'https://picsum.photos/id/1/300/300'],
      ['MacBook Pro', '专业级笔记本电脑', 12999, 50, '电脑', 'https://picsum.photos/id/2/300/300'],
      ['AirPods Pro', '主动降噪无线耳机', 1999, 200, '配件', 'https://picsum.photos/id/3/300/300'],
      ['iPad Air', '轻薄平板电脑', 4799, 80, '平板', 'https://picsum.photos/id/4/300/300'],
      ['Apple Watch', '智能手表', 2999, 150, '手表', 'https://picsum.photos/id/5/300/300'],
      ['小米手机', '高性价比智能手机', 1999, 300, '手机', 'https://picsum.photos/id/6/300/300'],
      ['华为笔记本', '商务轻薄本', 5999, 60, '电脑', 'https://picsum.photos/id/7/300/300'],
      ['索尼耳机', '高端降噪耳机', 2499, 120, '配件', 'https://picsum.photos/id/8/300/300'],
    ];

    const stmt = db.prepare('INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    for (const product of seedProducts) {
      stmt.run(product);
    }
    stmt.free();
  }

  saveDatabase();
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, buffer);
  }
}

export function getDb(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export function runQuery(sql: string, params: any[] = []): any {
  const database = getDb();
  try {
    database.run(sql, params);
    saveDatabase();
    return { lastInsertRowid: database.exec('SELECT last_insert_rowid()')[0]?.values[0][0] };
  } catch (error) {
    throw error;
  }
}

export function getOne(sql: string, params: any[] = []): any {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

export function getAll(sql: string, params: any[] = []): any[] {
  const database = getDb();
  const results: any[] = [];
  const stmt = database.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export default initDatabase;
