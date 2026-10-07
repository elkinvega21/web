package com.adventure.retail.domain.territory;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TerritoryRepository {

    List<Territory> findAllActive();

    List<Territory> findAll();

    Optional<Territory> findById(UUID id);

    boolean existsByName(String name);

    Territory save(Territory territory);

    void deleteById(UUID id);
}
