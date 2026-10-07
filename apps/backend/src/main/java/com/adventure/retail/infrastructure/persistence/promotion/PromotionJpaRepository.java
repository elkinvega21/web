package com.adventure.retail.infrastructure.persistence.promotion;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PromotionJpaRepository extends JpaRepository<PromotionJpaEntity, UUID> {

    boolean existsByName(String name);
}
