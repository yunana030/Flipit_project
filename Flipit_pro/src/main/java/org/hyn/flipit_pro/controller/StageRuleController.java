package org.hyn.flipit_pro.controller;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.dto.StageRuleDTO;
import org.hyn.flipit_pro.service.StageRuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stage")
@RequiredArgsConstructor
public class StageRuleController {

    private final StageRuleService stageRuleService;

    @GetMapping("/{stageNum}")
    public ResponseEntity<StageRuleDTO> getStage(@PathVariable int stageNum) {
        // 서비스에서 findByStageNum을 쓰도록 고쳤으므로 이제 정상 작동할 겁니다.
        int cardCount = stageRuleService.getCardCount(stageNum);
        
        // 0보다 클 때만 정상 응답
        if (cardCount <= 0) {
            return ResponseEntity.notFound().build(); 
        }

        int maxStage = stageRuleService.getMaxStageNum();
        boolean isLastStage = (stageNum >= maxStage); // >= 로 방어 로직 강화

        return ResponseEntity.ok(new StageRuleDTO(stageNum, cardCount, isLastStage));
    }

    @GetMapping("/max")
    public ResponseEntity<StageRuleDTO> getMaxStage() {
        int maxStage = stageRuleService.getMaxStageNum();
        int cardCount = stageRuleService.getCardCount(maxStage);
        return ResponseEntity.ok(new StageRuleDTO(maxStage, cardCount, true));
    }
}