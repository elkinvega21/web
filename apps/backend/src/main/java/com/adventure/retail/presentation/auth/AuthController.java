package com.adventure.retail.presentation.auth;

import com.adventure.retail.application.auth.AuthService;
import com.adventure.retail.domain.user.User;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthResult result = authService.login(request.email(), request.password());
        return new LoginResponse(result.token(), toDto(result.user()));
    }

    @GetMapping("/me")
    public UserDto me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.findByEmail(authentication.getName());
        return toDto(user);
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getName(), user.getRoles());
    }
}
