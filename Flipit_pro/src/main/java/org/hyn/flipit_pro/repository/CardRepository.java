package org.hyn.flipit_pro.repository;

import org.hyn.flipit_pro.domain.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    // 나중에 필요하면 카테고리별 조회, 랜덤 조회 같은 커스텀 메소드 추가 가능
}