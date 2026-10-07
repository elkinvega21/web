package com.adventure.retail.infrastructure.persistence.territory;

import com.adventure.retail.domain.territory.Territory;
import com.adventure.retail.domain.territory.TerritoryRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class TerritoryRepositoryAdapter implements TerritoryRepository {

    private final TerritoryJpaRepository jpaRepository;

    public TerritoryRepositoryAdapter(TerritoryJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Territory> findAllActive() {
        return jpaRepository.findByActiveTrueOrderByNameAsc().stream().map(this::toDomain).toList();
    }

    @Override
    public List<Territory> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Territory> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name);
    }

    @Override
    public Territory save(Territory territory) {
        return toDomain(jpaRepository.save(toEntity(territory)));
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    private Territory toDomain(TerritoryJpaEntity entity) {
        return new Territory(entity.getId(), entity.getName(), entity.getRegion(), entity.isActive());
    }

    private TerritoryJpaEntity toEntity(Territory territory) {
        return new TerritoryJpaEntity(territory.getId(), territory.getName(), territory.getRegion(), territory.isActive());
    }
}
