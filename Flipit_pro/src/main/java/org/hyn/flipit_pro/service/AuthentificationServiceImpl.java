package org.hyn.flipit_pro.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hyn.flipit_pro.domain.PlayRecord;
import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.UserDTO;
import org.hyn.flipit_pro.repository.PlayRecordRepository;
import org.hyn.flipit_pro.security.UserPrincipal;
import org.hyn.flipit_pro.security.jwt.JwtProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@Log4j2
@RequiredArgsConstructor
public class AuthentificationServiceImpl implements AuthentificationService {
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    private final PlayRecordRepository playRecordRepository; 

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
                .bestStage(bestStage)  // 여기서 확실히 값이 박힙니다.
                .clickCount(clickCount)
                .build();
    }
}