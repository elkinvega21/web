package com.adventure.retail.infrastructure.persistence.promotion;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "promotions")
public class PromotionJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private BigDecimal value;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean active;

    @Column(columnDefinition = "text")
    private String conditions;

    @Column(name = "minimum_amount", nullable = false)
    private BigDecimal minimumAmount;

    @ElementCollection
    @CollectionTable(name = "promotion_products", joinColumns = @JoinColumn(name = "promotion_id"))
    @Column(name = "product_id")
    private List<UUID> productIds = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected PromotionJpaEntity() {
    }

    public PromotionJpaEntity(UUID id, String name, String description, String type, BigDecimal value,
                              LocalDate startDate, LocalDate endDate, boolean active, String conditions,
                              BigDecimal minimumAmount, List<UUID> productIds, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.value = value;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
        this.conditions = conditions;
        this.minimumAmount = minimumAmount;
        this.productIds = new ArrayList<>(productIds);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isActive() {
        return active;
    }

    public String getConditions() {
        return conditions;
    }

    public BigDecimal getMinimumAmount() {
        return minimumAmount;
    }

    public List<UUID> getProductIds() {
        return productIds;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
