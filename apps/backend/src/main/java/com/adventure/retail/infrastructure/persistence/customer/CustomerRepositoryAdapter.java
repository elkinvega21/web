package com.adventure.retail.infrastructure.persistence.customer;

import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CustomerRepositoryAdapter implements CustomerRepository {

    private final CustomerJpaRepository jpaRepository;

    public CustomerRepositoryAdapter(CustomerJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Customer> search(String query, String status) {
        String normalizedQuery = StringUtils.hasText(query) ? query.trim() : null;
        String normalizedStatus = StringUtils.hasText(status) ? status.trim() : null;
        return jpaRepository.search(normalizedQuery, normalizedStatus).stream().map(this::toDomain).toList();
    }

    @Override
    public List<Customer> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Customer> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsByCode(String code) {
        return jpaRepository.existsByCode(code);
    }

    @Override
    public boolean existsByDocumentNumber(String documentNumber) {
        return jpaRepository.existsByDocumentNumber(documentNumber);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public Customer save(Customer customer) {
        return toDomain(jpaRepository.save(toEntity(customer)));
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    private Customer toDomain(CustomerJpaEntity entity) {
        return new Customer(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getDocumentType(),
                entity.getDocumentNumber(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getAddress(),
                entity.getTerritoryId(),
                entity.getStatus(),
                entity.getTotalPurchased(),
                entity.getCreatedAt());
    }

    private CustomerJpaEntity toEntity(Customer customer) {
        return new CustomerJpaEntity(
                customer.getId(),
                customer.getCode(),
                customer.getName(),
                customer.getDocumentType(),
                customer.getDocumentNumber(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getTerritoryId(),
                customer.getStatus(),
                customer.getTotalPurchased(),
                customer.getCreatedAt());
    }
}
