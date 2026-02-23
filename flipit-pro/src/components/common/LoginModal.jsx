import React, { useState } from "react";
import "./LoginModal.css";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.service";

export const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginService({ username, password });
      const userData = response.data; 
      const token = userData.token; // UserDTO 안에 있는 token 꺼내기

      localStorage.setItem("token", token);

      onLoginSuccess({ token, user: userData });

      onClose();
      console.log("Login 성공, 데이터:", userData);
    } catch (error) {
      console.error("Login 실패:", error);
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKakaoLogin = () => console.log("Kakao login clicked");
  const handleGoogleLogin = () => console.log("Google login clicked");
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

        {/* <div className="login-line"></div>
        <p className="login-subtitle">간편 로그인</p>

        <div className="signup-social">
          <button type="button" className="signup-kakao-btn" onClick={handleKakaoLogin}>
            <img src="/images/카카오로고.png" alt="Kakao" />
            <span>Login with Kakao</span>
          </button>

          <button type="button" className="signup-google-btn" onClick={handleGoogleLogin}>
            <img src="/images/구글로고.png" alt="Google" />
            <span>Login with Google</span>
          </button>
        </div> */}

        <div className="login-line"></div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-box">
            <label htmlFor="username" className="label-box">
              <span className="label-text">Id</span>
            </label>
            <div className="input-wrapper">
              <input
                id="username"
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
            <label htmlFor="password" className="label-box">
              <span className="label-text">Password</span>
            </label>
            <div className="input-wrapper">
              <input
                id="password"
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