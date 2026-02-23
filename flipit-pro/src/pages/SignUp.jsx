import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { checkUsernameService, registerService } from "../services/auth.service"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SignUp = () => {
   const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    passwordCheck: "",
  });

  const navigate = useNavigate();
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState(""); 
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  
  // 모든 조건 체크 후 버튼 활성화 여부 결정
// const isFormValid =
//   formData.username.trim() !== "" &&
//   formData.name.trim() !== "" &&
//   formData.password !== "" &&
//   formData.passwordCheck !== "" &&
//   isUsernameValid &&
//   passwordValid &&
//   passwordMatch;
const [isFormValid, setIsFormValid] = useState(false);

useEffect(() => {
  setIsFormValid(
    formData.username.trim() !== "" &&
    formData.name.trim() !== "" &&
    formData.password !== "" &&
    formData.passwordCheck !== "" &&
    isUsernameValid &&
    passwordValid &&
    passwordMatch
  );
}, [formData, isUsernameValid, passwordValid, passwordMatch]);



// 비밀번호 입력 시 유효성 체크 및 일치 여부 확인
  const handlePassword = (e) => {
    const { value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, password: value };
      
      // 최신 값 사용해서 passwordMatch 계산
      setPasswordMatch(value === newFormData.passwordCheck && newFormData.passwordCheck !== "");

      return newFormData;
    });

    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    setPasswordValid(regex.test(value));
  };


  // 비밀번호 확인 입력 시
    const handlePasswordCheckChange = (e) => {
      const { value } = e.target;
      setFormData(prev => {
        const newFormData = { ...prev, passwordCheck: value };
        
        setPasswordMatch(newFormData.password === value && value !== "");

        return newFormData;
      });
    };
  // password와 passwordCheck 일치 여부 확인
  useEffect(() => {
    setPasswordMatch(
      formData.password.length > 0 &&
      formData.passwordCheck.length > 0 &&
      formData.password === formData.passwordCheck
    );
  }, [formData.password, formData.passwordCheck]);


  // 일반 입력 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "username") {
      setIsUsernameValid(false);
      setUsernameMessage("");
    }
  };

  // username 중복 체크
  const handleDuplicateCheck = async () => {
    try {
      const response = await checkUsernameService(formData.username);
      setUsernameMessage(response.data);
      setIsUsernameValid(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setUsernameMessage(error.response.data);
        setIsUsernameValid(false);
      } else {
        setUsernameMessage("서버 오류");
        setIsUsernameValid(false);
      }
    }
  };

  // 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await registerService({
        username: formData.username,
        password: formData.password,
        name: formData.name,
      });
      console.log("회원가입 성공:", response.data);
      alert("회원가입 성공!");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 실패!");
    }
  };



  return (
    <div className="signup-page">

      <img src="/images/particle1.png" className="particle particle1" />
      <img src="/images/particle2.png" className="particle particle2" />
      <img src="/images/particle3.png" className="particle particle3" />
      <img src="/images/particle4.png" className="particle particle4" />
      <img src="/images/particle5.png" className="particle particle5" />
      <img src="/images/particle6.png" className="particle particle6" />

      {/* 1. 입구 식물 배경 */}
      <img
        src="/images/tunnelplant.png"
        alt="tunnel plant background"
        className="signup-tunnelplant"
      />

      {/* 2. 펼쳐진 책 */}
      <img
        src="/images/openbook.png"
        alt="open book"
        className="signup-openbook"
      />

      {/* 3. 회원가입 폼 영역 - 화면 중앙 고정 */}
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSignup}>
          <header className="signup-header">
            <h1 className="signup-title">Sign Up</h1>
          </header>

          <div className="signup-content">
            <div className="signup-line"></div>

            <div className="signup-field-wrapper">
              <div className="signup-label-with-btn">
                <label htmlFor="username" className="signup-label">Id</label>
                <button
                  type="button"
                  className="signup-duplicate-btn"
                  onClick={handleDuplicateCheck}
                >
                  중복 확인
                </button>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Id"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                className="signup-input"
              />
              <div className="username-message">{usernameMessage}</div>
            </div>

            <div className="signup-field-wrapper">
              <label htmlFor="name" className="signup-label">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                className="signup-input"
              />
            </div>

            <div className="signup-field-wrapper">
              <label htmlFor="password" className="signup-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                value={formData.password}
                onChange={handlePassword}
                autoComplete="new-password"
                className="signup-input"
              />
              {formData.password && !passwordValid && (
                <div className="password-error">
                  영어 + 숫자 + 특수문자 포함, 8자 이상
                </div>
              )}
            </div>

            <div className="signup-field-wrapper">
              <label htmlFor="passwordCheck" className="signup-label">Password Check</label>
              <input
                id="passwordCheck"
                name="passwordCheck"
                type="password"
                placeholder="******"
                value={formData.passwordCheck}
                onChange={handlePasswordCheckChange}
                autoComplete="new-password"
                className="signup-input"
              />
              {formData.passwordCheck && !passwordMatch && (
                <div className="password-error">비밀번호가 일치하지 않습니다</div>
              )}
            </div>

            <button
              type="submit"
              className={`signup-submit-btn ${isFormValid ? "active" : ""}`}
              disabled={!isFormValid}
            >
              <div className="signup-submit-text">Sign Up</div>
            </button>

          </div>
        </form>
      </div>

    </div>
  );


};
