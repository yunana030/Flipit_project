package org.hyn.flipit_pro.repository;

import org.hyn.flipit_pro.domain.StageRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface StageRuleRepository extends JpaRepository<StageRule, Integer> {
    Optional<StageRule> findTopByOrderByStageNumDesc();
    @Query("SELECT MAX(s.stageNum) FROM StageRule s")
    Integer findMaxStage();
    Optional<StageRule> findByStageNum(int stageNum);
}
