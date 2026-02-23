package org.hyn.flipit_pro.service;

import org.hyn.flipit_pro.domain.Card;
import org.hyn.flipit_pro.dto.CardDTO;

import java.util.List;

public interface CardService {
    List<Card> getAllCards();

    List<CardDTO> getAllCardsForAdmin();
    CardDTO createCard(CardDTO cardDTO);
    void deleteCard(Long cid);

}
