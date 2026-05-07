FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip config set global.index-url http://mirrors.tencentyun.com/pypi/simple && \
    pip config set global.trusted-host mirrors.tencentyun.com && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]