-- ============================================
-- 亿级商用全平台超级综合体 - 数据库初始化脚本
-- 数据库: 10库分库分表设计
-- ============================================

-- 1. 系统权限库 (sys_db)
CREATE DATABASE IF NOT EXISTS sys_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sys_db;

CREATE TABLE sys_admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '管理员ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    nickname VARCHAR(100) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    role_id BIGINT COMMENT '角色ID',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    last_login_time DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_key VARCHAR(50) NOT NULL COMMENT '角色标识',
    description VARCHAR(255) COMMENT '角色描述',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

CREATE TABLE sys_menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜单ID',
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    menu_name VARCHAR(100) NOT NULL COMMENT '菜单名称',
    menu_type VARCHAR(20) COMMENT '菜单类型: menu/button',
    icon VARCHAR(100) COMMENT '图标',
    path VARCHAR(200) COMMENT '路由地址',
    component VARCHAR(255) COMMENT '组件路径',
    permission VARCHAR(100) COMMENT '权限标识',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- 2. 用户会员库 (user_db)
CREATE DATABASE IF NOT EXISTS user_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE user_db;

CREATE TABLE user_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码',
    nickname VARCHAR(100) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    gender TINYINT DEFAULT 0 COMMENT '性别: 0未知 1男 2女',
    birthday DATE COMMENT '生日',
    level_id BIGINT COMMENT '会员等级ID',
    points INT DEFAULT 0 COMMENT '积分',
    balance DECIMAL(10,2) DEFAULT 0.00 COMMENT '余额',
    status TINYINT DEFAULT 1 COMMENT '状态',
    last_login_time DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表';

