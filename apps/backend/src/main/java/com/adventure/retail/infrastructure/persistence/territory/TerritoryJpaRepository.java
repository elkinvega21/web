package com.adventure.retail.infrastructure.persistence.territory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TerritoryJpaRepository extends JpaRepository<TerritoryJpaEntity, UUID> {

    List<TerritoryJpaEntity> findByActiveTrueOrderByNameAsc();

    boolean existsByName(String name);
}
