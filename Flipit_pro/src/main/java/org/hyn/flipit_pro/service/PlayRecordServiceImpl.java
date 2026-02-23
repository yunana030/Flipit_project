package org.hyn.flipit_pro.service;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.domain.PlayRecord;
import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.GameProgressResponseDTO;
import org.hyn.flipit_pro.repository.PlayRecordRepository;
import org.hyn.flipit_pro.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayRecordServiceImpl implements PlayRecordService {

    private final PlayRecordRepository playRecordRepository;
    private final UserRepository userRepository;
    private final StageRuleService stageRuleService; 

    @Override
    public List<PlayRecord> getAllRecordsSorted() {
        return playRecordRepository.findAllOrderByBestRecord();
    }

    @Override
    @Transactional
    public GameProgressResponseDTO saveOrUpdateRecordByUsername(String username, int stage, int clickCount) {

        int maxStage = stageRuleService.getMaxStageNum();

        User user = userRepository.findOptionalByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PlayRecord record = playRecordRepository.findByUserId(user.getId())
                .orElse(PlayRecord.builder()
                        .user(user)
                        .beststage(0)
                        .clickCount(0)
                        .build());

        // 1. 현재 진행 단계 저장 (이어하기용)
        record.setLaststage(stage);

        // 2. 최고 기록 갱신 (랭킹용)
        if (stage > record.getBeststage()) {
            record.setBeststage(stage);
            record.setClickCount(clickCount);
        } else if (stage == record.getBeststage() &&
                (record.getClickCount() == 0 || clickCount < record.getClickCount())) {
            record.setClickCount(clickCount);
        }

        playRecordRepository.save(record);

        // 3. 결과 반환: 방금 깬 'stage'가 'maxStage'와 같은지 비교 (1단계 튕김 방지 핵심)
        return GameProgressResponseDTO.builder()
                .exists(true)
                .stage(record.getLaststage())
                .maxStage(maxStage)
                .isLastStage(stage >= maxStage) 
                .build();
    }

    @Override
    public GameProgressResponseDTO getGameProgressByUsername(String username) {
        int maxStage = stageRuleService.getMaxStageNum(); 

        User user = userRepository.findOptionalByUsername(username).orElse(null);
        
        if (user == null) {
            return GameProgressResponseDTO.builder()
                    .exists(false).stage(1).maxStage(maxStage).isLastStage(false).build();
        }

        return playRecordRepository.findByUserId(user.getId())
                .map(record -> GameProgressResponseDTO.builder()
                        .exists(true)
                        .stage(record.getLaststage())
                        .maxStage(maxStage)
                        .isLastStage(record.getLaststage() >= maxStage)
                        .build()
                ).orElse(GameProgressResponseDTO.builder()
                        .exists(false).stage(1).maxStage(maxStage).isLastStage(false).build());
    }

    @Override
    public PlayRecord getRecordByUsername(String username) {
        return userRepository.findOptionalByUsername(username)
                .flatMap(user -> playRecordRepository.findByUserId(user.getId()))
                .orElse(null);
    }
}