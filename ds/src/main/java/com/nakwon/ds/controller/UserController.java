package com.nakwon.ds.controller;

import com.nakwon.ds.dto.PasswordChangeRequest;
import com.nakwon.ds.dto.UserResponse;
import com.nakwon.ds.entity.User;
import com.nakwon.ds.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyInfo(@AuthenticationPrincipal User user) {
        UserResponse response = userService.getUserInfo(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(user, request);
        return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
    }

    @PutMapping("/name")
    public ResponseEntity<?> updateName(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) {
        userService.updateName(user, request.get("name"));
        return ResponseEntity.ok(Map.of("message", "이름이 변경되었습니다."));
    }
}
