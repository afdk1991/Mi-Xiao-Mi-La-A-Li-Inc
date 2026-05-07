const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
let db;
async function initDB() {
    try {
        db = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'mysql',
            port: process.env.MYSQL_PORT || 3306,
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'MixmLa@2025#SecureDB',
            database: process.env.MYSQL_DATABASE || 'mixmlaal',
            charset: 'utf8mb4'
        });
        console.log('MySQL数据库连接成功');
    } catch (error) {
        console.error('MySQL数据库连接失败:', error);
        process.exit(1);
    }
}

// Redis连接
let redisClient;
async function initRedis() {
    try {
        const redisConfig = {
            socket: {
                host: process.env.REDIS_HOST || 'redis',
                port: process.env.REDIS_PORT || 6379
            }
        };
        const redisPassword = process.env.REDIS_PASSWORD;
        if (redisPassword) {
            redisConfig.password = redisPassword;
        }
        redisClient = redis.createClient(redisConfig);
        await redisClient.connect();
        console.log('Redis连接成功');
    } catch (error) {
        console.error('Redis连接失败:', error);
    }
}

// 健康检查
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'backend' });
});

// API路由
app.get('/api/v1/users', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, username, email, phone, avatar, status, created_at FROM users');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/v1/products', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products WHERE status = 1');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/v1/products/:id', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ? AND status = 1', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: '商品不存在' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 启动服务
async function start() {
    await initDB();
    await initRedis();
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`后端服务运行在端口 ${PORT}`);
    });
}

start();

// 优雅关闭
process.on('SIGTERM', async () => {
    console.log('收到SIGTERM信号，正在关闭服务...');
    if (db) await db.end();
    if (redisClient) await redisClient.quit();
    process.exit(0);
});