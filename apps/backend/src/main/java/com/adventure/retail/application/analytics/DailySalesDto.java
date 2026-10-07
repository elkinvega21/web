package com.adventure.retail.application.analytics;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Ventas y número de pedidos de un día concreto. */
public record DailySalesDto(
        LocalDate date,
        String day,
        BigDecimal sales,
        long orders) {
}
