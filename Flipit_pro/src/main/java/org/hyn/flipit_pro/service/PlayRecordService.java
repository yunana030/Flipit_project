package org.hyn.flipit_pro.service;

import org.hyn.flipit_pro.domain.PlayRecord;
import org.hyn.flipit_pro.dto.GameProgressResponseDTO;
import java.util.List;

public interface PlayRecordService {

    // 1. 전체 랭킹 조회
    List<PlayRecord> getAllRecordsSorted();

    // 2. 저장/업데이트
    GameProgressResponseDTO saveOrUpdateRecordByUsername(
            String username, int stage, int clickCount);

    // 3. 진행 상태 조회
    GameProgressResponseDTO getGameProgressByUsername(String username);

    // 4. 특정 유저 기록 조회 (랭킹용)
    PlayRecord getRecordByUsername(String username);
}

