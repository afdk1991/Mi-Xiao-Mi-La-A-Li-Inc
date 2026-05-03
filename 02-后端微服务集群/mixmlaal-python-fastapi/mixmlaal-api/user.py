from fastapi import APIRouter, Query
from core.response import success
import random
from datetime import datetime

router = APIRouter(prefix="/user", tags=["用户管理"])

@router.get("/profile")
async def get_user_profile(user_id: int = Query(..., description="用户ID")):
    """获取用户资料"""
    return success({
        "id": user_id,
        "username": f"user{user_id}",
        "nickname": f"用户{user_id}",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_id}",
        "phone": "138****8000",
        "email": f"user{user_id}@example.com",
        "gender": random.randint(0, 2),
        "birthday": "1990-01-01",
        "level": random.randint(1, 4),
        "level_name": random.choice(["普通会员", "银卡会员", "金卡会员", "VIP会员"]),
        "points": random.randint(0, 10000),
        "balance": round(random.uniform(0, 1000), 2),
        "create_time": "2024-01-01 10:00:00"
    })

@router.put("/profile")
async def update_user_profile(data: dict):
    """更新用户资料"""
    return success({"message": "资料更新成功"})

@router.get("/address-list")
async def get_address_list(user_id: int = Query(..., description="用户ID")):
    """获取收货地址列表"""
    addresses = [
        {
            "id": i,
            "consignee": f"收货人{i}",
            "phone": "138****8000",
            "province": "北京市",
            "city": "市辖区",
            "district": "朝阳区",
            "address": f"某某街道某某小区{i}号楼{i}单元{i}室",
            "is_default": i == 1
        }
        for i in range(1, 4)
    ]
    return success({"addresses": addresses})

@router.post("/address")
async def add_address(data: dict):
    """添加收货地址"""
    return success({"message": "地址添加成功", "address_id": random.randint(100, 999)})

@router.put("/address/{address_id}")
async def update_address(address_id: int, data: dict):
    """更新收货地址"""
    return success({"message": "地址更新成功"})

@router.delete("/address/{address_id}")
async def delete_address(address_id: int):
    """删除收货地址"""
    return success({"message": "地址删除成功"})

@router.get("/points-log")
async def get_points_log(
    user_id: int = Query(..., description="用户ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量")
):
    """获取积分明细"""
    logs = [
        {
            "id": i,
            "type": random.choice(["income", "expense"]),
            "points": random.randint(10, 100),
            "source": random.choice(["购物奖励", "签到奖励", "商品兑换", "活动奖励"]),
            "description": "积分变动说明",
            "create_time": "2024-01-15 10:00:00"
        }
        for i in range(1, 11)
    ]
    return success({
        "list": logs,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.get("/wallet")
async def get_user_wallet(user_id: int = Query(..., description="用户ID")):
    """获取用户钱包"""
    return success({
        "user_id": user_id,
        "balance": round(random.uniform(0, 1000), 2),
        "freeze_balance": round(random.uniform(0, 100), 2),
        "total_recharge": round(random.uniform(1000, 10000), 2),
        "total_consume": round(random.uniform(500, 5000), 2)
    })

@router.get("/wallet-log")
async def get_wallet_log(
    user_id: int = Query(..., description="用户ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量")
):
    """获取钱包明细"""
    logs = [
        {
            "id": i,
            "type": random.choice(["recharge", "consume", "refund"]),
            "amount": round(random.uniform(10, 500), 2),
            "source": random.choice(["充值", "购物", "退款"]),
            "description": "交易说明",
            "create_time": "2024-01-15 10:00:00"
        }
        for i in range(1, 11)
    ]
    return success({
        "list": logs,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.post("/bind-phone")
async def bind_phone(user_id: int = Query(..., description="用户ID"), phone: str = Query(..., description="手机号")):
    """绑定手机号"""
    return success({"message": "手机号绑定成功"})

@router.post("/bind-email")
async def bind_email(user_id: int = Query(..., description="用户ID"), email: str = Query(..., description="邮箱")):
    """绑定邮箱"""
    return success({"message": "邮箱绑定成功"})

@router.post("/change-password")
async def change_password(data: dict):
    """修改密码"""
    return success({"message": "密码修改成功"})
