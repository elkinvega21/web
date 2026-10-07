package com.adventure.retail.infrastructure.persistence.order;

import com.adventure.retail.domain.order.Order;
import com.adventure.retail.domain.order.OrderItem;
import com.adventure.retail.domain.order.OrderRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OrderRepositoryAdapter implements OrderRepository {

    private final OrderJpaRepository jpaRepository;

    public OrderRepositoryAdapter(OrderJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<Order> search(String query, String status) {
        String normalizedQuery = StringUtils.hasText(query) ? query.trim() : null;
        String normalizedStatus = StringUtils.hasText(status) ? status.trim() : null;
        return jpaRepository.search(normalizedQuery, normalizedStatus).stream().map(this::toDomain).toList();
    }

    @Override
    public List<Order> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }

    @Override
    public Order save(Order order) {
        OrderJpaEntity entity = toEntity(order);
        OrderJpaEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }

    private Order toDomain(OrderJpaEntity entity) {
        List<OrderItem> items = entity.getItems().stream()
                .map(item -> new OrderItem(item.getProductId(), item.getProductName(),
                        item.getQuantity(), item.getUnitPrice()))
                .toList();
        return new Order(entity.getId(), entity.getNumber(), entity.getCustomerId(),
                entity.getSalespersonId(), entity.getStatus(), entity.getTotal(), items, entity.getCreatedAt());
    }

    private OrderJpaEntity toEntity(Order order) {
        List<OrderItemJpaEntity> itemEntities = new ArrayList<>();
        OrderJpaEntity orderEntity = new OrderJpaEntity(order.getId(), order.getNumber(),
                order.getCustomerId(), order.getSalespersonId(), order.getStatus(),
                order.getTotal(), order.getCreatedAt(), itemEntities);
        for (OrderItem item : order.getItems()) {
            itemEntities.add(new OrderItemJpaEntity(UUID.randomUUID(), orderEntity,
                    item.getProductId(), item.getProductName(), item.getQuantity(),
                    item.getUnitPrice(), item.getSubtotal()));
        }
        return orderEntity;
    }
}
