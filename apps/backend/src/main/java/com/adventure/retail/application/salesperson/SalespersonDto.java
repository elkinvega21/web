package com.adventure.retail.application.salesperson;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SalespersonDto(
        UUID id,
        String code,
        String name,
        String email,
        String phone,
        UUID territoryId,
        String status,
        BigDecimal salesTotal,
        BigDecimal salesMonth,
        BigDecimal commissionRate,
        BigDecimal monthlyGoal,
        int goalCompletion,
        Instant createdAt) {
}
