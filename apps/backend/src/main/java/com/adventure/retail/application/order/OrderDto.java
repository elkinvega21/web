package com.adventure.retail.application.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderDto(
        UUID id,
        String number,
        UUID customerId,
        String customerName,
        UUID salespersonId,
        String salespersonName,
        String status,
        BigDecimal total,
        List<OrderItemDto> items,
        Instant createdAt) {
}
