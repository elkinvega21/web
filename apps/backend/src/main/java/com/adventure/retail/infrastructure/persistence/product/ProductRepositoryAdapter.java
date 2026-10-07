package com.adventure.retail.infrastructure.persistence.product;

import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ProductRepositoryAdapter implements ProductRepository {

    private final ProductJpaRepository jpaRepository;

    public ProductRepositoryAdapter(ProductJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Product> search(String query, String category, String status) {
        String normalizedQuery = StringUtils.hasText(query) ? query.trim() : null;
        String normalizedCategory = StringUtils.hasText(category) ? category.trim() : null;
        String normalizedStatus = StringUtils.hasText(status) ? status.trim() : null;
        return jpaRepository.search(normalizedQuery, normalizedCategory, normalizedStatus)
                .stream().map(this::toDomain).toList();
    }

    @Override
    public List<Product> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public List<Product> findByIds(Collection<UUID> ids) {
        return jpaRepository.findAllById(ids).stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Product> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public boolean existsBySku(String sku) {
        return jpaRepository.existsBySku(sku);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public Product save(Product product) {
        return toDomain(jpaRepository.save(toEntity(product)));
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    private Product toDomain(ProductJpaEntity entity) {
        return new Product(
                entity.getId(),
                entity.getSku(),
                entity.getName(),
                entity.getCategory(),
                entity.getDescription(),
                entity.getUnit(),
                entity.getPrice(),
                entity.getCost(),
                entity.getStock(),
                entity.getStockMin(),
                entity.getStatus(),
                entity.getCreatedAt());
    }

    private ProductJpaEntity toEntity(Product product) {
        return new ProductJpaEntity(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getCategory(),
                product.getDescription(),
                product.getUnit(),
                product.getPrice(),
                product.getCost(),
                product.getStock(),
                product.getStockMin(),
                product.getStatus(),
                product.getCreatedAt());
    }
}