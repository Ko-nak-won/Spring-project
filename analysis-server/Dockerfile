FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 및 한글 폰트 설치
RUN apt-get update && apt-get install -y \
    fonts-nanum \
    fontconfig \
    gcc \
    python3-dev \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

# 타임존 설정
ENV TZ=Asia/Seoul

# 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 업로드/차트 폴더 생성
RUN mkdir -p uploads charts

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
