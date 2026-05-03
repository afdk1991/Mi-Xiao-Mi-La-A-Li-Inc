#!/usr/bin/env python3
"""
纯Python HTTP服务器 - 不依赖任何框架
确保在任何Python环境都能运行
"""
import http.server
import socketserver
import json
import random
from datetime import datetime
from urllib.parse import urlparse, parse_qs

PORT = 8001

class SimpleHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def _send_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query_params = parse_qs(parsed_path.query)

        if path == '/' or path == '':
            response = {
                "code": 200,
                "message": "Python后端服务运行正常 (纯Python版)",
                "data": {
                    "service": "Python Pure HTTP Server",
                    "version": "1.0.0",
                    "port": PORT,
                    "timestamp": datetime.now().isoformat()
                }
            }
            self._send_response(response)

        elif path == '/health':
            response = {
                "code": 200,
                "message": "健康检查通过",
                "data": {"status": "healthy"}
            }
            self._send_response(response)

        elif path == '/api/data/overview':
            user_total = random.randint(10000, 50000)
            order_total = random.randint(5000, 20000)
            amount_total = round(random.uniform(1000000, 5000000), 2)
            response = {
                "code": 200,
                "message": "success",
                "data": {
                    "user_total": user_total,
                    "order_total": order_total,
                    "amount_total": amount_total,
                    "today_user": random.randint(100, 500),
                    "today_order": random.randint(50, 200)
                }
            }
            self._send_response(response)

        elif path == '/api/data/trend':
            dates = [f"05-{i:02d}" for i in range(1, 8)]
            amounts = [random.randint(10000, 50000) for _ in range(7)]
            orders = [random.randint(100, 300) for _ in range(7)]
            response = {
                "code": 200,
                "message": "success",
                "data": {
                    "dates": dates,
                    "amounts": amounts,
                    "orders": orders
                }
            }
            self._send_response(response)

        elif path == '/api/user/list':
            page = int(query_params.get('page', [1])[0])
            page_size = int(query_params.get('page_size', [10])[0])
            users = []
            for i in range(page_size):
                idx = (page - 1) * page_size + i + 1
                users.append({
                    "id": idx,
                    "username": f"user{idx}",
                    "nickname": f"用户{idx}",
                    "email": f"user{idx}@example.com",
                    "phone": f"138{random.randint(10000000, 99999999)}",
                    "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={idx}",
                    "status": random.choice([0, 1]),
                    "create_time": "2024-05-01 10:00:00"
                })
            response = {
                "code": 200,
                "message": "success",
                "data": {
                    "list": users,
                    "total": 100,
                    "page": page,
                    "page_size": page_size
                }
            }
            self._send_response(response)

        elif path == '/api/goods/list':
            page = int(query_params.get('page', [1])[0])
            page_size = int(query_params.get('page_size', [10])[0])
            categories = ["电子产品", "服装", "食品", "家居", "运动"]
            goods = []
            for i in range(page_size):
                idx = (page - 1) * page_size + i + 1
                goods.append({
                    "id": idx,
                    "name": f"商品{idx} - {categories[i % 5]}",
                    "description": f"这是商品{idx}的详细描述",
                    "price": round(random.uniform(10, 1000), 2),
                    "origin_price": round(random.uniform(100, 2000), 2),
                    "stock": random.randint(0, 1000),
                    "sales": random.randint(0, 5000),
                    "image": f"https://picsum.photos/200/200?random={idx}",
                    "status": random.choice([0, 1]),
                    "category": categories[i % 5],
                    "create_time": "2024-05-01 10:00:00"
                })
            response = {
                "code": 200,
                "message": "success",
                "data": {
                    "list": goods,
                    "total": 100,
                    "page": page,
                    "page_size": page_size
                }
            }
            self._send_response(response)

        elif path == '/api/order/list':
            page = int(query_params.get('page', [1])[0])
            page_size = int(query_params.get('page_size', [10])[0])
            status_map = {0: "待付款", 1: "已付款", 2: "已发货", 3: "已完成", 4: "已取消"}
            orders = []
            for i in range(page_size):
                idx = (page - 1) * page_size + i + 1
                order_id = f"ORD{datetime.now().strftime('%Y%m%d')}{idx:06d}"
                orders.append({
                    "id": idx,
                    "order_id": order_id,
                    "user_id": random.randint(1, 100),
                    "username": f"user{random.randint(1, 100)}",
                    "total_amount": round(random.uniform(100, 10000), 2),
                    "status": random.choice([0, 1, 2, 3, 4]),
                    "status_text": status_map[random.choice([0, 1, 2, 3, 4])],
                    "create_time": "2024-05-01 10:00:00",
                    "pay_time": "2024-05-01 10:05:00"
                })
            response = {
                "code": 200,
                "message": "success",
                "data": {
                    "list": orders,
                    "total": 100,
                    "page": page,
                    "page_size": page_size
                }
            }
            self._send_response(response)

        elif path == '/docs' or path == '/api':
            html = '''
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Python后端服务 API 文档</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 1000px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
                    h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
                    h2 { color: #555; margin-top: 30px; }
                    .endpoint { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .method { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-right: 10px; }
                    .get { background: #61affe; color: white; }
                    .post { background: #49cc90; color: white; }
                    .path { font-family: monospace; font-size: 16px; color: #333; }
                    .description { color: #666; margin-top: 10px; }
                    .test-btn { background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
                    .test-btn:hover { background: #45a049; }
                </style>
            </head>
            <body>
                <h1>📡 Python后端服务 - API 文档</h1>
                <p style="color: #666;">服务运行正常! 以下是可用的API接口:</p>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/</span>
                    <p class="description">服务根路径 - 返回服务信息</p>
                    <button class="test-btn" onclick="testAPI('/')">测试</button>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/health</span>
                    <p class="description">健康检查接口</p>
                    <button class="test-btn" onclick="testAPI('/health')">测试</button>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/data/overview</span>
                    <p class="description">数据概览 - 用户数、订单数、金额统计</p>
                    <button class="test-btn" onclick="testAPI('/api/data/overview')">测试</button>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/data/trend</span>
                    <p class="description">数据趋势 - 近7天销售趋势</p>
                    <button class="test-btn" onclick="testAPI('/api/data/trend')">测试</button>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/user/list?page=1&page_size=10</span>
                    <p class="description">用户列表 - 支持分页查询</p>
                    <button class="test-btn" onclick="testAPI('/api/user/list?page=1&page_size=5')">测试</button>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/goods/list?page=1&page_size=10</span>
                    <p class="description">商品列表 - 支持分页查询</p>
                    <button class="test-btn" onclick="testAPI('/api/goods/list?page=1&page_size=5')">测试</button>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/api/order/list?page=1&page_size=10</span>
                    <p class="description">订单列表 - 支持分页查询</p>
                    <button class="test-btn" onclick="testAPI('/api/order/list?page=1&page_size=5')">测试</button>
                </div>
                
                <h2>📋 测试结果</h2>
                <pre id="result" style="background: white; padding: 20px; border-radius: 8px; max-height: 400px; overflow: auto;"></pre>
                
                <script>
                    function testAPI(path) {
                        fetch(path)
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                            })
                            .catch(error => {
                                document.getElementById('result').textContent = '错误: ' + error;
                            });
                    }
                </script>
            </body>
            </html>
            '''
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(html.encode('utf-8'))

        else:
            response = {
                "code": 404,
                "message": f"路径不存在: {path}",
                "data": None
            }
            self._send_response(response, 404)

def main():
    with socketserver.TCPServer(("", PORT), SimpleHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("  🎉 Python纯HTTP服务已启动!")
        print("=" * 60)
        print(f"  📍 服务地址: http://localhost:{PORT}")
        print(f"  📚 API文档: http://localhost:{PORT}/docs")
        print(f"  🏥 健康检查: http://localhost:{PORT}/health")
        print(f"  📊 数据概览: http://localhost:{PORT}/api/data/overview")
        print("=" * 60)
        print("  按 Ctrl+C 可停止服务")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  服务已停止")
            httpd.shutdown()

if __name__ == "__main__":
    main()
