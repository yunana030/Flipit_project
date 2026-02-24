package org.hyn.flipit_pro.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class KakaoDTO {
    private Long id; // 카카오 고유 ID (무조건 넘어옴)

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter
    @NoArgsConstructor
    public static class KakaoAccount {
        @JsonProperty("profile")
        private Profile profile;

        @JsonProperty("email")
        private String email; // 동의 안 하면 null로 들어옴

        @Getter
        @NoArgsConstructor
        public static class Profile {
            @JsonProperty("nickname")
            private String nickname;
        }
    }

    // 서비스에서 닉네임을 안전하게 꺼내기 위한 편의 메서드 추가
    public String getNicknameOrDefault() {
        if (kakaoAccount != null && kakaoAccount.getProfile() != null) {
            return kakaoAccount.getProfile().getNickname();
        }
        return "익명사용자";
    }
}