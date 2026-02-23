package org.hyn.flipit_pro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardDTO {
    private Long cid;
    private String imageUrl;
    private String cname;     // 카드 이름/질문
    private String category;  // 카테고리
    private LocalDateTime createdTime;
}