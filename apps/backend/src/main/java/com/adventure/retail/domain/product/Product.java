package com.adventure.retail.domain.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Product {

    private final UUID id;
    private final String sku;
    private final String name;
    private final String category;
    private final String description;
    private final String unit;
    private final BigDecimal price;
    private final BigDecimal cost;
    private final int stock;
    private final int stockMin;
    private final String status;
    private final Instant createdAt;

    public Product(UUID id, String sku, String name, String category, String description, String unit,
                   BigDecimal price, BigDecimal cost, int stock, int stockMin, String status, Instant createdAt) {
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

    public static Product create(String sku, String name, String category, String description, String unit,
                                 BigDecimal price, BigDecimal cost, int stock, int stockMin, String status) {
        return new Product(UUID.randomUUID(), sku, name, category, description, unit, price, cost, stock, stockMin, status, Instant.now());
    }

    public Product withUpdatedData(String name, String category, String description, String unit,
                                   BigDecimal price, BigDecimal cost, int stock, int stockMin, String status) {
        return new Product(this.id, this.sku, name, category, description, unit, price, cost, stock, stockMin, status, this.createdAt);
    }

    public Product withStock(int newStock) {
        return new Product(this.id, this.sku, this.name, this.category, this.description, this.unit,
                this.price, this.cost, newStock, this.stockMin, this.status, this.createdAt);
    }

    public boolean isLowStock() {
        return stock <= stockMin;
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