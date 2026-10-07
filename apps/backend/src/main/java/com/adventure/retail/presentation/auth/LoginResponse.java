package com.adventure.retail.presentation.auth;

public record LoginResponse(
        String token,
        UserDto user) {
}
