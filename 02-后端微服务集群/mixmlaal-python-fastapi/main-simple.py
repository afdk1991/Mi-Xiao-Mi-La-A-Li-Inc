#!/usr/bin/env python3
"""
简化版 FastAPI 服务 - 不依赖复杂库
用于快速验证和演示
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import random
from datetime import datetime

app = FastAPI(title="Python FastAPI - 简化版", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Response(BaseModel):
    code: int = 200
    message: str = "success"
    data: Optional[dict] = None

@app.get("/")
async def root():
    return Response(message="Python FastAPI 简化版服务运行正常", data={
        "service": "Python FastAPI",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.get("/health")
async def health_check():
    return Response(message="健康检查通过", data={"status": "healthy"})

@app.get("/api/data/overview")
async def data_overview():
    """数据概览接口"""
    user_total = random.randint(10000, 50000)
    order_total = random.randint(5000, 20000)
    amount_total = round(random.uniform(1000000, 5000000), 2)
    return Response(data={
        "user_total": user_total,
        "order_total": order_total,
        "amount_total": amount_total,
        "today_user": random.randint(100, 500),
        "today_order": random.randint(50, 200)
    })

@app.get("/api/data/trend")
async def data_trend():
    """数据趋势接口"""
    dates = [f"05-{i:02d}" for i in range(1, 8)]
    amounts = [random.randint(10000, 50000) for _ in range(7)]
    orders = [random.randint(100, 300) for _ in range(7)]
    return Response(data={
        "dates": dates,
        "amounts": amounts,
        "orders": orders
    })

@app.get("/api/user/list")
async def user_list(page: int = 1, page_size: int = 10):
    """用户列表"""
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
    return Response(data={
        "list": users,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@app.get("/api/goods/list")
async def goods_list(page: int = 1, page_size: int = 10):
    """商品列表"""
    goods = []
    categories = ["电子产品", "服装", "食品", "家居", "运动"]
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
    return Response(data={
        "list": goods,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@app.get("/api/order/list")
async def order_list(page: int = 1, page_size: int = 10):
    """订单列表"""
    orders = []
    status_map = {0: "待付款", 1: "已付款", 2: "已发货", 3: "已完成", 4: "已取消"}
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
    return Response(data={
        "list": orders,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

if __name__ == "__main__":
    import uvicorn
    print("="*50)
    print("  Python FastAPI - 简化版服务启动中...")
    print("="*50)
    print(f"  📚 API文档: http://localhost:8001/docs")
    print(f"  🏠 健康检查: http://localhost:8001/health")
    print(f"  📊 数据概览: http://localhost:8001/api/data/overview")
    print("="*50)
    uvicorn.run("main-simple:app", host="0.0.0.0", port=8001, reload=True)
