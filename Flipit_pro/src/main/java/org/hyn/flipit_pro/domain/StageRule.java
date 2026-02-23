package org.hyn.flipit_pro.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class StageRule {
    @Id
    private int stageNum;

    private int cardCount;

}
