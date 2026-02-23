// store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem("token") || null, // 초기값 설정
      isLoggedIn: !!localStorage.getItem("token"),

      // 로그인 성공 시 호출
      login: (userData, token) => {
        localStorage.setItem("token", token);
        set({ user: userData, token: token, isLoggedIn: true });
      },

      // 로그아웃 시 호출
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, isLoggedIn: false });
      },

      // 서버에서 실시간 유저 정보 업데이트용
      setUser: (userData) => set({ user: userData })
    }),
    { name: 'auth-storage' } // 로컬스토리지에 자동 저장
  )
);