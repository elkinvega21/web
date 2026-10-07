package com.adventure.retail.infrastructure.persistence.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products")
public class ProductJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private BigDecimal cost;

    @Column(nullable = false)
    private int stock;

    @Column(name = "stock_min", nullable = false)
    private int stockMin;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected ProductJpaEntity() {
    }

    public ProductJpaEntity(UUID id, String sku, String name, String category, String description, String unit,
                            BigDecimal price, BigDecimal cost, int stock, int stockMin, String status,
                            Instant createdAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.description = description;
        this.unit = unit;
        this.price = price;
        this.cost = cost;
        this.stock = stock;
        this.stockMin = stockMin;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getUnit() { return unit; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getCost() { return cost; }
    public int getStock() { return stock; }
    public int getStockMin() { return stockMin; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}