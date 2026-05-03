from fastapi import APIRouter, Query
from core.response import success
import random
from datetime import datetime

router = APIRouter(prefix="/im", tags=["即时通讯"])

@router.get("/contacts")
async def get_contacts(user_id: int = Query(..., description="用户ID")):
    """获取联系人列表"""
    contacts = [
        {
            "id": i,
            "user_id": i,
            "nickname": f"用户{i}",
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={i}",
            "status": random.choice(["online", "offline"]),
            "last_message": "你好啊，最近怎么样？",
            "last_message_time": "10分钟前",
            "unread_count": random.randint(0, 10)
        }
        for i in range(1, 21)
    ]
    return success({"contacts": contacts})

@router.get("/messages")
async def get_messages(
    user_id: int = Query(..., description="用户ID"),
    contact_id: int = Query(..., description="联系人ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量")
):
    """获取消息列表"""
    messages = [
        {
            "id": i,
            "from_id": user_id if i % 2 == 0 else contact_id,
            "to_id": contact_id if i % 2 == 0 else user_id,
            "content": f"这是第{i}条消息内容",
            "type": random.choice(["text", "image", "file"]),
            "timestamp": datetime.now().isoformat(),
            "status": "sent"
        }
        for i in range(1, 21)
    ]
    return success({
        "messages": messages,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.post("/send")
async def send_message(data: dict):
    """发送消息"""
    return success({
        "message_id": random.randint(1000, 9999),
        "timestamp": datetime.now().isoformat(),
        "status": "sent"
    })

@router.get("/groups")
async def get_groups(user_id: int = Query(..., description="用户ID")):
    """获取群聊列表"""
    groups = [
        {
            "id": i,
            "group_id": i,
            "group_name": f"群聊{i}",
            "avatar": f"https://api.dicebear.com/7.x/identicon/svg?seed={i}",
            "member_count": random.randint(10, 100),
            "last_message": "群消息内容...",
            "last_message_time": "5分钟前",
            "unread_count": random.randint(0, 20)
        }
        for i in range(1, 11)
    ]
    return success({"groups": groups})

@router.get("/group-messages")
async def get_group_messages(
    group_id: int = Query(..., description="群ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量")
):
    """获取群消息"""
    messages = [
        {
            "id": i,
            "from_id": i,
            "from_name": f"用户{i}",
            "from_avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={i}",
            "content": f"这是群聊第{i}条消息",
            "type": "text",
            "timestamp": datetime.now().isoformat()
        }
        for i in range(1, 21)
    ]
    return success({
        "messages": messages,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.get("/unread-count")
async def get_unread_count(user_id: int = Query(..., description="用户ID")):
    """获取未读消息数量"""
    return success({
        "user_id": user_id,
        "total_unread": random.randint(0, 50),
        "private_unread": random.randint(0, 30),
        "group_unread": random.randint(0, 20)
    })

@router.post("/mark-read")
async def mark_as_read(
    user_id: int = Query(..., description="用户ID"),
    message_id: int = Query(..., description="消息ID")
):
    """标记已读"""
    return success({"message": "标记成功"})

@router.get("/search")
async def search_messages(
    user_id: int = Query(..., description="用户ID"),
    keyword: str = Query(..., description="搜索关键词")
):
    """搜索消息"""
    results = [
        {
            "id": i,
            "from_name": f"用户{i}",
            "content": f"包含关键词的消息{i}",
            "timestamp": datetime.now().isoformat()
        }
        for i in range(1, 6)
    ]
    return success({"results": results})
