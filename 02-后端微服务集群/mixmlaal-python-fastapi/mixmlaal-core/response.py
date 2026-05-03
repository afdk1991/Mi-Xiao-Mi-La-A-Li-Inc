from typing import Any
from pydantic import BaseModel


# 与Java微服务返回格式完全一致
class Result(BaseModel):
    code: int = 200
    msg: str = "操作成功"
    data: Any = None


# 成功返回
def success(data: Any = None, msg: str = "操作成功") -> Result:
    return Result(code=200, msg=msg, data=data)


# 失败返回
def fail(msg: str = "操作失败", code: int = 500) -> Result:
    return Result(code=code, msg=msg, data=None)
