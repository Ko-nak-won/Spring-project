import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # GUI 없이 사용
import seaborn as sns
from typing import List
from models.schemas import ChartInfo
import os
import platform

# 한글 폰트 설정
if platform.system() == 'Windows':
    plt.rcParams['font.family'] = 'Malgun Gothic'
elif platform.system() == 'Darwin':  # macOS
    plt.rcParams['font.family'] = 'AppleGothic'
else:  # Linux
    plt.rcParams['font.family'] = 'NanumGothic'
    
plt.rcParams['axes.unicode_minus'] = False


def generate_charts(df: pd.DataFrame, file_id: str, chart_dir: str) -> List[ChartInfo]:
    """데이터에 맞는 차트 자동 생성"""
    
    charts = []
    numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    
    # 1. 숫자형 컬럼 히스토그램 (Bar Chart)
    if numeric_cols:
        col = numeric_cols[0]
        try:
            fig, ax = plt.subplots(figsize=(10, 6))
            df[col].hist(bins=20, ax=ax, color='steelblue', edgecolor='white')
            ax.set_title(f'{col} 분포')
            ax.set_xlabel(col)
            ax.set_ylabel('빈도')
            
            chart_path = os.path.join(chart_dir, f"{file_id}_bar.png")
            plt.savefig(chart_path, dpi=100, bbox_inches='tight')
            plt.close()
            
            charts.append(ChartInfo(
                chart_type="bar",
                title=f"{col} 분포",
                url=f"/api/analysis/chart/{file_id}/bar"
            ))
        except Exception as e:
            print(f"Bar chart error: {e}")
            plt.close()
    
    # 2. 범주형 컬럼 파이 차트
    if categorical_cols:
        col = categorical_cols[0]
        try:
            value_counts = df[col].value_counts().head(10)
            
            if len(value_counts) > 0:
                fig, ax = plt.subplots(figsize=(10, 8))
                ax.pie(value_counts.values, labels=value_counts.index, autopct='%1.1f%%')
                ax.set_title(f'{col} 비율')
                
                chart_path = os.path.join(chart_dir, f"{file_id}_pie.png")
                plt.savefig(chart_path, dpi=100, bbox_inches='tight')
                plt.close()
                
                charts.append(ChartInfo(
                    chart_type="pie",
                    title=f"{col} 비율",
                    url=f"/api/analysis/chart/{file_id}/pie"
                ))
        except Exception as e:
            print(f"Pie chart error: {e}")
            plt.close()
    
    # 3. 숫자형 2개 이상인 경우 Scatter Plot
    if len(numeric_cols) >= 2:
        try:
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.scatter(df[numeric_cols[0]], df[numeric_cols[1]], alpha=0.6, c='steelblue')
            ax.set_xlabel(numeric_cols[0])
            ax.set_ylabel(numeric_cols[1])
            ax.set_title(f'{numeric_cols[0]} vs {numeric_cols[1]}')
            
            chart_path = os.path.join(chart_dir, f"{file_id}_scatter.png")
            plt.savefig(chart_path, dpi=100, bbox_inches='tight')
            plt.close()
            
            charts.append(ChartInfo(
                chart_type="scatter",
                title=f"{numeric_cols[0]} vs {numeric_cols[1]}",
                url=f"/api/analysis/chart/{file_id}/scatter"
            ))
        except Exception as e:
            print(f"Scatter chart error: {e}")
            plt.close()
    
    # 4. 상관관계 히트맵 (숫자형 3개 이상)
    if len(numeric_cols) >= 3:
        try:
            fig, ax = plt.subplots(figsize=(12, 10))
            corr_matrix = df[numeric_cols].corr()
            sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0, ax=ax, fmt='.2f')
            ax.set_title('상관관계 히트맵')
            
            chart_path = os.path.join(chart_dir, f"{file_id}_heatmap.png")
            plt.savefig(chart_path, dpi=100, bbox_inches='tight')
            plt.close()
            
            charts.append(ChartInfo(
                chart_type="heatmap",
                title="상관관계 히트맵",
                url=f"/api/analysis/chart/{file_id}/heatmap"
            ))
        except Exception as e:
            print(f"Heatmap error: {e}")
            plt.close()
    
    # 5. 라인 차트 (시계열 데이터가 있는 경우)
    date_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
    if date_cols and numeric_cols:
        try:
            fig, ax = plt.subplots(figsize=(12, 6))
            df_sorted = df.sort_values(date_cols[0])
            ax.plot(df_sorted[date_cols[0]], df_sorted[numeric_cols[0]], color='steelblue')
            ax.set_xlabel(date_cols[0])
            ax.set_ylabel(numeric_cols[0])
            ax.set_title(f'{numeric_cols[0]} 시계열')
            plt.xticks(rotation=45)
            
            chart_path = os.path.join(chart_dir, f"{file_id}_line.png")
            plt.savefig(chart_path, dpi=100, bbox_inches='tight')
            plt.close()
            
            charts.append(ChartInfo(
                chart_type="line",
                title=f"{numeric_cols[0]} 시계열",
                url=f"/api/analysis/chart/{file_id}/line"
            ))
        except Exception as e:
            print(f"Line chart error: {e}")
            plt.close()
    
    return charts
