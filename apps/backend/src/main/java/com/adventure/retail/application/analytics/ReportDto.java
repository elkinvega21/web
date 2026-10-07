package com.adventure.retail.application.analytics;

import java.util.List;

/** Respuesta de {@code GET /api/reports}. */
public record ReportDto(
        ReportSummaryDto summary,
        List<DailySalesDto> dailySales,
        List<SeriesPointDto> monthlySales,
        List<SeriesPointDto> customerGrowth,
        List<NamedValueDto> customersByTerritory,
        List<NamedValueDto> salesByTerritory,
        List<NamedValueDto> topProducts,
        List<NamedValueDto> ordersByStatus,
        List<NamedValueDto> salesBySalesperson,
        List<NamedValueDto> goalCompletion,
        List<NamedValueDto> stockByCategory) {
}
