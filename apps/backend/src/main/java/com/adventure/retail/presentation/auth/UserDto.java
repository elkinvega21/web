package com.adventure.retail.presentation.auth;

import java.util.Set;
import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String name,
        Set<String> roles) {
}
