package org.hyn.flipit_pro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import org.hyn.flipit_pro.domain.PlayRecord;

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

    public static PlayRecordDTO from(PlayRecord record) {
        if (record == null || record.getUser() == null) return null;
        
        return new PlayRecordDTO(
            record.getUser().getId(),
            record.getUser().getUsername(),
            record.getLaststage(),
            record.getBeststage(),
            record.getClickCount(),
            record.getCreateTime()
        );
    }
}

