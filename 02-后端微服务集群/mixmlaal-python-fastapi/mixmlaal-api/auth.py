from fastapi import APIRouter, Query
from pydantic import BaseModel, validator
from db.mysql import get_db_connection
import pymysql
from core.response import success, error
import hashlib
import time
import random
import string
import re

router = APIRouter(prefix="/auth", tags=["认证管理"])

class RegisterRequest(BaseModel):
    account: str = None
    nickname: str = None
    password: str = None
    phone: str = None
    email: str = None
    verify_code: str = None
    register_type: str = "account"

    @validator('phone')
    def validate_phone(cls, v):
        if v and not re.match(r'^1[3-9]\d{9}$', v):
            raise ValueError('手机号格式不正确')
        return v

    @validator('email')
    def validate_email_format(cls, v):
        if v and not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', v):
            raise ValueError('邮箱格式不正确')
        return v

class LoginRequest(BaseModel):
    account: str = None
    password: str = None
    phone: str = None
    email: str = None
    verify_code: str = None
    login_type: str = "account"

    @validator('phone')
    def validate_phone(cls, v):
        if v and not re.match(r'^1[3-9]\d{9}$', v):
            raise ValueError('手机号格式不正确')
        return v

class ThirdPartyLoginRequest(BaseModel):
    platform: str
    openid: str
    nickname: str = None
    avatar: str = None

class SendCodeRequest(BaseModel):
    phone: str = None
    email: str = None
    code_type: str = "sms"

    @validator('phone')
    def validate_phone(cls, v):
        if v and not re.match(r'^1[3-9]\d{9}$', v):
            raise ValueError('手机号格式不正确')
        return v

    @validator('email')
    def validate_email_format(cls, v):
        if v and not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', v):
            raise ValueError('邮箱格式不正确')
        return v

verification_codes = {}

