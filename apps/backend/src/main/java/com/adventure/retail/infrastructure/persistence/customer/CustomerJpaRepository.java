package com.adventure.retail.infrastructure.persistence.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CustomerJpaRepository extends JpaRepository<CustomerJpaEntity, UUID> {

    @Query("""
            SELECT c FROM CustomerJpaEntity c
            WHERE (CAST(:query AS string) IS NULL
                   OR LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                   OR LOWER(c.code) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                   OR LOWER(c.documentNumber) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')))
              AND (CAST(:status AS string) IS NULL OR c.status = :status)
            ORDER BY c.name
            """)
    List<CustomerJpaEntity> search(@Param("query") String query, @Param("status") String status);

    boolean existsByCode(String code);

    boolean existsByDocumentNumber(String documentNumber);
}
