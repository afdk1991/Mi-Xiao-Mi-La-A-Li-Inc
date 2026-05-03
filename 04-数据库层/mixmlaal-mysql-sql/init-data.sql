-- ============================================
-- 亿级商用全平台超级综合体 - 数据库初始化数据
-- 用于插入测试数据和默认配置
-- ============================================

USE sys_db;

-- 插入默认管理员账号 (密码: 123456, BCrypt加密)
INSERT INTO sys_admin (username, password, nickname, avatar, phone, email, role_id, status, create_time) VALUES
('admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/TU5U0s4CCy', '超级管理员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', '13800000000', 'admin@example.com', 1, 1, NOW()),
('manager', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/TU5U0s4CCy', '运营经理', 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager', '13800000001', 'manager@example.com', 2, 1, NOW()),
('operator', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/TU5U0s4CCy', '运营专员', 'https://api.dicebear.com/7.x/avataaars/svg?seed=operator', '13800000002', 'operator@example.com', 3, 1, NOW());

-- 插入角色数据
INSERT INTO sys_role (role_name, role_key, description, status, create_time) VALUES
('超级管理员', 'super_admin', '拥有系统所有权限', 1, NOW()),
('运营经理', 'operation_manager', '运营管理权限', 1, NOW()),
('运营专员', 'operator', '基础运营权限', 1, NOW()),
('客服', 'customer_service', '客服权限', 1, NOW());

-- 插入菜单数据
INSERT INTO sys_menu (parent_id, menu_name, menu_type, icon, path, component, permission, sort_order, status, create_time) VALUES
(0, '系统管理', 'menu', 'Setting', '/system', NULL, NULL, 1, 1, NOW()),
(1, '管理员管理', 'menu', 'User', '/system/admin', '/system/admin/index', 'system:admin:list', 1, 1, NOW()),
(1, '角色管理', 'menu', 'Role', '/system/role', '/system/role/index', 'system:role:list', 2, 1, NOW()),
(1, '菜单管理', 'menu', 'Menu', '/system/menu', '/system/menu/index', 'system:menu:list', 3, 1, NOW()),
(0, '用户管理', 'menu', 'Users', '/user', NULL, NULL, 2, 1, NOW()),
(5, '用户列表', 'menu', 'UserList', '/user/list', '/user/list/index', 'user:list:list', 1, 1, NOW()),
(5, '会员等级', 'menu', 'Medal', '/user/level', '/user/level/index', 'user:level:list', 2, 1, NOW()),
(0, '商品管理', 'menu', 'Goods', '/goods', NULL, NULL, 3, 1, NOW()),
(8, '商品列表', 'menu', 'GoodsList', '/goods/list', '/goods/list/index', 'goods:list:list', 1, 1, NOW()),
(8, '商品分类', 'menu', 'Category', '/goods/category', '/goods/category/index', 'goods:category:list', 2, 1, NOW()),
(0, '订单管理', 'menu', 'Orders', '/order', NULL, NULL, 4, 1, NOW()),
(11, '订单列表', 'menu', 'OrderList', '/order/list', '/order/list/index', 'order:list:list', 1, 1, NOW()),
(11, '退款管理', 'menu', 'Refund', '/order/refund', '/order/refund/index', 'order:refund:list', 2, 1, NOW()),
(0, '数据统计', 'menu', 'DataAnalysis', '/data', NULL, NULL, 5, 1, NOW()),
(14, '数据概览', 'menu', 'Dashboard', '/data/dashboard', '/data/dashboard/index', 'data:dashboard:list', 1, 1, NOW()),
(14, '数据报表', 'menu', 'Report', '/data/report', '/data/report/index', 'data:report:list', 2, 1, NOW());

USE user_db;

-- 插入会员等级数据
INSERT INTO user_level (level_name, level_icon, min_points, max_points, discount_rate, create_time) VALUES
('普通会员', 'https://cdn.yijimall.com/levels/normal.png', 0, 999, 1.00, NOW()),
('银卡会员', 'https://cdn.yijimall.com/levels/silver.png', 1000, 4999, 0.95, NOW()),
('金卡会员', 'https://cdn.yijimall.com/levels/gold.png', 5000, 9999, 0.90, NOW()),
('VIP会员', 'https://cdn.yijimall.com/levels/vip.png', 10000, NULL, 0.85, NOW());

-- 插入测试用户数据 (密码: 123456)
INSERT INTO user_info (username, password, nickname, avatar, phone, email, gender, birthday, level_id, points, balance, status, create_time) VALUES
('user', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/TU5U0s4CCy', '张三', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', '13800138000', 'user@example.com', 1, '1990-01-01', 3, 5800, 1234.56, 1, NOW()),
('test_user', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/TU5U0s4CCy', '李四', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', '13800138001', 'test@example.com', 2, '1992-05-15', 2, 2500, 567.89, 1, NOW()),
('vip_user', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/TU5U0s4CCy', '王五', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', '13800138002', 'vip@example.com', 1, '1988-10-20', 4, 15000, 9999.99, 1, NOW());

USE shop_db;

-- 插入商品分类数据
INSERT INTO shop_category (category_name, parent_id, icon, sort_order, status, create_time) VALUES
('手机数码', 0, 'https://cdn.yijimall.com/category/phone.png', 1, 1, NOW()),
('电脑办公', 0, 'https://cdn.yijimall.com/category/computer.png', 2, 1, NOW()),
('服装鞋帽', 0, 'https://cdn.yijimall.com/category/clothing.png', 3, 1, NOW()),
('食品生鲜', 0, 'https://cdn.yijimall.com/category/food.png', 4, 1, NOW()),
('美妆护肤', 0, 'https://cdn.yijimall.com/category/beauty.png', 5, 1, NOW()),
('家用电器', 0, 'https://cdn.yijimall.com/category/appliance.png', 6, 1, NOW());

INSERT INTO shop_category (category_name, parent_id, sort_order, status, create_time) VALUES
('手机', 1, 1, 1, NOW()),
('耳机', 1, 2, 1, NOW()),
('平板电脑', 1, 3, 1, NOW()),
('笔记本电脑', 2, 1, 1, NOW()),
('台式机', 2, 2, 1, NOW()),
('显示器', 2, 3, 1, NOW()),
('男装', 3, 1, 1, NOW()),
('女装', 3, 2, 1, NOW()),
('童装', 3, 3, 1, NOW()),
('水果', 4, 1, 1, NOW()),
('蔬菜', 4, 2, 1, NOW()),
('肉类', 4, 3, 1, NOW()),
('面部护肤', 5, 1, 1, NOW()),
('彩妆', 5, 2, 1, NOW()),
('冰箱', 6, 1, 1, NOW()),
('洗衣机', 6, 2, 1, NOW()),
('空调', 6, 3, 1, NOW());

-- 插入热门商品数据
INSERT INTO shop_goods (category_id, goods_name, goods_img, goods_images, price, market_price, stock, sales, is_hot, is_new, goods_desc, create_time) VALUES
(7, 'iPhone 15 Pro 256GB', 'https://picsum.photos/id/1/400/400', '["https://picsum.photos/id/1/400/400","https://picsum.photos/id/2/400/400"]', 7999.00, 8999.00, 100, 256, 1, 1, 'iPhone 15 Pro，钛金属设计，A17 Pro芯片，4800万像素主摄', NOW()),
(7, '华为 Mate 60 Pro', 'https://picsum.photos/id/3/400/400', '["https://picsum.photos/id/3/400/400","https://picsum.photos/id/4/400/400"]', 6999.00, 7999.00, 150, 189, 1, 1, '华为 Mate 60 Pro，麒麟9000S芯片，卫星通话功能', NOW()),
(7, '小米 14 Ultra', 'https://picsum.photos/id/5/400/400', '["https://picsum.photos/id/5/400/400"]', 5999.00, 6999.00, 200, 145, 1, 0, '小米 14 Ultra徕卡光学镜头，骁龙8 Gen 3处理器', NOW()),
(8, 'AirPods Pro 2代', 'https://picsum.photos/id/6/400/400', '["https://picsum.photos/id/6/400/400"]', 1899.00, 2199.00, 300, 512, 1, 1, 'AirPods Pro主动降噪，空间音频，无线充电盒', NOW()),
(9, 'iPad Pro 12.9英寸', 'https://picsum.photos/id/7/400/400', '["https://picsum.photos/id/7/400/400"]', 9999.00, 10999.00, 80, 128, 1, 0, 'iPad Pro M2芯片，12.9英寸Liquid视网膜XDR屏', NOW()),
(10, 'MacBook Pro 14英寸', 'https://picsum.photos/id/8/400/400', '["https://picsum.photos/id/8/400/400"]', 15999.00, 17999.00, 50, 96, 1, 1, 'MacBook Pro M3 Pro芯片，14英寸Liquid视网膜XDR屏', NOW()),
(10, 'ThinkPad X1 Carbon', 'https://picsum.photos/id/9/400/400', '["https://picsum.photos/id/9/400/400"]', 12999.00, 14999.00, 60, 78, 0, 0, 'ThinkPad X1 Carbon轻薄商务本，Intel i7处理器', NOW()),
(13, '男士纯棉T恤', 'https://picsum.photos/id/10/400/400', '["https://picsum.photos/id/10/400/400"]', 99.00, 199.00, 500, 1024, 1, 1, '2024新款男士纯棉T恤，多色可选', NOW()),
(14, '女士连衣裙', 'https://picsum.photos/id/11/400/400', '["https://picsum.photos/id/11/400/400"]', 299.00, 399.00, 300, 856, 1, 0, '2024新款女士碎花连衣裙，夏季必备', NOW()),
(16, '新鲜苹果 5斤装', 'https://picsum.photos/id/12/400/400', '["https://picsum.photos/id/12/400/400"]', 29.90, 39.90, 1000, 2560, 1, 1, '山东红富士苹果，新鲜当季水果，5斤装', NOW()),
(16, '有机蔬菜礼包', 'https://picsum.photos/id/13/400/400', '["https://picsum.photos/id/13/400/400"]', 49.90, 69.90, 500, 1280, 1, 0, '有机蔬菜礼包，包含10种新鲜蔬菜', NOW()),
(19, 'SK-II神仙水', 'https://picsum.photos/id/14/400/400', '["https://picsum.photos/id/14/400/400"]', 899.00, 1099.00, 200, 512, 1, 1, 'SK-II护肤精华露230ml，明星产品', NOW()),
(19, '兰蔻小黑瓶', 'https://picsum.photos/id/15/400/400', '["https://picsum.photos/id/15/400/400"]', 760.00, 899.00, 150, 386, 1, 0, '兰蔻小黑瓶精华50ml，修护肌肤', NOW()),
(22, '海尔对开门冰箱', 'https://picsum.photos/id/16/400/400', '["https://picsum.photos/id/16/400/400"]', 3999.00, 4999.00, 100, 256, 1, 1, '海尔对开门冰箱601L，变频节能', NOW()),
(23, '小天鹅滚筒洗衣机', 'https://picsum.photos/id/17/400/400', '["https://picsum.photos/id/17/400/400"]', 2599.00, 3299.00, 120, 320, 1, 0, '小天鹅滚筒洗衣机10kg，全自动', NOW()),
(24, '格力空调 3匹', 'https://picsum.photos/id/18/400/400', '["https://picsum.photos/id/18/400/400"]', 4599.00, 5599.00, 80, 189, 1, 1, '格力空调3匹变频冷暖，智能控制', NOW());

USE order_db;

-- 插入测试订单数据
INSERT INTO order_main (user_id, order_no, total_amount, discount_amount, pay_amount, pay_type, pay_time, status, receiver_name, receiver_phone, receiver_address, create_time) VALUES
(1, 'ORD202401150001', 7999.00, 0.00, 7999.00, 1, '2024-01-15 10:30:00', 3, '张三', '13800138000', '北京市朝阳区某某街道某某小区1号楼101', '2024-01-15 10:00:00'),
(1, 'ORD202401160001', 99.00, 0.00, 99.00, 2, '2024-01-16 15:20:00', 3, '张三', '13800138000', '北京市朝阳区某某街道某某小区1号楼101', '2024-01-16 15:00:00'),
(2, 'ORD202401170001', 1899.00, 0.00, 1899.00, 1, '2024-01-17 11:45:00', 2, '李四', '13800138001', '上海市浦东新区某某路某某号', '2024-01-17 11:00:00'),
(3, 'ORD202401180001', 9999.00, 500.00, 9499.00, 3, '2024-01-18 20:30:00', 1, '王五', '13800138002', '广州市天河区某某大道某某大厦', '2024-01-18 20:00:00');

-- 插入订单明细数据
INSERT INTO order_detail (order_id, goods_id, goods_name, goods_img, price, quantity, subtotal) VALUES
(1, 1, 'iPhone 15 Pro 256GB', 'https://picsum.photos/id/1/400/400', 7999.00, 1, 7999.00),
(2, 13, '男士纯棉T恤', 'https://picsum.photos/id/10/400/400', 99.00, 1, 99.00),
(3, 8, 'AirPods Pro 2代', 'https://picsum.photos/id/6/400/400', 1899.00, 1, 1899.00),
(4, 9, 'iPad Pro 12.9英寸', 'https://picsum.photos/id/7/400/400', 9999.00, 1, 9999.00);

USE article_db;

-- 插入文章分类数据
INSERT INTO article_category (category_name, sort_order, status, create_time) VALUES
('技术支持', 1, 1, NOW()),
('使用教程', 2, 1, NOW()),
('常见问题', 3, 1, NOW()),
('优惠活动', 4, 1, NOW()),
('行业资讯', 5, 1, NOW());

-- 插入文章数据
INSERT INTO article_info (category_id, title, author, summary, content, cover_image, status, create_time) VALUES
(1, 'iPhone 15 Pro 拍摄技巧全解析', 'Admin', '详细讲解iPhone 15 Pro的拍摄功能和技巧', '<p>本文详细介绍iPhone 15 Pro的拍摄功能...</p>', 'https://picsum.photos/id/20/800/400', 1, NOW()),
(2, '如何在APP上下单购物', 'Admin', '完整的购物下单教程', '<p>本教程将详细介绍如何在我们的APP中完成购物...</p>', 'https://picsum.photos/id/21/800/400', 1, NOW()),
(3, '订单如何申请退款', 'Admin', '退款流程详解', '<p>如果您需要申请退款，请按照以下步骤操作...</p>', 'https://picsum.photos/id/22/800/400', 1, NOW()),
(4, '新年大促 全场5折起', 'Admin', '新年促销活动公告', '<p>为感谢广大用户支持，新年期间全场商品5折起...</p>', 'https://picsum.photos/id/23/800/400', 1, NOW()),
(5, '2024年电商行业发展趋势', 'Admin', '电商行业分析报告', '<p>本文分析2024年电商行业的发展趋势...</p>', 'https://picsum.photos/id/24/800/400', 1, NOW());
