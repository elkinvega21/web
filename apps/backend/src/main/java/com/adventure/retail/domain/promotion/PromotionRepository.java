package com.adventure.retail.domain.promotion;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PromotionRepository {

    List<Promotion> findAll();

    Optional<Promotion> findById(UUID id);

    boolean existsByName(String name);

    Promotion save(Promotion promotion);

    void deleteById(UUID id);
}
