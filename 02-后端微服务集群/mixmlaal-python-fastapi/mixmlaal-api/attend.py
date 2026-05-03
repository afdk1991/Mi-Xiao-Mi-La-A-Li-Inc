from fastapi import APIRouter, Query
from core.response import success
import random
from datetime import datetime, timedelta

router = APIRouter(prefix="/attend", tags=["考勤管理"])

@router.get("/record")
async def get_attend_record(
    user_id: int = Query(None, description="用户ID"),
    date: str = Query(None, description="日期 YYYY-MM-DD")
):
    """获取考勤记录"""
    return success({
        "user_id": user_id or 1,
        "date": date or datetime.now().strftime("%Y-%m-%d"),
        "check_in": "09:00:00" if date else None,
        "check_out": "18:00:00" if date else None,
        "status": random.choice(["正常", "迟到", "早退", "缺勤"]),
        "work_hours": round(random.uniform(7.5, 9.0), 1)
    })

@router.post("/check-in")
async def check_in(user_id: int = Query(..., description="用户ID")):
    """签到"""
    return success({
        "message": "签到成功",
        "check_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "location": "公司总部"
    })

@router.post("/check-out")
async def check_out(user_id: int = Query(..., description="用户ID")):
    """签退"""
    return success({
        "message": "签退成功",
        "check_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "work_hours": round(random.uniform(7.5, 9.0), 1)
    })

@router.get("/statistics")
async def get_attend_statistics(
    user_id: int = Query(None, description="用户ID"),
    month: str = Query(None, description="月份 YYYY-MM")
):
    """考勤统计"""
    month = month or datetime.now().strftime("%Y-%m")
    return success({
        "user_id": user_id or 1,
        "month": month,
        "normal_days": 22,
        "late_days": 1,
        "leave_days": 2,
        "absent_days": 0,
        "overtime_hours": round(random.uniform(0, 20), 1),
        "attendance_rate": round(random.uniform(90, 100), 1)
    })

@router.get("/leave-list")
async def get_leave_list(
    user_id: int = Query(None, description="用户ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(10, description="每页数量")
):
    """请假列表"""
    leaves = [
        {
            "id": i,
            "user_id": user_id or 1,
            "user_name": f"员工{i}",
            "leave_type": random.choice(["年假", "病假", "事假"]),
            "start_date": "2024-01-15",
            "end_date": "2024-01-16",
            "days": random.randint(1, 5),
            "reason": "个人原因",
            "status": random.choice([0, 1, 2]),
            "create_time": "2024-01-10 10:00:00"
        }
        for i in range(1, 11)
    ]
    return success({
        "list": leaves,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.post("/leave-apply")
async def apply_leave(data: dict):
    """申请请假"""
    return success({
        "message": "请假申请已提交",
        "apply_id": random.randint(100, 1000)
    })

@router.get("/overtime-list")
async def get_overtime_list(
    user_id: int = Query(None, description="用户ID"),
    page: int = Query(1, description="页码"),
    page_size: int = Query(10, description="每页数量")
):
    """加班列表"""
    overtimes = [
        {
            "id": i,
            "user_id": user_id or 1,
            "user_name": f"员工{i}",
            "date": "2024-01-15",
            "hours": round(random.uniform(1, 4), 1),
            "reason": "项目紧急",
            "status": random.choice([0, 1, 2]),
            "create_time": "2024-01-15 18:00:00"
        }
        for i in range(1, 11)
    ]
    return success({
        "list": overtimes,
        "total": 50,
        "page": page,
        "page_size": page_size
    })

@router.post("/overtime-apply")
async def apply_overtime(data: dict):
    """申请加班"""
    return success({
        "message": "加班申请已提交",
        "apply_id": random.randint(100, 1000)
    })

@router.get("/department-attend")
async def get_department_attend(
    department_id: int = Query(..., description="部门ID"),
    date: str = Query(None, description="日期 YYYY-MM-DD")
):
    """部门考勤概览"""
    return success({
        "department_id": department_id,
        "date": date or datetime.now().strftime("%Y-%m-%d"),
        "total_employees": random.randint(50, 100),
        "present": random.randint(45, 95),
        "absent": random.randint(0, 5),
        "late": random.randint(0, 10)
    })
