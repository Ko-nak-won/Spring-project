from pydantic import BaseModel
from typing import List, Optional


class ColumnStatistics(BaseModel):
    column_name: str
    data_type: str
    count: int
    unique: int
    missing: int
    mean: Optional[float] = None
    std: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None
    top: Optional[str] = None  # 범주형의 경우 최빈값


class ChartInfo(BaseModel):
    chart_type: str  # bar, pie, line, scatter, heatmap
    title: str
    url: str


class AnalysisResponse(BaseModel):
    file_id: str
    file_name: str
    row_count: int
    column_count: int
    columns: List[str]
    statistics: List[ColumnStatistics]
    charts: List[ChartInfo]
    summary: str
