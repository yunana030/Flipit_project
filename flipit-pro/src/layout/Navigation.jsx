import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; // 스토어 가져오기


export const Navigation = ({ onLoginClick, onLogoutClick }) => {
  const navigate = useNavigate();
  
  // 2. Zustand 스토어에서 로그인 상태와 유저 정보 꺼내기
  const { isLoggedIn, user } = useAuthStore(); 

  return (
    <header className="navigation">
      <div className="navigation-inner">
        <div className="navigation-header">
          {/* 로고 */}
          <div className="logo" onClick={() => navigate("/")}>
            <img src="/images/메인로고1.png" alt="FlipIt Logo" className="logo-img" />
          </div>

          <div className="nav-wrapper">
            <nav className="nav-items">
              <div className="nav-group">
                {user?.role === "ADMIN" && ( 
                  <div className="nav-item" onClick={() => navigate("/admin")}>
                    관리자
                  </div>
                )}
                
                <div className="nav-item home-icon" onClick={() => navigate("/")}><FaHome /></div>
                <div className="nav-item" onClick={() => navigate("/rank")}>랭킹</div>
                <div className="nav-item" onClick={() => navigate("/game")}>GameStart</div>
              </div>

              <div className="login-group">
                <div className="show-name">
                  {user?.name ? `${user.name.replace("닉네임-", "")}님` : ""}
                </div>

                {isLoggedIn ? (
                  <button
                    className="login-button"
                    onClick={() => {
                      if (window.confirm("로그아웃 하시겠습니까?")) {
                        onLogoutClick();
                      }
                    }}
                  >
                    Log Out
                  </button>
                ) : (
                  <button className="login-button" onClick={onLoginClick}>
                    Log In
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};