CREATE TABLE user_level (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    level_name VARCHAR(50) NOT NULL COMMENT '等级名称',
    level_icon VARCHAR(255) COMMENT '等级图标',
    min_points INT DEFAULT 0 COMMENT '最低积分',
    max_points INT COMMENT '最高积分',
    discount_rate DECIMAL(4,2) DEFAULT 1.00 COMMENT '折扣率',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='会员等级表';

-- 3. 电商商品库 (shop_db)
CREATE DATABASE IF NOT EXISTS shop_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop_db;

CREATE TABLE shop_goods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
    category_id BIGINT NOT NULL COMMENT '分类ID',
    goods_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    goods_img VARCHAR(500) COMMENT '商品图片',
    goods_images TEXT COMMENT '商品图片列表(JSON)',
    price DECIMAL(10,2) NOT NULL COMMENT '售价',
    market_price DECIMAL(10,2) COMMENT '市场价',
    cost_price DECIMAL(10,2) COMMENT '成本价',
    stock INT DEFAULT 0 COMMENT '库存',
    sales INT DEFAULT 0 COMMENT '销量',
    unit VARCHAR(20) DEFAULT '件' COMMENT '单位',
    weight DECIMAL(10,2) COMMENT '重量(KG)',
    freight DECIMAL(10,2) DEFAULT 0.00 COMMENT '运费',
    description TEXT COMMENT '商品描述',
    detail_content LONGTEXT COMMENT '详情内容(HTML)',
    tags VARCHAR(255) COMMENT '标签',
    status TINYINT DEFAULT 1 COMMENT '状态: 1上架 0下架',
    is_recommend TINYINT DEFAULT 0 COMMENT '是否推荐',
    is_hot TINYINT DEFAULT 0 COMMENT '是否热销',
    is_new TINYINT DEFAULT 0 COMMENT '是否新品',
    sort_order INT DEFAULT 0 COMMENT '排序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE shop_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    category_name VARCHAR(100) NOT NULL COMMENT '分类名称',
    category_icon VARCHAR(255) COMMENT '分类图标',
    category_image VARCHAR(500) COMMENT '分类图片',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

CREATE TABLE shop_cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    sku_id BIGINT COMMENT 'SKU ID',
    goods_name VARCHAR(200) COMMENT '商品名称',
    goods_img VARCHAR(500) COMMENT '商品图片',
    price DECIMAL(10,2) COMMENT '单价',
    num INT DEFAULT 1 COMMENT '数量',
    selected TINYINT DEFAULT 1 COMMENT '选中状态',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- 4. 订单支付库 (order_db)
CREATE DATABASE IF NOT EXISTS order_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE order_db;

CREATE TABLE order_main (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    order_status TINYINT DEFAULT 0 COMMENT '订单状态: 0待付款 1待发货 2已发货 3已完成 4已取消 5退款中 6已退款',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    pay_amount DECIMAL(10,2) COMMENT '实付金额',
    freight DECIMAL(10,2) DEFAULT 0.00 COMMENT '运费',
    discount_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT '优惠金额',
    pay_type TINYINT COMMENT '支付方式: 1微信 2支付宝 3银行卡',
    pay_time DATETIME COMMENT '支付时间',
    deliver_time DATETIME COMMENT '发货时间',
    receive_time DATETIME COMMENT '收货时间',
    receiver_name VARCHAR(100) COMMENT '收货人姓名',
    receiver_phone VARCHAR(20) COMMENT '收货人电话',
    receiver_address VARCHAR(255) COMMENT '收货地址',
    remark VARCHAR(500) COMMENT '订单备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单主表';

CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL COMMENT '订单ID',
    goods_id BIGINT NOT NULL COMMENT '商品ID',
    goods_name VARCHAR(200) NOT NULL COMMENT '商品名称',
    goods_img VARCHAR(500) COMMENT '商品图片',
    sku_id BIGINT COMMENT 'SKU ID',
    sku_name VARCHAR(200) COMMENT 'SKU规格',
    price DECIMAL(10,2) NOT NULL COMMENT '单价',
    num INT NOT NULL COMMENT '数量',
    subtotal DECIMAL(10,2) NOT NULL COMMENT '小计金额',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单明细表';

-- 5. 博客资讯库 (article_db)
CREATE DATABASE IF NOT EXISTS article_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE article_db;

CREATE TABLE article (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT COMMENT '分类ID',
    title VARCHAR(255) NOT NULL COMMENT '标题',
    cover_image VARCHAR(500) COMMENT '封面图',
    summary VARCHAR(500) COMMENT '摘要',
    content LONGTEXT NOT NULL COMMENT '内容(HTML)',
    author VARCHAR(100) COMMENT '作者',
    source VARCHAR(100) COMMENT '来源',
    tags VARCHAR(255) COMMENT '标签',
    view_count INT DEFAULT 0 COMMENT '浏览量',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    comment_count INT DEFAULT 0 COMMENT '评论数',
    status TINYINT DEFAULT 1 COMMENT '状态: 1发布 0草稿',
    is_top TINYINT DEFAULT 0 COMMENT '是否置顶',
    is_recommend TINYINT DEFAULT 0 COMMENT '是否推荐',
    publish_time DATETIME COMMENT '发布时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

CREATE TABLE article_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0,
    category_name VARCHAR(100) NOT NULL,
    category_icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章分类表';

-- 6-10. 其他库结构类似，简化示例

-- 插入默认管理员
INSERT INTO sys_db.sys_admin (username, password, nickname, role_id, status) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiLXCJzJ7OqW', '超级管理员', 1, 1);

-- 插入会员等级
INSERT INTO user_db.user_level (level_name, min_points, max_points, discount_rate) VALUES
('普通会员', 0, 999, 1.00),
('银卡会员', 1000, 4999, 0.95),
('金卡会员', 5000, 9999, 0.90),
('VIP会员', 10000, NULL, 0.85);

-- 插入商品分类
INSERT INTO shop_db.shop_category (category_name, category_icon, sort_order) VALUES
('数码产品', '📱', 1),
('服装鞋帽', '👕', 2),
('食品饮料', '🍎', 3),
('家居用品', '🏠', 4),
('图书影音', '📚', 5),
('美妆护肤', '💄', 6);

-- 插入商品
INSERT INTO shop_db.shop_goods (category_id, goods_name, goods_img, price, market_price, stock, sales, status) VALUES
(1, 'iPhone 15 Pro Max', '/images/iphone15.jpg', 9999.00, 10999.00, 180, 5680, 1),
(1, 'MacBook Pro 14寸', '/images/macbook.jpg', 14999.00, 16999.00, 120, 3210, 1),
(1, 'AirPods Pro 2', '/images/airpods.jpg', 1799.00, 1999.00, 350, 12580, 1),
(1, 'Apple Watch Series 9', '/images/watch.jpg', 3199.00, 3499.00, 280, 4520, 1),
(1, 'iPad Pro 12.9寸', '/images/ipad.jpg', 9299.00, 10299.00, 150, 2890, 1);
