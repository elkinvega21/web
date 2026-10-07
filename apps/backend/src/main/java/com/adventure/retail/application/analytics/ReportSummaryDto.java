package com.adventure.retail.application.analytics;

import java.math.BigDecimal;

/** Cifras agregadas del informe general. */
public record ReportSummaryDto(
        BigDecimal totalSales,
        BigDecimal monthSales,
        BigDecimal previousPeriodSales,
        BigDecimal growth,
        long totalOrders,
        long pendingOrders,
        long deliveredOrders,
        long confirmedOrders,
        long cancelledOrders,
        long totalCustomers,
        long activeCustomers,
        long totalProducts,
        long activeProducts,
        long lowStock,
        BigDecimal inventoryValue,
        long totalSalespersons,
        long activeSalespersons,
        BigDecimal totalCommissions,
        BigDecimal averageTicket) {
}
