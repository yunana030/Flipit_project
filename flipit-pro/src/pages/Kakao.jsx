import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuthStore } from "../store/useAuthStore";

const Kakao = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const hasRequested = useRef(false); // 요청 상태 기억

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code && !hasRequested.current) {
      hasRequested.current = true;
      
      console.log("백엔드에 코드를 딱 한 번만 보냅니다!");

      api.post(`/api/authentication/kakao?code=${code}`)
        .then((res) => {
          console.log("카카오 로그인 성공!", res.data);
          login(res.data, res.data.token);
          navigate("/");
        })
        .catch((err) => {
          console.error(" 로그인 에러:", err);
          navigate("/");
        });
    }
  }, [navigate, login]);

  return <div>카카오 로그인 처리 중</div>;
};

export default Kakao;