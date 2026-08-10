import redis
from app.core.config import settings

def get_redis_client():
    try:
        r = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
        return r
    except Exception:
        return None
