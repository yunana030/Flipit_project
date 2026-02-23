package org.hyn.flipit_pro.service;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.domain.StageRule;
import org.hyn.flipit_pro.repository.StageRuleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class StageRuleServiceImpl implements StageRuleService {
    private final StageRuleRepository stageRuleRepository;

    @Override
    public int getCardCount(int stageNum) {

        int maxStage = getMaxStageNum();

        if (stageNum > maxStage) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "존재하지 않는 단계입니다: " + stageNum
            );
        }

        return stageRuleRepository.findByStageNum(stageNum)
            .map(StageRule::getCardCount)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "존재하지 않는 단계입니다: " + stageNum
            ));
    }

    @Override
    public int getMaxStageNum() {
        return stageRuleRepository.findTopByOrderByStageNumDesc()
                .map(StageRule::getStageNum)
                .orElse(0);
    }
}