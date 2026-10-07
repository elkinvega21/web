package com.adventure.retail.infrastructure.persistence.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, UUID> {

    @Query("""
            SELECT p FROM ProductJpaEntity p
            WHERE (CAST(:query AS string) IS NULL
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                   OR LOWER(p.sku) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))
              AND (CAST(:category AS string) IS NULL OR p.category = :category)
              AND (CAST(:status AS string) IS NULL OR p.status = :status)
            ORDER BY p.name
            """)
    List<ProductJpaEntity> search(@Param("query") String query,
                                  @Param("category") String category,
                                  @Param("status") String status);

    boolean existsBySku(String sku);
}
