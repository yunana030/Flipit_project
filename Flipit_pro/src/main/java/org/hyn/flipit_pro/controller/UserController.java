package org.hyn.flipit_pro.controller;


import org.hyn.flipit_pro.domain.Role;
import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.UserDTO;
import org.hyn.flipit_pro.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.hyn.flipit_pro.security.UserPrincipal;
import java.util.List;

@RequestMapping("/api/user")
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // User user = currentUser.getUser();
        User user = userService.findByUsername(currentUser.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName()) // 실제 DB에 저장된 닉네임
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        List<UserDTO> userList = userService.getAllUsers();
        return ResponseEntity.ok(userList);
    }

}
