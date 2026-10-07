package com.adventure.retail.infrastructure.persistence.salesperson;

import com.adventure.retail.domain.salesperson.Salesperson;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class SalespersonRepositoryAdapter implements SalespersonRepository {

    private final SalespersonJpaRepository jpaRepository;

    public SalespersonRepositoryAdapter(SalespersonJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Salesperson> search(String query, String status) {
        String normalizedQuery = StringUtils.hasText(query) ? query.trim() : null;
        String normalizedStatus = StringUtils.hasText(status) ? status.trim() : null;
        return jpaRepository.search(normalizedQuery, normalizedStatus).stream().map(this::toDomain).toList();
    }

    @Override
    public List<Salesperson> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Salesperson> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsByCode(String code) {
        return jpaRepository.existsByCode(code);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public Salesperson save(Salesperson salesperson) {
        return toDomain(jpaRepository.save(toEntity(salesperson)));
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    private Salesperson toDomain(SalespersonJpaEntity entity) {
        return new Salesperson(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getTerritoryId(),
                entity.getStatus(),
                entity.getSalesTotal(),
                entity.getSalesMonth(),
                entity.getCommissionRate(),
                entity.getMonthlyGoal(),
                entity.getCreatedAt());
    }

    private SalespersonJpaEntity toEntity(Salesperson salesperson) {
        return new SalespersonJpaEntity(
                salesperson.getId(),
                salesperson.getCode(),
                salesperson.getName(),
                salesperson.getEmail(),
                salesperson.getPhone(),
                salesperson.getTerritoryId(),
                salesperson.getStatus(),
                salesperson.getSalesTotal(),
                salesperson.getSalesMonth(),
                salesperson.getCommissionRate(),
                salesperson.getMonthlyGoal(),
                salesperson.getCreatedAt());
    }
}
