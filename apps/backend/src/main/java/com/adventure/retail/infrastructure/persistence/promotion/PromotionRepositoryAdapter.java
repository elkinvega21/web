package com.adventure.retail.infrastructure.persistence.promotion;

import com.adventure.retail.domain.promotion.Promotion;
import com.adventure.retail.domain.promotion.PromotionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class PromotionRepositoryAdapter implements PromotionRepository {

    private final PromotionJpaRepository jpaRepository;

    public PromotionRepositoryAdapter(PromotionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Promotion> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Promotion> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name);
    }

    @Override
    public Promotion save(Promotion promotion) {
        return toDomain(jpaRepository.save(toEntity(promotion)));
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    private Promotion toDomain(PromotionJpaEntity entity) {
        return new Promotion(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getType(),
                entity.getValue(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.isActive(),
                entity.getConditions(),
                entity.getMinimumAmount(),
                entity.getProductIds(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    private PromotionJpaEntity toEntity(Promotion promotion) {
        return new PromotionJpaEntity(
                promotion.getId(),
                promotion.getName(),
                promotion.getDescription(),
                promotion.getType(),
                promotion.getValue(),
                promotion.getStartDate(),
                promotion.getEndDate(),
                promotion.isActive(),
                promotion.getConditions(),
                promotion.getMinimumAmount(),
                promotion.getProductIds(),
                promotion.getCreatedAt(),
                promotion.getUpdatedAt());
    }
}
