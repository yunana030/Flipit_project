package org.hyn.flipit_pro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StageRuleDTO {
    private int stageNum;
    private int cardCount;
    private boolean isLastStage;
}
