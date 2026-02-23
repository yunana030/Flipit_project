package org.hyn.flipit_pro.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import org.hyn.flipit_pro.security.UserPrincipal;
import org.springframework.security.core.Authentication;

public interface JwtProvider {
    //토근 생성
    String generateToken(UserPrincipal userPrincipal);
    //인증정보 얻기
    Authentication getAuthentication(HttpServletRequest request);
    // 토근 유효성 검증
    boolean isTokenValid(HttpServletRequest request);
}
