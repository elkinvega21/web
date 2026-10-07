package com.adventure.retail.domain.customer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository {

    List<Customer> search(String query, String status);

    List<Customer> findAll();

    Optional<Customer> findById(UUID id);

    boolean existsByCode(String code);

    boolean existsByDocumentNumber(String documentNumber);

    long count();

    Customer save(Customer customer);

    void deleteById(UUID id);
}
