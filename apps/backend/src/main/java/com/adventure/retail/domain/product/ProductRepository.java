package com.adventure.retail.domain.product;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository {

    List<Product> search(String query, String category, String status);

    List<Product> findAll();

    List<Product> findByIds(Collection<UUID> ids);

    Optional<Product> findById(UUID id);

    boolean existsBySku(String sku);

    long count();

    Product save(Product product);

    void deleteById(UUID id);
}
