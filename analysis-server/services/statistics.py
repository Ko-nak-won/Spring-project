import pandas as pd
from typing import List
from models.schemas import ColumnStatistics


def calculate_statistics(df: pd.DataFrame) -> List[ColumnStatistics]:
    """각 컬럼별 통계 계산"""
    
    results = []
    
    for column in df.columns:
        col_data = df[column]
        
        stats = ColumnStatistics(
            column_name=column,
            data_type=str(col_data.dtype),
            count=int(col_data.count()),
            unique=int(col_data.nunique()),
            missing=int(col_data.isna().sum())
        )
        
        # 숫자형 컬럼인 경우 추가 통계
        if pd.api.types.is_numeric_dtype(col_data):
            if not col_data.isna().all():
                stats.mean = round(float(col_data.mean()), 4)
                stats.std = round(float(col_data.std()), 4)
                stats.min = round(float(col_data.min()), 4)
                stats.max = round(float(col_data.max()), 4)
        
        # 범주형 컬럼인 경우 최빈값
        elif pd.api.types.is_object_dtype(col_data):
            mode = col_data.mode()
            if len(mode) > 0:
                stats.top = str(mode.iloc[0])
        
        results.append(stats)
    
    return results
