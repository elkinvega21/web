package com.adventure.retail.domain.order;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository {

    List<Order> search(String query, String status);

    List<Order> findAll();

    Optional<Order> findById(UUID id);

    long count();

    Order save(Order order);

    void deleteById(UUID id);
}
