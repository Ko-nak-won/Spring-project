from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from services.file_parser import parse_file
from services.statistics import calculate_statistics
from services.visualization import generate_charts
from models.schemas import AnalysisResponse
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "uploads"
CHART_DIR = "charts"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(CHART_DIR, exist_ok=True)


@router.post("/upload", response_model=AnalysisResponse)
async def upload_and_analyze(file: UploadFile = File(...)):
    """파일 업로드 및 자동 분석"""
    
    # 파일 확장자 검증
    allowed_extensions = [".csv", ".json", ".xlsx", ".xls"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식입니다. 허용: {allowed_extensions}"
        )
    
    # 파일 저장
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        # 1. 파일 파싱
        df = parse_file(file_path, file_ext)
        
        # 2. 통계 계산
        statistics = calculate_statistics(df)
        
        # 3. 시각화 생성
        charts = generate_charts(df, file_id, CHART_DIR)
        
        # 4. 요약 생성
        summary = generate_summary(df, statistics)
        
        return AnalysisResponse(
            file_id=file_id,
            file_name=file.filename,
            row_count=len(df),
            column_count=len(df.columns),
            columns=df.columns.tolist(),
            statistics=statistics,
            charts=charts,
            summary=summary
        )
        
    except Exception as e:
        # 실패 시 파일 삭제
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chart/{file_id}/{chart_type}")
async def get_chart(file_id: str, chart_type: str):
    """생성된 차트 이미지 반환"""
    chart_path = os.path.join(CHART_DIR, f"{file_id}_{chart_type}.png")
    
    if not os.path.exists(chart_path):
        raise HTTPException(status_code=404, detail="차트를 찾을 수 없습니다.")
    
    return FileResponse(chart_path, media_type="image/png")


def generate_summary(df, statistics) -> str:
    """데이터 요약 텍스트 생성"""
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    
    summary = f"총 {len(df)}개의 행과 {len(df.columns)}개의 열로 구성된 데이터입니다. "
    summary += f"숫자형 컬럼 {len(numeric_cols)}개, 범주형 컬럼 {len(categorical_cols)}개가 있습니다."
    
    if numeric_cols:
        summary += f" 주요 숫자형 컬럼: {', '.join(numeric_cols[:3])}"
    
    # 결측치 정보
    missing_count = df.isna().sum().sum()
    if missing_count > 0:
        summary += f" 총 {missing_count}개의 결측치가 있습니다."
    
    return summary
