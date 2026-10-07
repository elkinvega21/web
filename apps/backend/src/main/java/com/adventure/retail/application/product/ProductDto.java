package com.adventure.retail.application.product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductDto(
        UUID id,
        String sku,
        String name,
        String category,
        String description,
        String unit,
        BigDecimal price,
        BigDecimal cost,
        int stock,
        int stockMin,
        String status,
        boolean lowStock,
        Instant createdAt) {
}