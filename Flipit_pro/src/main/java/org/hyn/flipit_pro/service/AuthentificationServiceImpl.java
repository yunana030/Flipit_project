package org.hyn.flipit_pro.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hyn.flipit_pro.domain.PlayRecord;
import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.KakaoDTO;
import org.hyn.flipit_pro.dto.UserDTO;
import org.hyn.flipit_pro.repository.PlayRecordRepository;
import org.hyn.flipit_pro.repository.UserRepository;
import org.hyn.flipit_pro.security.UserPrincipal;
import org.hyn.flipit_pro.security.jwt.JwtProvider;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import org.springframework.beans.factory.annotation.Value;

import java.util.Map;
import java.util.Optional;


@Service
@Log4j2
@RequiredArgsConstructor
public class AuthentificationServiceImpl implements AuthentificationService {
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    private final PlayRecordRepository playRecordRepository;
    private final UserRepository userRepository;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Override
    public UserDTO signInAndReturnJWT(User signInRequest) {
        // 1. 로그인 인증 및 기본 정보 세팅
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signInRequest.getUsername(), signInRequest.getPassword())
        );
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = jwtProvider.generateToken(userPrincipal);
        User user = userPrincipal.getUser();

        // 2. DB에서 이 유저의 기록만 딱 하나 가져오기
        Optional<PlayRecord> playRecordOpt = playRecordRepository.findByUserId(user.getId());

        // 3. 기록이 있으면 그 값을 쓰고, 없으면 0을 씁니다.
        int bestStage = playRecordOpt.map(PlayRecord::getBeststage).orElse(0);
        int clickCount = playRecordOpt.map(PlayRecord::getClickCount).orElse(0);

        // 💡 확인용 로그 (여기 숫자가 0이 아닌지 서버 콘솔에서 확인!)
        log.info("로그인 유저: {}, 스테이지: {}, 클릭수: {}", user.getUsername(), bestStage, clickCount);

        // 4. 최종적으로 UserDTO를 만들어 리턴
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .role(user.getRole())
                .createTime(user.getCreateTime())
                .token(jwt)
                .bestStage(bestStage)
                .clickCount(clickCount)
                .build();
    }

    // 카카오 간편 로그인

    private KakaoDTO getKakaoUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();

        // 헤더 설정: 카카오에서 받은 액세스 토큰을 넣음
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);

        // 카카오 유저 정보 요청 주소로 POST 전송
        ResponseEntity<KakaoDTO> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                KakaoDTO.class //KakaoDTO로 바로 변환!
        );

        return response.getBody();
    }

    private String getKakaoAccessToken(String code) {
        log.info("보내는 Client ID: [{}]", kakaoClientId);
        log.info("보내는 Redirect URI: [{}]", kakaoRedirectUri);
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                Map.class
        );
        log.info("카카오 유저 정보: {}", response.getBody());
        // 토큰 요청 메서드 시작 부분에 추가
        System.out.println("DEBUG: clientId = " + kakaoClientId);
        System.out.println("DEBUG: redirectUri = " + kakaoRedirectUri);

        return (String) response.getBody().get("access_token");
    }


        @Override
        @org.springframework.transaction.annotation.Transactional
        public UserDTO signInWithKakao(String code) {
        try {
                // 1. 카카오 통신
                String kakaoToken = getKakaoAccessToken(code);
                log.info("받은 카카오 토큰: {}", kakaoToken);
                KakaoDTO kakaoUserInfo = getKakaoUserInfo(kakaoToken);
                
                // 2. 고유 식별자 생성
                String kakaoUsername = "KAKAO_" + kakaoUserInfo.getId();
                String nickname = (kakaoUserInfo.getKakaoAccount() != null && 
                                kakaoUserInfo.getKakaoAccount().getProfile() != null) 
                                ? kakaoUserInfo.getKakaoAccount().getProfile().getNickname() 
                                : "익명사용자";

                // 3. DB 확인 및 자동 가입
                User user = userRepository.findByUsername(kakaoUsername);
                if (user == null) {
                user = userRepository.save(User.builder()
                        .username(kakaoUsername)
                        .name(nickname)
                        .password("KAKAO_USER") 
                        .role(org.hyn.flipit_pro.domain.Role.USER) 
                        .createTime(java.time.LocalDateTime.now())
                        .build());
                }

                // 4. 게임 기록 연동 (Null 방어)
                Optional<PlayRecord> playRecordOpt = playRecordRepository.findByUserId(user.getId());
                int bestStage = playRecordOpt.map(PlayRecord::getBeststage).orElse(0);
                int clickCount = playRecordOpt.map(PlayRecord::getClickCount).orElse(0);

                // 5. 토큰 생성
                UserPrincipal userPrincipal = UserPrincipal.create(user);
                String jwt = jwtProvider.generateToken(userPrincipal);

                return UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .name(user.getName())
                        .role(user.getRole())
                        .createTime(user.getCreateTime())
                        .token(jwt)
                        .bestStage(bestStage)
                        .clickCount(clickCount)
                        .build();

        } catch (Exception e) {
                log.error("카카오 로그인 중 심각한 에러 발생: ", e);
                throw new RuntimeException("카카오 로그인 처리 실패: " + e.getMessage());
        }
        }
}
