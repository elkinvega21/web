package com.adventure.retail.infrastructure.persistence.user;

import com.adventure.retail.domain.user.User;
import com.adventure.retail.domain.user.UserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;

    public UserRepositoryAdapter(UserJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public User save(User user) {
        UserJpaEntity entity = new UserJpaEntity(
                user.getId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getName(),
                String.join(",", user.getRoles()),
                user.isEnabled(),
                user.getCreatedAt(),
                java.time.Instant.now());
        return toDomain(jpaRepository.save(entity));
    }

    private User toDomain(UserJpaEntity entity) {
        return new User(
                entity.getId(),
                entity.getEmail(),
                entity.getPasswordHash(),
                entity.getName(),
                Set.of(entity.getRoles().split(",")),
                entity.isEnabled(),
                entity.getCreatedAt());
    }
}
