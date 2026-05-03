import pymysql
from core.config import *


def get_db_connection():
    """获取MySQL连接"""
    conn = pymysql.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )
    return conn


def query_sql(sql: str, args: tuple = ()):
    """执行查询SQL"""
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(sql, args)
            return cursor.fetchall()
    finally:
        conn.close()
