import redis
from core.config import *


redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    decode_responses=True
)


# 缓存数据
def set_cache(key: str, value: str, ex: int = 3600):
    redis_client.set(key, value, ex=ex)


# 获取缓存
def get_cache(key: str):
    return redis_client.get(key)
