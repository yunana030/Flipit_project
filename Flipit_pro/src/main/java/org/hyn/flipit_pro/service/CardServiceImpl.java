package org.hyn.flipit_pro.service;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.domain.Card;
import org.hyn.flipit_pro.dto.CardDTO;
import org.hyn.flipit_pro.repository.CardRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;

    @Override
    public List<Card> getAllCards() {
        return cardRepository.findAll(); // DB에서 모든 카드 조회
    }

    @Override
    public List<CardDTO> getAllCardsForAdmin() {
        return cardRepository.findAll().stream()
                .map(card -> CardDTO.builder()
                        .cid(card.getCid())
                        .imageUrl(card.getImageUrl())
                        .cname(card.getCname())
                        .category(card.getCategory())
                        .createdTime(card.getCreatedTime())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public CardDTO createCard(CardDTO cardDTO) {
        // 1. DTO -> Entity 변환 및 필드 설정
        Card card = Card.builder()
                .imageUrl(cardDTO.getImageUrl())
                .cname(cardDTO.getCname())
                // 💡 category는 입력받지 않으므로 기본값 'etc' 설정
                .category(cardDTO.getCategory() != null ? cardDTO.getCategory() : "etc")
                .createdTime(LocalDateTime.now())
                .build();

        // 2. Repository를 통해 저장
        Card savedCard = cardRepository.save(card);

        // 3. 저장된 Entity -> DTO 변환 후 반환 (등록 확인용)
        return CardDTO.builder()
                .cid(savedCard.getCid())
                .imageUrl(savedCard.getImageUrl())
                .cname(savedCard.getCname())
                .category(savedCard.getCategory())
                .createdTime(savedCard.getCreatedTime())
                .build();
    }

    @Override
    public void deleteCard(Long cid) {
        // 존재 여부 확인
        if (!cardRepository.existsById(cid)) {
            throw new IllegalArgumentException("삭제할 카드가 존재하지 않습니다. cid=" + cid);
        }

        // 삭제
        cardRepository.deleteById(cid);
    }
}