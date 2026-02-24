import React, { useState } from "react";
import "./LoginModal.css";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.service";
import { useAuthStore } from "../../store/useAuthStore";

export const LoginModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginService({ username, password });
      const userData = response.data;
      const token = userData.token;

      // zustand로 전역 상태 저장
      login(userData, token);

      console.log("Login 성공:", userData);

      onClose();
      navigate("/"); // 로그인 후 메인 이동
    } catch (error) {
      console.error("Login 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKakaoLogin = () => {
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    // 1. 환경 변수가 잘 들어오는지 콘솔로 먼저 확인!
    // console.log("ClientId:", clientId);
    // console.log("RedirectURI:", redirectUri);

    if (!clientId || !redirectUri) {
      alert("환경 변수(API 키)를 찾을 수 없습니다. .env 파일을 확인하고 서버를 재시작하세요!");
      return;
    }

    // 2. 카카오 인증 페이지 URL 생성
    const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    
    // 3. 이동하기 전에 URL이 맞는지 확인
    console.log("이동할 URL:", kakaoUrl);
    
    window.location.href = kakaoUrl;
  };




  const handleCreateAccount = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>
          ×
        </button>

        <header className="login-header">
          <h1 className="login-title">Log In</h1>
        </header>

        <div className="login-line"></div>
        <p className="login-subtitle">간편 로그인</p>

        <div className="signup-social">
          <button type="button" className="signup-kakao-btn" onClick={handleKakaoLogin}>
            <img src="/images/카카오로고.png" alt="Kakao" />
            <span>Login with Kakao</span>
          </button>
        </div>

        <div className="login-line"></div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-box">
            <label className="label-box">
              <span className="label-text">Id</span>
            </label>
            <div className="input-wrapper">
              <input
                className="input-field"
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field-box">
            <label className="label-box">
              <span className="label-text">Password</span>
            </label>
            <div className="input-wrapper">
              <input
                className="input-field"
                placeholder="****"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="signup-submit-btn">
            Log In
          </button>

          <p className="create-box">
            <span className="create-label">No Account?</span>&nbsp;
            <span className="create-text" onClick={handleCreateAccount}>
              Create One
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};