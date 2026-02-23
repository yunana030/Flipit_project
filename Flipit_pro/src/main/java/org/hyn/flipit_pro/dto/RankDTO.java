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
public class RankDTO {
    private Long userId;
    private String username;
    private String name;
    private int lastStage;
    private int clickCount;
    private LocalDateTime createTime; // 기록 등록 시각
}
