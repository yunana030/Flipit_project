package org.hyn.flipit_pro.controller;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.domain.Card;
import org.hyn.flipit_pro.dto.CardDTO;
import org.hyn.flipit_pro.service.CardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @GetMapping
    public List<Card> getAllCards() {
        return cardService.getAllCards();
    }

    // 🔥 추가: 관리자 전용 엔드포인트
    // R (Read: 목록 조회) - GET /api/cards/admin
    @GetMapping("/admin")
    public ResponseEntity<List<CardDTO>> getAllCardsForAdmin() {
        List<CardDTO> cardList = cardService.getAllCardsForAdmin();
        return ResponseEntity.ok(cardList);
    }

    // C (Create: 카드 추가) - POST /api/cards/admin
    @PostMapping("/admin/add")
    public ResponseEntity<CardDTO> createCardForAdmin(@RequestBody CardDTO cardDTO) {
        CardDTO newCard = cardService.createCard(cardDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCard);
    }

    // D (Delete: 카드 삭제) - DELETE /api/cards/admin/{cid}
    @DeleteMapping("/admin/{cid}")
    public ResponseEntity<Void> deleteCardForAdmin(@PathVariable Long cid) {
        cardService.deleteCard(cid);
        return ResponseEntity.noContent().build();
    }
}