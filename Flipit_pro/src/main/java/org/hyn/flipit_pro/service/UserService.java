package org.hyn.flipit_pro.service;

import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.UserDTO;

import java.util.List;

public interface UserService {
    User signupUser(User user);
    User findByUsername(String username);
    List<UserDTO> getAllUsers();

    void deleteUser(Long userId);
//    void deleteUserWithRecords(Long userId);
}
