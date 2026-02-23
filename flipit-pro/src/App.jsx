import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Navigation } from "./layout/Navigation";
import { SignUp } from "./pages/SignUp";
import Home from "./pages/Home";
import { LoginModal } from "./components/common/LoginModal";
import { useEffect, useState } from "react";
import Footer from "./layout/Footer";
import './App.css';
import { Game } from "./pages/Game";
import Admin from "./pages/Admin";
import { Error } from "./pages/Error";
import Rank from "./pages/Rank";
// App.js
import { useAuthStore } from "./store/useAuthStore";
import api from "./api/axios"; // 아까 만든 인터셉터 포함된 axios

function App() {
  const { user, isLoggedIn, login, logout, setUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const navigate = useNavigate();

  // 🔹 앱 접속 시 딱 한 번 실행: 토큰으로 "진짜" 유저 정보 가져오기
  useEffect(() => {
    const initAuth = async () => {
      // 1. 로컬스토리지에서 토큰을 직접 확인 (Zustand persist 동기화 전일 수 있음)
      const token = localStorage.getItem("token"); 

      // 2. 토큰이 없으면 서버를 찌르지 마세요! (이게 500/401 에러 범인)
      if (!token) {
        setIsUserLoaded(true);
        return; 
      }

      try {
        // 3. 토큰이 있을 때만 서버에 '나 누구게?' 물어보기
        const res = await api.get("/api/user/me"); 
        setUser(res.data);
      } catch (error) {
        console.error("인증 정보 복구 실패:", error);
        logout(); // 잘못된 토큰이면 비우기
      } finally {
        setIsUserLoaded(true); // 에러가 나든 성공하든 로딩은 끝내기
      }
    };
    
    initAuth();
  }, []); // 딱 한 번만 실행

  if (!isUserLoaded) return <p>로딩 중...</p>;

  return (
    <>
      <Navigation
        isLogIn={isLoggedIn}
        user={user}
        onLoginClick={() => setIsModalOpen(true)}
        onLogoutClick={() => {
            logout();
            navigate("/");
        }}
      />

      {/* 모달 등 공통 UI */}
      {isModalOpen && (
        <LoginModal 
          onClose={() => setIsModalOpen(false)} 
          onLoginSuccess={async ({ token }) => { // 1. async 추가
            // 2. 먼저 토큰만 넣어서 로그인을 시킵니다 (이래야 인터셉터가 작동함)
            login(null, token); 

            try {
              // 3. 즉시 서버에 유저 정보를 요청합니다
              const res = await api.get("/api/user/me"); 
              
              // 4. 받아온 진짜 유저 정보(res.data)를 금고에 업데이트!
              setUser(res.data); 
              
              console.log("유저 정보 로드 성공:", res.data);
              setIsModalOpen(false); // 성공하면 모달 닫기
            } catch (err) {
              console.error("로그인 후 정보 가져오기 실패:", err);
              logout(); // 정보 못 가져오면 꼬인 거니까 로그아웃 처리
              alert("로그인 정보 확인 중 오류가 발생했습니다.");
            }
          }} 
        />
      )}

      <div className="app-content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          {/* 🔒 유저 전용 라우트 보호 */}
          <Route path="/game" element={isLoggedIn ? <Game /> : <Error />} />
          {/* 🔒 어드민 라우트 보호 */}
          <Route 
            path="/admin" 
            element={
              isLoggedIn && user?.role === "ADMIN" 
                ? <Admin /> 
                : <Navigate to="/" replace /> // 관리자가 아니면 메인으로 쫓겨남!
            } 
          />
          <Route path="/rank" element={isLoggedIn ? <Rank /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
