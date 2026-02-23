package org.hyn.flipit_pro.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.hyn.flipit_pro.security.UserPrincipal;
import org.hyn.flipit_pro.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Arrays;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

@Log4j2
@Component
public class JwtProviderImpl implements JwtProvider {

    @Value("${app.jwt.secret}")
    private String JWT_SECRET;

    @Value("${app.jwt.expiration-in-ms}")
    private Long JWT_EXPIRATION_IN_MS;

    @Override
    public String generateToken(UserPrincipal userPrincipal) {
        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("userId", userPrincipal.getId())
                .claim("name", userPrincipal.getUser().getName()) // ★ 닉네임 추가!
                .claim("roles", userPrincipal.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_IN_MS))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    @Override
    public Authentication getAuthentication(HttpServletRequest request) {
        Claims claims = extractClaims(request);
        if (claims == null) return null;

        String username = claims.getSubject();
        String name = claims.get("name", String.class); // 토큰에서 닉네임 꺼내기
        Long userId = claims.get("userId", Long.class); // (중복 선언된 userId 줄은 하나 지워주세요!)

        if (username == null) return null;

        // roles 처리 로직 (기존과 동일)
        String rolesClaim = claims.get("roles", String.class);
        Set<GrantedAuthority> authorities = (rolesClaim == null || rolesClaim.isEmpty()) ?
                Set.of() :
                Arrays.stream(rolesClaim.split(","))
                        .map(role -> SecurityUtils.convertToAuthority(
                                role.startsWith("ROLE_") ? role : "ROLE_" + role))
                        .collect(Collectors.toSet());

        // 1. 도메인 유저 객체 조립
        org.hyn.flipit_pro.domain.User domainUser = org.hyn.flipit_pro.domain.User.builder()
                .id(userId)
                .username(username)
                .name(name) 
                .build();

        // 2. UserPrincipal 조립 (여기가 중요!)
        UserPrincipal userDetails = UserPrincipal.builder()
                .username(username)
                .id(userId)
                .user(domainUser) // ★ 이걸 꼭 넣어줘야 UserController가 안 터져요!
                .authorities(authorities)
                .build();

        return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
    }


    @Override
    public boolean isTokenValid(HttpServletRequest request) {
        Claims claims = extractClaims(request);
        if (claims == null) return false;
        return claims.getExpiration().after(new Date());
    }

    private Claims extractClaims(HttpServletRequest request) {
        String token = SecurityUtils.extractAuthTokenFromRequest(request);
        if (token == null) return null;
        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String extractAuthTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7); // Bearer 뒤 공백 제거
        }
        return null;
    }
}
