import axiosInstance from './axiosInstance';

export const authApi = {
  // 회원가입
  signup: async (data) => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  // 로그인
  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  // 내 정보 조회
  getMyInfo: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },

  // 비밀번호 변경
  changePassword: async (data) => {
    const response = await axiosInstance.put('/users/password', data);
    return response.data;
  },

  // 이름 변경
  updateName: async (name) => {
    const response = await axiosInstance.put('/users/name', { name });
    return response.data;
  },
};
