from fastapi import APIRouter, Query
from fastapi import File, UploadFile
from core.response import success
import random
from datetime import datetime

router = APIRouter(prefix="/file", tags=["文件管理"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """文件上传"""
    return success({
        "filename": file.filename,
        "size": random.randint(100000, 10000000),
        "url": f"https://cdn.yijimall.com/files/{file.filename}",
        "upload_time": datetime.now().isoformat()
    })

@router.post("/upload-multiple")
async def upload_multiple(files: list[UploadFile] = File(...)):
    """多文件上传"""
    results = []
    for file in files:
        results.append({
            "filename": file.filename,
            "size": random.randint(100000, 10000000),
            "url": f"https://cdn.yijimall.com/files/{file.filename}"
        })
    return success({"files": results})

@router.get("/list")
async def get_file_list(
    page: int = Query(1, description="页码"),
    page_size: int = Query(20, description="每页数量"),
    folder: str = Query("", description="文件夹路径")
):
    """文件列表"""
    files = [
        {
            "id": i,
            "filename": f"file_{i}.pdf",
            "size": random.randint(100000, 10000000),
            "type": random.choice(["pdf", "doc", "jpg", "png"]),
            "folder": folder or "/",
            "upload_time": "2024-01-15 10:00:00",
            "download_count": random.randint(0, 100)
        }
        for i in range(1, 21)
    ]
    return success({
        "list": files,
        "total": 100,
        "page": page,
        "page_size": page_size
    })

@router.get("/folders")
async def get_folders():
    """获取文件夹列表"""
    folders = [
        {"id": 1, "name": "文档", "count": 25, "size": 1024000},
        {"id": 2, "name": "图片", "count": 58, "size": 2048000},
        {"id": 3, "name": "视频", "count": 12, "size": 10240000},
        {"id": 4, "name": "音频", "count": 30, "size": 512000},
        {"id": 5, "name": "压缩包", "count": 8, "size": 3072000}
    ]
    return success({"folders": folders})

@router.delete("/{file_id}")
async def delete_file(file_id: int):
    """删除文件"""
    return success({"message": "文件删除成功"})

@router.post("/create-folder")
async def create_folder(name: str = Query(..., description="文件夹名称")):
    """创建文件夹"""
    return success({
        "id": random.randint(100, 1000),
        "name": name,
        "create_time": datetime.now().isoformat()
    })

@router.get("/share")
async def share_file(file_id: int = Query(..., description="文件ID")):
    """文件分享"""
    return success({
        "share_code": "ABC123",
        "share_url": f"https://share.yijimall.com/ABC123",
        "expire_time": "2024-01-22 10:00:00",
        "download_count": 0
    })

@router.get("/download/{file_id}")
async def download_file(file_id: int):
    """文件下载"""
    return success({
        "download_url": f"https://cdn.yijimall.com/files/file_{file_id}.pdf",
        "filename": f"file_{file_id}.pdf"
    })
