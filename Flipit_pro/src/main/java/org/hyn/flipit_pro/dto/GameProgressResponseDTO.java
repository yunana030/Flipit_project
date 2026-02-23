package org.hyn.flipit_pro.dto;

import lombok.*;
import org.hyn.flipit_pro.domain.StageRule;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GameProgressResponseDTO {
    private boolean exists;
    private int stage;
    private int maxStage;
    private boolean isLastStage;

}
