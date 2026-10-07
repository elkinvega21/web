package com.adventure.retail.domain.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class Order {

    public static final String STATUS_PENDING = "Pendiente";
    public static final String STATUS_CONFIRMED = "Confirmado";
    public static final String STATUS_SHIPPED = "Enviado";
    public static final String STATUS_DELIVERED = "Entregado";
    public static final String STATUS_CANCELLED = "Cancelado";

    private final UUID id;
    private final String number;
    private final UUID customerId;
    private final UUID salespersonId;
    private final String status;
    private final BigDecimal total;
    private final List<OrderItem> items;
    private final Instant createdAt;

    public Order(UUID id, String number, UUID customerId, UUID salespersonId, String status,
                 BigDecimal total, List<OrderItem> items, Instant createdAt) {
        this.id = id;
        this.number = number;
        this.customerId = customerId;
        this.salespersonId = salespersonId;
        this.status = status;
        this.total = total;
        this.items = List.copyOf(items);
        this.createdAt = createdAt;
    }

    public static Order create(String number, UUID customerId, UUID salespersonId, List<OrderItem> items) {
        BigDecimal total = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new Order(UUID.randomUUID(), number, customerId, salespersonId, STATUS_PENDING, total, items, Instant.now());
    }

    public Order withStatus(String newStatus) {
        return new Order(this.id, this.number, this.customerId, this.salespersonId, newStatus,
                this.total, this.items, this.createdAt);
    }

    public boolean isCancelled() {
        return STATUS_CANCELLED.equals(status);
    }

    public UUID getId() {
        return id;
    }

    public String getNumber() {
        return number;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public UUID getSalespersonId() {
        return salespersonId;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
