package com.adventure.retail.infrastructure.persistence.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface OrderJpaRepository extends JpaRepository<OrderJpaEntity, UUID> {

    @Query("""
            SELECT DISTINCT o FROM OrderJpaEntity o
            WHERE (CAST(:query AS string) IS NULL
                   OR LOWER(o.number) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                   OR o.customerId IN (
                       SELECT c.id FROM CustomerJpaEntity c
                       WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))))
              AND (CAST(:status AS string) IS NULL OR o.status = :status)
            ORDER BY o.createdAt DESC
            """)
    List<OrderJpaEntity> search(@Param("query") String query, @Param("status") String status);
}
