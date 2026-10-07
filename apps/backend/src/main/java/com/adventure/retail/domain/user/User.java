package com.adventure.retail.domain.user;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public class User {

    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final String name;
    private final Set<String> roles;
    private final boolean enabled;
    private final Instant createdAt;

    public User(UUID id, String email, String passwordHash, String name,
                Set<String> roles, boolean enabled, Instant createdAt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.roles = Set.copyOf(roles);
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    public static User create(String email, String passwordHash, String name, Set<String> roles) {
        return new User(UUID.randomUUID(), email, passwordHash, name, roles, true, Instant.now());
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
