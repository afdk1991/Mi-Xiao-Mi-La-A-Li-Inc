from fastapi import APIRouter, Query
from core.response import success
import random
from datetime import datetime

router = APIRouter(prefix="/article", tags=["文章资讯"])

@router.get("/list")
async def get_article_list(
    page: int = Query(1, description="页码"),
    page_size: int = Query(10, description="每页数量"),
    category_id: int = Query(None, description="分类ID"),
    keyword: str = Query(None, description="关键词")
):
    """文章列表"""
    articles = [
        {
            "id": i,
            "title": f"文章标题{i}",
            "summary": f"这是文章{i}的摘要内容...",
            "author": "Admin",
            "category": random.choice(["技术支持", "使用教程", "常见问题", "优惠活动"]),
            "cover_image": f"https://picsum.photos/id/{i}/400/300",
            "view_count": random.randint(100, 10000),
            "like_count": random.randint(10, 1000),
            "comment_count": random.randint(5, 500),
            "create_time": "2024-01-15 10:00:00",
            "is_top": i == 1
        }
        for i in range(1, 11)
    ]
    return success({
        "list": articles,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.get("/detail")
async def get_article_detail(article_id: int = Query(..., description="文章ID")):
    """文章详情"""
    return success({
        "id": article_id,
        "title": "iPhone 15 Pro 拍摄技巧全解析",
        "summary": "详细讲解iPhone 15 Pro的拍摄功能和技巧",
        "content": "<p>本文详细介绍iPhone 15 Pro的拍摄功能...</p>",
        "author": "Admin",
        "category": "技术支持",
        "cover_image": "https://picsum.photos/400/300",
        "view_count": 2560,
        "like_count": 128,
        "comment_count": 56,
        "create_time": "2024-01-15 10:00:00",
        "update_time": "2024-01-15 15:30:00",
        "tags": ["iPhone", "拍摄技巧", "摄影"]
    })

@router.get("/categories")
async def get_article_categories():
    """文章分类列表"""
    categories = [
        {"id": 1, "name": "技术支持", "count": 25, "icon": "tech"},
        {"id": 2, "name": "使用教程", "count": 32, "icon": "tutorial"},
        {"id": 3, "name": "常见问题", "count": 18, "icon": "faq"},
        {"id": 4, "name": "优惠活动", "count": 15, "icon": "promotion"},
        {"id": 5, "name": "行业资讯", "count": 28, "icon": "news"}
    ]
    return success({"categories": categories})

@router.get("/hot")
async def get_hot_articles():
    """热门文章"""
    articles = [
        {"id": i, "title": f"热门文章{i}", "view_count": random.randint(1000, 10000)}
        for i in range(1, 6)
    ]
    return success({"hot_articles": articles})

@router.get("/related")
async def get_related_articles(article_id: int = Query(..., description="文章ID")):
    """相关文章"""
    articles = [
        {"id": i, "title": f"相关文章{i}", "summary": "相关摘要..."}
        for i in range(1, 4)
    ]
    return success({"related_articles": articles})

@router.post("/like")
async def like_article(article_id: int = Query(..., description="文章ID")):
    """文章点赞"""
    return success({"message": "点赞成功", "like_count": random.randint(100, 1000)})

@router.get("/comments")
async def get_article_comments(
    article_id: int = Query(..., description="文章ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量")
):
    """文章评论列表"""
    comments = [
        {
            "id": i,
            "user": {"id": i, "nickname": f"用户{i}", "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={i}"},
            "content": f"这是第{i}条评论内容...",
            "like_count": random.randint(0, 100),
            "create_time": "2024-01-15 10:00:00"
        }
        for i in range(1, 11)
    ]
    return success({
        "comments": comments,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.post("/comment")
async def add_article_comment(
    article_id: int = Query(..., description="文章ID"),
    content: str = Query(..., description="评论内容")
):
    """添加评论"""
    return success({
        "message": "评论发布成功",
        "comment_id": random.randint(100, 1000)
    })
