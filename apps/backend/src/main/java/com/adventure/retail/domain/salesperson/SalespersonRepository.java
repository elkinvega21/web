package com.adventure.retail.domain.salesperson;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SalespersonRepository {

    List<Salesperson> search(String query, String status);

    List<Salesperson> findAll();

    Optional<Salesperson> findById(UUID id);

    boolean existsByCode(String code);

    long count();

    Salesperson save(Salesperson salesperson);

    void deleteById(UUID id);
}
