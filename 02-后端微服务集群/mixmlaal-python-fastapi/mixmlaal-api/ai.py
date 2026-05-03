from fastapi import APIRouter, Query
from core.response import success
import random
from datetime import datetime

router = APIRouter(prefix="/ai", tags=["AI智能服务"])

@router.get("/recommend")
async def get_recommend(user_id: int = Query(None, description="用户ID")):
    """商品智能推荐"""
    products = [
        {"id": i, "name": f"推荐商品{i}", "price": round(random.uniform(100, 1000), 2), "reason": random.choice(["猜你喜欢", "热销商品", "新品推荐", "同类商品"])}
        for i in range(1, 6)
    ]
    return success({
        "user_id": user_id,
        "recommendations": products,
        "algorithm": "协同过滤算法 v2.0"
    })

@router.get("/similar")
async def get_similar(goods_id: int = Query(..., description="商品ID")):
    """相似商品推荐"""
    products = [
        {"id": i, "name": f"相似商品{i}", "similarity": round(random.uniform(0.8, 0.99), 2)}
        for i in range(1, 6)
    ]
    return success({
        "goods_id": goods_id,
        "similar_products": products
    })

@router.get("/personalized")
async def get_personalized(user_id: int = Query(..., description="用户ID")):
    """个性化推荐"""
    return success({
        "user_id": user_id,
        "browse_history": [
            {"goods_id": 1, "name": "iPhone 15", "time": "2024-01-15 10:00"},
            {"goods_id": 2, "name": "MacBook Pro", "time": "2024-01-15 11:00"}
        ],
        "recommendations": [
            {"id": 1, "name": "AirPods Pro", "reason": "基于您的浏览历史推荐"},
            {"id": 2, "name": "iPad Air", "reason": "同类用户也在购买"}
        ]
    })

@router.post("/feedback")
async def submit_feedback(data: dict):
    """推荐反馈"""
    return success({
        "message": "反馈已收到，感谢您的建议！",
        "data": data
    })

@router.get("/hot-search")
async def get_hot_search():
    """热门搜索词"""
    keywords = [
        {"keyword": "iPhone", "count": random.randint(1000, 5000), "trend": "up"},
        {"keyword": "MacBook", "count": random.randint(800, 3000), "trend": "up"},
        {"keyword": "AirPods", "count": random.randint(600, 2500), "trend": "stable"},
        {"keyword": "iPad", "count": random.randint(500, 2000), "trend": "down"},
        {"keyword": "华为", "count": random.randint(400, 1800), "trend": "up"}
    ]
    return success({"hot_search": keywords})

@router.get("/trending")
async def get_trending():
    """流行趋势"""
    trends = [
        {"category": "手机", "trend": "折叠屏手机销量增长200%", "growth": "+200%"},
        {"category": "电脑", "trend": "轻薄本成为主流选择", "growth": "+150%"},
        {"category": "耳机", "trend": "降噪耳机需求激增", "growth": "+180%"}
    ]
    return success({"trends": trends})
