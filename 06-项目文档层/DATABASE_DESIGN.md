# 亿级商用全平台项目 - 数据库设计

## 数据库分库规划（亿级微服务架构）

采用垂直分库，每个业务独立数据库，支持分库分表、后期无缝扩容：

1. **sys_db** - 系统权限库（后台角色、菜单、权限、管理员）
2. **user_db** - 用户会员库（用户、会员、等级、登录日志）
3. **shop_db** - 电商商品库（商品、分类、购物车、收藏）
4. **order_db** - 订单支付库（订单、支付、退款、物流）
5. **article_db** - 博客资讯库（文章、分类、评论、点赞）
6. **attend_db** - 人事考勤库（部门、员工、打卡、审批）
7. **file_db** - 文件云盘库（文件、文件夹、分享、权限）
8. **im_db** - 社交即时通讯库（好友、群聊、聊天记录）
9. **life_db** - 本地生活库（门店、团购、预约、核销）
10. **data_db** - 数据统计库（流量、营收、用户画像、大屏数据）

---

## 核心建表 SQL

### 1. sys_db 系统权限库

```sql
-- 管理员表
CREATE TABLE sys_admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL COMMENT '账号',
    password VARCHAR(100) NOT NULL COMMENT '密码加密',
    nickname VARCHAR(50) COMMENT '昵称',
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar VARCHAR(255),
    status TINYINT DEFAULT 1 COMMENT '1正常 0禁用',
    create_time DATETIME DEFAULT NOW(),
    update_time DATETIME DEFAULT NOW() ON UPDATE NOW(),
    deleted TINYINT DEFAULT 0 COMMENT '软删除'
) COMMENT '系统管理员';

-- 角色表
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(50) NOT NULL,
    remark VARCHAR(255),
    create_time DATETIME DEFAULT NOW(),
    deleted TINYINT DEFAULT 0
) COMMENT '角色';

-- 菜单表
CREATE TABLE sys_menu (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0,
    menu_name VARCHAR(50),
    menu_url VARCHAR(255),
    menu_icon VARCHAR(255),
    sort INT DEFAULT 0,
    create_time DATETIME DEFAULT NOW()
) COMMENT '系统菜单';
```

### 2. user_db 用户会员库

```sql
-- 普通用户表
CREATE TABLE user_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    account VARCHAR(50) NOT NULL,
    password VARCHAR(100),
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    phone VARCHAR(20),
    openid VARCHAR(100) COMMENT '微信/小程序openid',
    level INT DEFAULT 0 COMMENT '会员等级',
    balance DECIMAL(10,2) DEFAULT 0 COMMENT '余额',
    status TINYINT DEFAULT 1,
    register_time DATETIME DEFAULT NOW(),
    deleted TINYINT DEFAULT 0
) COMMENT '平台用户';

-- 会员等级表
CREATE TABLE user_level (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    level_name VARCHAR(50),
    min_exp INT,
    max_exp INT,
    discount DECIMAL(3,2) COMMENT '折扣',
    create_time DATETIME DEFAULT NOW()
) COMMENT '会员等级';
```

### 3. shop_db 电商商品库

```sql
-- 商品分类
CREATE TABLE shop_category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT DEFAULT 0,
    category_name VARCHAR(100),
    sort INT DEFAULT 0,
    status TINYINT DEFAULT 1
) COMMENT '商品分类';

-- 商品表
CREATE TABLE shop_goods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT,
    goods_name VARCHAR(200) NOT NULL,
    goods_img VARCHAR(255),
    price DECIMAL(10,2),
    market_price DECIMAL(10,2),
    stock INT DEFAULT 0,
    sales INT DEFAULT 0,
    content TEXT,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT NOW(),
    deleted TINYINT DEFAULT 0
) COMMENT '商品';

-- 购物车
CREATE TABLE shop_cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    goods_id BIGINT,
    num INT DEFAULT 1,
    create_time DATETIME DEFAULT NOW()
) COMMENT '购物车';
```

### 4. order_db 订单支付库

```sql
-- 订单主表
CREATE TABLE order_main (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
    user_id BIGINT,
    total_amount DECIMAL(10,2),
    pay_amount DECIMAL(10,2),
    status TINYINT COMMENT '0待付款 1已付款 2已发货 3已完成 4已取消',
    pay_type TINYINT COMMENT '1微信 2支付宝 3余额',
    create_time DATETIME DEFAULT NOW(),
    pay_time DATETIME NULL,
    delete_time DATETIME NULL
) COMMENT '订单主表';

-- 订单子项
CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(50),
    goods_id BIGINT,
    goods_name VARCHAR(200),
    goods_img VARCHAR(255),
    price DECIMAL(10,2),
    num INT,
    create_time DATETIME DEFAULT NOW()
) COMMENT '订单子项';
```

### 5. article_db 博客资讯库

```sql
CREATE TABLE article (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    category_id BIGINT,
    content TEXT,
    author VARCHAR(50),
    view_num INT DEFAULT 0,
    like_num INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT NOW()
) COMMENT '文章资讯';
```

### 6. attend_db 人事考勤库

```sql
CREATE TABLE attend_staff (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dept_id BIGINT,
    staff_name VARCHAR(50),
    phone VARCHAR(20),
    post VARCHAR(50),
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT NOW()
) COMMENT '员工信息';

CREATE TABLE attend_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    staff_id BIGINT,
    clock_in DATETIME,
    clock_out DATETIME,
    clock_date DATE,
    status TINYINT COMMENT '正常/迟到/早退/旷工'
) COMMENT '考勤打卡记录';
```

### 7. file_db 文件云盘库

```sql
CREATE TABLE file_info (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    file_name VARCHAR(255),
    file_suffix VARCHAR(20),
    file_size BIGINT,
    file_url VARCHAR(255),
    folder_id BIGINT DEFAULT 0,
    create_time DATETIME DEFAULT NOW()
) COMMENT '文件资源';
```
