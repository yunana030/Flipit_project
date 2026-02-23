package org.hyn.flipit_pro.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.hyn.flipit_pro.domain.Role;
import org.hyn.flipit_pro.domain.User;
import org.hyn.flipit_pro.dto.UserDTO;
import org.hyn.flipit_pro.repository.PlayRecordRepository;
import org.hyn.flipit_pro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@Transactional
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PlayRecordRepository  playRecordRepository;

    @Override
    public User signupUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        return userRepository.save(user);
    }

    @Override
    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> userList = userRepository.findAll();

        // 필요한 필드만 DTO로 매핑 (password는 null 처리)
        return userList.stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .password(null)
                        .name(user.getName())
                        .createTime(user.getCreateTime())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        if ("adyuna1".equals(user.getUsername())) return; // 관리자 보호

        // 기록 존재 여부 확인 후 삭제
        if (playRecordRepository.existsByUserId(userId)) {
            // 기록 삭제
            playRecordRepository.deleteByUserId(userId);
        }

        userRepository.deleteById(userId);
    }
}
