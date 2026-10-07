package com.adventure.retail.application.promotion;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PromotionDto(
        UUID id,
        String name,
        String description,
        String type,
        BigDecimal value,
        LocalDate startDate,
        LocalDate endDate,
        String status,
        String conditions,
        BigDecimal minimumAmount,
        List<UUID> productIds,
        List<String> productNames,
        int productCount,
        Instant createdAt,
        Instant updatedAt) {
}
