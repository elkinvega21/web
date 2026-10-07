package com.adventure.retail.infrastructure.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService(
            "test-secret-key-must-be-at-least-32-bytes-long", 3_600_000);

    @Test
    void generatedTokenShouldBeValidAndContainUserId() {
        UUID userId = UUID.randomUUID();

        String token = jwtService.generateToken(userId, "admin@adventure.com", Set.of("ROLE_ADMIN"));

        assertThat(jwtService.isValid(token)).isTrue();
        assertThat(jwtService.userIdFromToken(token)).isEqualTo(userId);
    }

    @Test
    void tamperedTokenShouldBeInvalid() {
        String token = jwtService.generateToken(UUID.randomUUID(), "a@b.co", Set.of("ROLE_USER"));

        assertThat(jwtService.isValid(token + "x")).isFalse();
    }

    @Test
    void garbageShouldBeInvalid() {
        assertThat(jwtService.isValid("not-a-token")).isFalse();
    }
}
