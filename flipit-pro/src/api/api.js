import axios from 'axios';
import { BASE_API_URL } from '../components/common/constants'; // 님의 상수 경로에 맞게 확인!
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: BASE_API_URL,
});

// 모든 요청에 자동으로 토큰을 실어 보내는 배달원(인터셉터)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token; // 스토어에서 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;