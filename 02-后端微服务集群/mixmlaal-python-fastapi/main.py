from fastapi import FastAPI
import uvicorn
from core.config import SERVER_HOST, SERVER_PORT
from api import data, ai, file, article, attend, im, user, order, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Python数据服务API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router)
app.include_router(ai.router)
app.include_router(file.router)
app.include_router(article.router)
app.include_router(attend.router)
app.include_router(im.router)
app.include_router(user.router)
app.include_router(order.router)
app.include_router(auth.router)

@app.get("/")
def index():
    return {"code": 200, "msg": "Python FastAPI 数据服务运行正常"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=SERVER_HOST, port=SERVER_PORT, reload=True)
