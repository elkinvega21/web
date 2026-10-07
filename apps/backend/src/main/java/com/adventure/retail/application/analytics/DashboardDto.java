package com.adventure.retail.application.analytics;

import java.util.List;

/** Respuesta de {@code GET /api/dashboard}. */
public record DashboardDto(
        List<KpiDto> kpis,
        List<SeriesPointDto> monthlySales,
        List<NamedValueDto> salesByTerritory,
        List<NamedValueDto> topProducts,
        List<NamedValueDto> salespersonGoals,
        List<AlertDto> alerts,
        List<ActivityDto> activity) {
}
