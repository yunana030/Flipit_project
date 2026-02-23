package org.hyn.flipit_pro.controller;

import lombok.RequiredArgsConstructor;
import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.UserDTO;
import org.hyn.flipit_pro.service.AuthentificationService;
import org.hyn.flipit_pro.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/authentication")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthentificationController {

    private final UserService userService;
    private final AuthentificationService authentificationService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Object> signUp(@RequestBody User user) {
        if (userService.findByUsername(user.getUsername()) != null) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        String password = user.getPassword();
        if (!password.matches("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$")) {
            return new ResponseEntity<>("비밀번호 규칙에 맞지 않습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userService.signupUser(user), HttpStatus.CREATED);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserDTO> signIn(@RequestBody User user) {
        // 서비스 호출 (User엔티티 대신 UserDTO를 리턴)
        UserDTO loginResponse = authentificationService.signInAndReturnJWT(user);

        return ResponseEntity.ok(loginResponse);
    }

    // 아이디 중복확인
    @GetMapping("/check-username")
    public ResponseEntity<Object> checkUsername(@RequestParam String username) {
        boolean exists = userService.findByUsername(username) != null;
        if (exists) {
            return new ResponseEntity<>("이미 존재하는 아이디입니다", HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>("사용가능한 아이디입니다", HttpStatus.OK);
        }
    }
}
