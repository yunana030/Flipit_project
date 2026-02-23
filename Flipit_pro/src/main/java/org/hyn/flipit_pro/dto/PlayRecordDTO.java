package org.hyn.flipit_pro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlayRecordDTO {
    private Long userId;
    private String userName;
    private int lastStage;
    private int bestStage;
    private int clickCount;
    private LocalDateTime createTime;
}

