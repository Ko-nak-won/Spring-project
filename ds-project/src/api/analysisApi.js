import axiosInstance, { FASTAPI_URL } from './axiosInstance';

export const analysisApi = {
  // Spring Boot를 통한 업로드 (이력 저장 포함)
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('/analysis/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // FastAPI 직접 호출 (빠른 분석, 로그인 불필요)
  uploadFileDirect: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${FASTAPI_URL}/api/analysis/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '분석 중 오류가 발생했습니다.');
    }
    
    return response.json();
  },

  // 분석 이력 조회
  getHistory: async () => {
    const response = await axiosInstance.get('/analysis/history');
    return response.data;
  },

  // 특정 분석 결과 조회
  getAnalysis: async (id) => {
    const response = await axiosInstance.get(`/analysis/${id}`);
    return response.data;
  },

  // 차트 URL 생성
  getChartUrl: (fileId, chartType) => {
    return `${FASTAPI_URL}/api/analysis/chart/${fileId}/${chartType}`;
  },
};
