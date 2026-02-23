package org.hyn.flipit_pro.controller;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.domain.PlayRecord;
import org.hyn.flipit_pro.dto.GameProgressResponseDTO;
import org.hyn.flipit_pro.dto.PlayRecordDTO;
import org.hyn.flipit_pro.service.PlayRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/play-record")
@RequiredArgsConstructor
public class PlayRecordController {

    private final PlayRecordService playRecordService;

    // 1. 전체 랭킹 조회 (getAllRecordsSorted 사용)
    @GetMapping("/ranks")
    public ResponseEntity<List<PlayRecordDTO>> getAllUserRanks() {
        return ResponseEntity.ok(
            playRecordService.getAllRecordsSorted().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList())
        );
    }

    // 2. 기록 저장 및 업데이트
    @PostMapping("/save")
    public ResponseEntity<GameProgressResponseDTO> saveOrUpdateRecord(@RequestBody Map<String, Object> body) {

        String username = body.get("username").toString();
        int stage = (Integer) body.get("stage");
        int clickCount = (Integer) body.get("clickCount");

        GameProgressResponseDTO response =
                playRecordService.saveOrUpdateRecordByUsername(username, stage, clickCount);

        return ResponseEntity.ok(response);
    }

    // 3. 내 랭킹 및 진행 상태 조회
    @GetMapping("/my-rank-by-username/{username}")
    public ResponseEntity<PlayRecordDTO> getMyRankByUsername(@PathVariable String username) {
        PlayRecord record = playRecordService.getRecordByUsername(username);
        
        if (record == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToDTO(record));
    }
    // 4. 게임 진행 상태 조회
    @GetMapping("/progress")
    public ResponseEntity<GameProgressResponseDTO> getGameProgress() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.ok(GameProgressResponseDTO.builder().exists(false).stage(1).build());
        }

        return ResponseEntity.ok(playRecordService.getGameProgressByUsername(auth.getName()));
    }

    // DTO 변환 헬퍼
    private PlayRecordDTO convertToDTO(PlayRecord record) {
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