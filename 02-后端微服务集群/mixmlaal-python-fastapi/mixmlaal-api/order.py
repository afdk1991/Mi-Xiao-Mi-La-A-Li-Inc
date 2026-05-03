from fastapi import APIRouter, Query
from core.response import success
import random
from datetime import datetime

router = APIRouter(prefix="/order", tags=["订单管理"])

@router.get("/list")
async def get_order_list(
    user_id: int = Query(..., description="用户ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(10, description="每页数量"),
    status: int = Query(None, description="订单状态")
):
    """获取订单列表"""
    orders = [
        {
            "id": i,
            "order_no": f"ORD{datetime.now().strftime('%Y%m%d')}{str(i).zfill(6)}",
            "total_amount": round(random.uniform(100, 5000), 2),
            "discount_amount": round(random.uniform(0, 100), 2),
            "pay_amount": round(random.uniform(100, 4900), 2),
            "status": status or random.randint(0, 4),
            "status_text": random.choice(["待付款", "待发货", "已发货", "已完成", "已取消"]),
            "pay_type": random.randint(1, 3),
            "create_time": "2024-01-15 10:00:00",
            "items": [
                {
                    "goods_name": f"商品{i}-{j}",
                    "goods_img": f"https://picsum.photos/id/{i+j}/100/100",
                    "price": round(random.uniform(50, 500), 2),
                    "quantity": random.randint(1, 3)
                }
                for j in range(1, 3)
            ]
        }
        for i in range(1, 11)
    ]
    return success({
        "list": orders,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.get("/detail")
async def get_order_detail(order_id: int = Query(..., description="订单ID")):
    """获取订单详情"""
    return success({
        "id": order_id,
        "order_no": f"ORD{datetime.now().strftime('%Y%m%d')}{str(order_id).zfill(6)}",
        "total_amount": 1598.00,
        "discount_amount": 100.00,
        "pay_amount": 1498.00,
        "status": 2,
        "status_text": "已发货",
        "pay_type": 1,
        "pay_time": "2024-01-15 10:00:00",
        "create_time": "2024-01-15 09:30:00",
        "express_company": "顺丰速运",
        "express_no": "SF1234567890",
        "receiver": {
            "name": "张三",
            "phone": "138****8000",
            "address": "北京市朝阳区某某街道某某小区1号楼101"
        },
        "items": [
            {
                "goods_id": 1,
                "goods_name": "iPhone 15 Pro",
                "goods_img": "https://picsum.photos/id/1/100/100",
                "price": 7999.00,
                "quantity": 1,
                "subtotal": 7999.00
            }
        ]
    })

@router.post("/create")
async def create_order(data: dict):
    """创建订单"""
    order_no = f"ORD{datetime.now().strftime('%Y%m%d')}{random.randint(100000, 999999)}"
    return success({
        "message": "订单创建成功",
        "order_id": random.randint(1000, 9999),
        "order_no": order_no,
        "total_amount": data.get("total_amount", 0)
    })

@router.post("/pay")
async def pay_order(order_id: int = Query(..., description="订单ID")):
    """订单支付"""
    return success({
        "message": "支付成功",
        "pay_url": "https://pay.yijimall.com/wxpay",
        "pay_time": datetime.now().isoformat()
    })

@router.post("/cancel")
async def cancel_order(order_id: int = Query(..., description="订单ID")):
    """取消订单"""
    return success({"message": "订单取消成功"})

@router.post("/confirm")
async def confirm_order(order_id: int = Query(..., description="订单ID")):
    """确认收货"""
    return success({"message": "确认收货成功"})

@router.post("/apply-refund")
async def apply_refund(order_id: int = Query(..., description="订单ID"), reason: str = Query(..., description="退款原因")):
    """申请退款"""
    return success({"message": "退款申请已提交", "refund_id": random.randint(1000, 9999)})

@router.get("/refund-detail")
async def get_refund_detail(order_id: int = Query(..., description="订单ID")):
    """获取退款详情"""
    return success({
        "refund_id": random.randint(1000, 9999),
        "order_id": order_id,
        "refund_amount": round(random.uniform(100, 1000), 2),
        "reason": "商品损坏",
        "status": random.randint(0, 2),
        "status_text": random.choice(["处理中", "已完成", "已拒绝"]),
        "create_time": "2024-01-15 10:00:00",
        "update_time": "2024-01-16 15:30:00"
    })

@router.get("/express")
async def get_express_info(express_no: str = Query(..., description="快递单号")):
    """获取物流信息"""
    traces = [
        {"time": "2024-01-15 18:00:00", "content": "商品已发货", "location": "北京仓库"},
        {"time": "2024-01-16 08:00:00", "content": "商品运输中", "location": "北京分拨中心"},
        {"time": "2024-01-16 14:00:00", "content": "商品运输中", "location": "上海分拨中心"},
        {"time": "2024-01-17 09:00:00", "content": "商品已签收", "location": "上海配送点"}
    ]
    return success({
        "express_no": express_no,
        "express_company": "顺丰速运",
        "status": "已签收",
        "traces": traces
    })

@router.get("/statistics")
async def get_order_statistics(user_id: int = Query(..., description="用户ID")):
    """订单统计"""
    return success({
        "total_orders": random.randint(10, 100),
        "total_amount": round(random.uniform(10000, 100000), 2),
        "pending_payment": random.randint(0, 5),
        "pending_shipment": random.randint(0, 3),
        "shipped": random.randint(0, 5),
        "completed": random.randint(5, 50)
    })
