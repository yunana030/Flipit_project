package org.hyn.flipit_pro; // 님의 패키지명에 맞게 유지하세요

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// @SpringBootTest  <-- 이거 지운 상태여야 합니다!
class FlipitProApplicationTests {

    @Test
    void makePassword() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("1234");
        System.out.println("\n====================================");
        System.out.println("해시값: " + hash);
        System.out.println("====================================\n");
    }
}