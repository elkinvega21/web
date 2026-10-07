package com.adventure.retail.application.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.adventure.retail.application.exception.InvalidCredentialsException;
import com.adventure.retail.domain.user.User;
import com.adventure.retail.domain.user.UserRepository;
import com.adventure.retail.infrastructure.security.JwtService;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {

    private UserRepository userRepository;
    private JwtService jwtService;
    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtService = mock(JwtService.class);
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void loginShouldReturnTokenForValidCredentials() {
        String hash = passwordEncoder.encode("Admin123!");
        User user = new User(UUID.randomUUID(), "admin@adventure.com", hash, "Administrador",
                Set.of("ROLE_ADMIN"), true, java.time.Instant.now());
        when(userRepository.findByEmail("admin@adventure.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user.getId(), "admin@adventure.com", user.getRoles()))
                .thenReturn("jwt-token");

        AuthService.AuthResult result = authService.login(" Admin@Adventure.com ", "Admin123!");

        assertThat(result.token()).isEqualTo("jwt-token");
        assertThat(result.user().getEmail()).isEqualTo("admin@adventure.com");
    }

    @Test
    void loginShouldRejectInvalidPassword() {
        String hash = passwordEncoder.encode("Admin123!");
        User user = new User(UUID.randomUUID(), "admin@adventure.com", hash, "Administrador",
                Set.of("ROLE_ADMIN"), true, java.time.Instant.now());
        when(userRepository.findByEmail("admin@adventure.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login("admin@adventure.com", "wrong"))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void loginShouldRejectUnknownEmail() {
        when(userRepository.findByEmail("nobody@adventure.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login("nobody@adventure.com", "Admin123!"))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
