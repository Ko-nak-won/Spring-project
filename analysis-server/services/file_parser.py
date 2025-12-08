import pandas as pd
import json
from fastapi import HTTPException


def parse_file(file_path: str, file_ext: str) -> pd.DataFrame:
    """파일 형식에 따라 DataFrame으로 파싱"""
    
    try:
        if file_ext == ".csv":
            # 인코딩 자동 감지 시도
            encodings = ['utf-8', 'cp949', 'euc-kr', 'latin1']
            for encoding in encodings:
                try:
                    return pd.read_csv(file_path, encoding=encoding)
                except UnicodeDecodeError:
                    continue
            raise HTTPException(status_code=400, detail="CSV 파일 인코딩을 인식할 수 없습니다.")
        
        elif file_ext == ".json":
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # JSON 구조에 따라 처리
            if isinstance(data, list):
                return pd.DataFrame(data)
            elif isinstance(data, dict):
                # 중첩 구조 처리
                if all(isinstance(v, list) for v in data.values()):
                    return pd.DataFrame(data)
                return pd.json_normalize(data)
            else:
                raise HTTPException(status_code=400, detail="지원하지 않는 JSON 구조입니다.")
        
        elif file_ext in [".xlsx", ".xls"]:
            return pd.read_excel(file_path)
        
        else:
            raise HTTPException(status_code=400, detail="지원하지 않는 파일 형식입니다.")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"파일 파싱 실패: {str(e)}")
