package com.adventure.retail.infrastructure.persistence.salesperson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SalespersonJpaRepository extends JpaRepository<SalespersonJpaEntity, UUID> {

    @Query("""
            SELECT s FROM SalespersonJpaEntity s
            WHERE (CAST(:query AS string) IS NULL
                   OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                   OR LOWER(s.code) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))
              AND (CAST(:status AS string) IS NULL OR s.status = :status)
            ORDER BY s.name
            """)
    List<SalespersonJpaEntity> search(@Param("query") String query, @Param("status") String status);

    boolean existsByCode(String code);
}
