package org.hyn.flipit_pro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hyn.flipit_pro.domain.Role;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private String name;
    private LocalDateTime createTime;
    private Role role;
    private String token;
    @JsonProperty("bestStage")
    private int bestStage;

    @JsonProperty("clickCount")
    private int clickCount;
}
