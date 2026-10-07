package com.adventure.retail.infrastructure.persistence.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class OrderJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String number;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "salesperson_id")
    private UUID salespersonId;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemJpaEntity> items = new ArrayList<>();

    protected OrderJpaEntity() {
    }

    public OrderJpaEntity(UUID id, String number, UUID customerId, UUID salespersonId, String status,
                          BigDecimal total, Instant createdAt, List<OrderItemJpaEntity> items) {
        this.id = id;
        this.number = number;
        this.customerId = customerId;
        this.salespersonId = salespersonId;
        this.status = status;
        this.total = total;
        this.createdAt = createdAt;
        this.items = items;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<OrderItemJpaEntity> getItems() {
        return items;
    }
}
