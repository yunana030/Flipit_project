package org.hyn.flipit_pro.repository;

import org.hyn.flipit_pro.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    // 기존 username 조회
    User findByUsername(String username);

    // 새로 명명: username 기준으로 Optional 반환
    Optional<User> findOptionalByUsername(String username);
}