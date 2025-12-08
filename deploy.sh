#!/bin/bash

# ═══════════════════════════════════════════════════════════
# 🚀 Drop & See 배포 스크립트 (Mac/Linux)
# ═══════════════════════════════════════════════════════════

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🚀 Drop & See 배포 시작                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Docker 실행 확인
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker가 실행되지 않았습니다!"
    echo "   Docker Desktop을 먼저 실행해주세요."
    exit 1
fi

echo "✅ Docker 실행 확인 완료"
echo ""

# 이전 컨테이너 정리
echo "🧹 이전 컨테이너 정리 중..."
docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
echo ""

# 이미지 빌드
echo "🔨 Docker 이미지 빌드 중... (처음에는 5-10분 소요)"
echo ""
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🐳 컨테이너 실행 중..."
docker-compose -f docker-compose.prod.yml up -d

# 서비스 시작 대기
echo ""
echo "⏳ 서비스 시작 대기 중..."
sleep 10

# 상태 확인
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         ✅ 배포 완료!                                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📌 접속 주소: http://localhost"
echo ""
echo "📋 컨테이너 상태:"
echo "─────────────────────────────────────────────────────────────"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "📝 로그 확인: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 종료 명령: docker-compose -f docker-compose.prod.yml down"
echo ""