def generate_user_id() -> int:
    """自动生成用户ID（基于数据库最大ID+1）"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT IFNULL(MAX(user_id), 10000) as max_id FROM users")
            result = cursor.fetchone()
            max_id = result['max_id'] if result and result['max_id'] else 10000
            return max_id + 1
    finally:
        conn.close()

def generate_verify_code(length: int = 6) -> str:
    """生成随机验证码"""
    return ''.join(random.choices(string.digits, k=length))

def generate_token(user_id: int, login_type: str) -> str:
    """生成访问令牌"""
    timestamp = str(int(time.time()))
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    raw_token = f"{user_id}:{login_type}:{timestamp}:{random_str}"
    return hashlib.sha256(raw_token.encode()).hexdigest()

def hash_password(password: str) -> str:
    """密码哈希处理"""
    return hashlib.sha256(password.encode()).hexdigest()

def validate_verify_code(phone: str = None, email: str = None, code: str = None) -> bool:
    """验证验证码"""
    if phone and phone in verification_codes:
        if verification_codes[phone]['code'] == code and verification_codes[phone]['expire'] > time.time():
            del verification_codes[phone]
            return True
    if email and email in verification_codes:
        if verification_codes[email]['code'] == code and verification_codes[email]['expire'] > time.time():
            del verification_codes[email]
            return True
    return False

@router.post("/send-code")
async def send_verify_code(data: SendCodeRequest):
    """发送验证码（短信/邮箱）"""
    code = generate_verify_code()
    expire_time = int(time.time()) + 300

    if data.phone:
        verification_codes[data.phone] = {'code': code, 'expire': expire_time}
        return success({
            "code": code,
            "expire": 300,
            "message": f"验证码已发送至手机 {data.phone[:3]}****{data.phone[-4:]}"
        })

    if data.email:
        verification_codes[data.email] = {'code': code, 'expire': expire_time}
        return success({
            "code": code,
            "expire": 300,
            "message": f"验证码已发送至邮箱 {data.email[:3]}****{data.email.split('@')[0][-3:]}"
        })

    return error("请提供手机号或邮箱")

@router.post("/register")
async def register(data: RegisterRequest):
    """用户注册（支持账号/手机号/邮箱）"""
    if data.register_type == "account":
        if not all([data.account, data.password]):
            return error("账号和密码不能为空")
        return await register_by_account(data)
    elif data.register_type == "phone":
        if not all([data.phone, data.verify_code]):
            return error("手机号和验证码不能为空")
        return await register_by_phone(data)
    elif data.register_type == "email":
        if not all([data.email, data.verify_code]):
            return error("邮箱和验证码不能为空")
        return await register_by_email(data)
    return error("不支持的注册类型")

async def register_by_account(data: RegisterRequest):
    """账号注册"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM users WHERE account = %s", (data.account,))
            if cursor.fetchone():
                return error("账号已存在")

            user_id = generate_user_id()
            password_hash = hash_password(data.password)
            nickname = data.nickname or data.account

            sql = """INSERT INTO users (user_id, account, nickname, password, create_time)
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (user_id, data.account, nickname, password_hash, time.strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()

            return success({
                "user_id": user_id,
                "account": data.account,
                "nickname": nickname,
                "message": "注册成功"
            })
    except pymysql.Error as e:
        conn.rollback()
        return error(f"注册失败: {str(e)}")
    finally:
        conn.close()

async def register_by_phone(data: RegisterRequest):
    """手机号注册"""
    if not validate_verify_code(phone=data.phone, code=data.verify_code):
        return error("验证码错误或已过期")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM users WHERE phone = %s", (data.phone,))
            if cursor.fetchone():
                return error("该手机号已注册")

            user_id = generate_user_id()
            password_hash = hash_password(data.password) if data.password else None
            nickname = data.nickname or f"用户{data.phone[-4:]}"

            sql = """INSERT INTO users (user_id, phone, nickname, password, create_time)
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (user_id, data.phone, nickname, password_hash, time.strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()

            return success({
                "user_id": user_id,
                "phone": data.phone,
                "nickname": nickname,
                "message": "注册成功"
            })
    except pymysql.Error as e:
        conn.rollback()
        return error(f"注册失败: {str(e)}")
    finally:
        conn.close()

async def register_by_email(data: RegisterRequest):
    """邮箱注册"""
    if not validate_verify_code(email=data.email, code=data.verify_code):
        return error("验证码错误或已过期")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM users WHERE email = %s", (data.email,))
            if cursor.fetchone():
                return error("该邮箱已注册")

            user_id = generate_user_id()
            password_hash = hash_password(data.password) if data.password else None
            nickname = data.nickname or data.email.split('@')[0]

            sql = """INSERT INTO users (user_id, email, nickname, password, create_time)
                     VALUES (%s, %s, %s, %s, %s)"""
            cursor.execute(sql, (user_id, data.email, nickname, password_hash, time.strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()

            return success({
                "user_id": user_id,
                "email": data.email,
                "nickname": nickname,
                "message": "注册成功"
            })
    except pymysql.Error as e:
        conn.rollback()
        return error(f"注册失败: {str(e)}")
    finally:
        conn.close()

@router.post("/login")
async def login(data: LoginRequest):
    """用户登录（支持账号/手机号/邮箱/验证码登录）"""
    if data.login_type == "account":
        if not all([data.account, data.password]):
            return error("账号和密码不能为空")
        return await login_by_account(data)
    elif data.login_type == "phone":
        if not all([data.phone, data.verify_code]):
            return error("手机号和验证码不能为空")
        return await login_by_phone(data)
    elif data.login_type == "email":
        if not all([data.email, data.verify_code]):
            return error("邮箱和验证码不能为空")
        return await login_by_email(data)
    return error("不支持的登录类型")

async def login_by_account(data: LoginRequest):
    """账号登录"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            password_hash = hash_password(data.password)
            cursor.execute("SELECT user_id, account, nickname FROM users WHERE account = %s AND password = %s",
                         (data.account, password_hash))
            user = cursor.fetchone()
            if user:
                token = generate_token(user['user_id'], 'account')
                return success({
                    "user_id": user['user_id'],
                    "account": user['account'],
                    "nickname": user['nickname'],
                    "token": token,
                    "login_type": "account"
                })
            return error("账号或密码错误")
    finally:
        conn.close()

async def login_by_phone(data: LoginRequest):
    """手机验证码登录"""
    if not validate_verify_code(phone=data.phone, code=data.verify_code):
        return error("验证码错误或已过期")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id, phone, nickname FROM users WHERE phone = %s", (data.phone,))
            user = cursor.fetchone()
            if user:
                token = generate_token(user['user_id'], 'phone')
                return success({
                    "user_id": user['user_id'],
                    "phone": user['phone'],
                    "nickname": user['nickname'],
                    "token": token,
                    "login_type": "phone"
                })
            return error("该手机号未注册")
    finally:
        conn.close()

async def login_by_email(data: LoginRequest):
    """邮箱验证码登录"""
    if not validate_verify_code(email=data.email, code=data.verify_code):
        return error("验证码错误或已过期")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id, email, nickname FROM users WHERE email = %s", (data.email,))
            user = cursor.fetchone()
            if user:
                token = generate_token(user['user_id'], 'email')
                return success({
                    "user_id": user['user_id'],
                    "email": user['email'],
                    "nickname": user['nickname'],
                    "token": token,
                    "login_type": "email"
                })
            return error("该邮箱未注册")
    finally:
        conn.close()

@router.post("/third-party-login")
async def third_party_login(data: ThirdPartyLoginRequest):
    """第三方平台登录（微信/QQ/微博等）"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id, nickname, avatar FROM users WHERE third_party_platform = %s AND third_party_openid = %s",
                         (data.platform, data.openid))
            user = cursor.fetchone()

            if user:
                token = generate_token(user['user_id'], f'thirdparty_{data.platform}')
                return success({
                    "user_id": user['user_id'],
                    "nickname": user['nickname'],
                    "avatar": user['avatar'],
                    "token": token,
                    "login_type": f"thirdparty_{data.platform}",
                    "is_new_user": False
                })

            user_id = generate_user_id()
            nickname = data.nickname or f"用户{random.randint(1000, 9999)}"
            avatar = data.avatar or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_id}"

            sql = """INSERT INTO users (user_id, nickname, avatar, third_party_platform, third_party_openid, create_time)
                     VALUES (%s, %s, %s, %s, %s, %s)"""
            cursor.execute(sql, (user_id, nickname, avatar, data.platform, data.openid, time.strftime("%Y-%m-%d %H:%M:%S")))
            conn.commit()

            token = generate_token(user_id, f'thirdparty_{data.platform}')
            return success({
                "user_id": user_id,
                "nickname": nickname,
                "avatar": avatar,
                "token": token,
                "login_type": f"thirdparty_{data.platform}",
                "is_new_user": True
            })
    except pymysql.Error as e:
        conn.rollback()
        return error(f"第三方登录失败: {str(e)}")
    finally:
        conn.close()

@router.get("/third-party-url")
async def get_third_party_url(platform: str = Query(..., description="平台名称: wechat, qq, weibo")):
    """获取第三方登录授权URL"""
    urls = {
        "wechat": "https://open.weixin.qq.com/connect/qrconnect?appid=wx&response_type=code&redirect_uri=...",
        "qq": "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101&redirect_uri=...",
        "weibo": "https://api.weibo.com/oauth2/authorize?response_type=code&client_id=123&redirect_uri=...",
        "alipay": "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021&scope=auth_user&redirect_uri=...",
        "baidu": "https://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=...",
        "douyin": "https://open.douyin.com/oauth/authorize?client_key=...&redirect_uri=...",
        "xiaomi": "https://account.xiaomi.com/oauth2/authorize?client_id=...&redirect_uri=...",
        "apple": "https://appleid.apple.com/auth/authorize?client_id=...&redirect_uri=..."
    }

    if platform not in urls:
        return error("不支持的第三方平台")

    return success({
        "platform": platform,
        "url": urls[platform],
        "message": "请使用此URL进行授权"
    })

@router.post("/logout")
async def logout():
    """用户登出"""
    return success({"message": "登出成功"})

@router.post("/bind-phone")
async def bind_phone(user_id: int = Query(...), phone: str = Query(...), verify_code: str = Query(...)):
    """绑定手机号"""
    if not re.match(r'^1[3-9]\d{9}$', phone):
        return error("手机号格式不正确")

    if not validate_verify_code(phone=phone, code=verify_code):
        return error("验证码错误或已过期")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM users WHERE phone = %s AND user_id != %s", (phone, user_id))
            if cursor.fetchone():
                return error("该手机号已被其他账号绑定")

            cursor.execute("UPDATE users SET phone = %s WHERE user_id = %s", (phone, user_id))
            conn.commit()
            return success({"message": "手机号绑定成功"})
    except pymysql.Error as e:
        conn.rollback()
        return error(f"绑定失败: {str(e)}")
    finally:
        conn.close()

@router.post("/bind-email")
async def bind_email(user_id: int = Query(...), email: str = Query(...), verify_code: str = Query(...)):
    """绑定邮箱"""
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        return error("邮箱格式不正确")

    if not validate_verify_code(email=email, code=verify_code):
        return error("验证码错误或已过期")

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT user_id FROM users WHERE email = %s AND user_id != %s", (email, user_id))
            if cursor.fetchone():
                return error("该邮箱已被其他账号绑定")

            cursor.execute("UPDATE users SET email = %s WHERE user_id = %s", (email, user_id))
            conn.commit()
            return success({"message": "邮箱绑定成功"})
    except pymysql.Error as e:
        conn.rollback()
        return error(f"绑定失败: {str(e)}")
    finally:
        conn.close()

@router.post("/reset-password")
async def reset_password(phone: str = None, email: str = None, verify_code: str = None, new_password: str = None):
    """重置密码"""
    if not all([verify_code, new_password]):
        return error("验证码和新密码不能为空")

    if phone and not validate_verify_code(phone=phone, code=verify_code):
        return error("验证码错误或已过期")

    if email and not validate_verify_code(email=email, code=verify_code):
        return error("验证码错误或已过期")

    if not phone and not email:
        return error("请提供手机号或邮箱")

    password_hash = hash_password(new_password)
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            if phone:
                cursor.execute("UPDATE users SET password = %s WHERE phone = %s", (password_hash, phone))
            else:
                cursor.execute("UPDATE users SET password = %s WHERE email = %s", (password_hash, email))
            conn.commit()
            return success({"message": "密码重置成功"})
    except pymysql.Error as e:
        conn.rollback()
        return error(f"密码重置失败: {str(e)}")
    finally:
        conn.close()
