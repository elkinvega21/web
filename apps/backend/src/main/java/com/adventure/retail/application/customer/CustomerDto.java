package com.adventure.retail.application.customer;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CustomerDto(
        UUID id,
        String code,
        String name,
        String documentType,
        String documentNumber,
        String email,
        String phone,
        String address,
        UUID territoryId,
        String status,
        BigDecimal totalPurchased,
        Instant createdAt) {
}
