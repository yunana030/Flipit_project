package org.hyn.flipit_pro.service;

import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.UserDTO;

public interface AuthentificationService {
    UserDTO signInAndReturnJWT(User signInRequest);
}
