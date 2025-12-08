# ═══════════════════════════════════════════════════════════
# 🚀 Drop & See 배포 스크립트 (Windows)
# ═══════════════════════════════════════════════════════════

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         🚀 Drop & See 배포 시작                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Docker 실행 확인
$dockerInfo = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker가 실행되지 않았습니다!" -ForegroundColor Red
    Write-Host "   Docker Desktop을 먼저 실행해주세요." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker 실행 확인 완료" -ForegroundColor Green
Write-Host ""

# 이전 컨테이너 정리
Write-Host "🧹 이전 컨테이너 정리 중..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml down --remove-orphans 2>$null
Write-Host ""

# 이미지 빌드
Write-Host "🔨 Docker 이미지 빌드 중... (처음에는 5-10분 소요)" -ForegroundColor Yellow
Write-Host ""
docker-compose -f docker-compose.prod.yml build --no-cache

Write-Host ""
Write-Host "🐳 컨테이너 실행 중..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

# 서비스 시작 대기
Write-Host ""
Write-Host "⏳ 서비스 시작 대기 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 상태 확인
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         ✅ 배포 완료!                                      ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📌 접속 주소: http://localhost" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 컨테이너 상태:" -ForegroundColor White
Write-Host "─────────────────────────────────────────────────────────────"
docker-compose -f docker-compose.prod.yml ps
Write-Host ""
Write-Host "📝 로그 확인: docker-compose -f docker-compose.prod.yml logs -f" -ForegroundColor Gray
Write-Host "🛑 종료 명령: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Gray
Write-Host ""
