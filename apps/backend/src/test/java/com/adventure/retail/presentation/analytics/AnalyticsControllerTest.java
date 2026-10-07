package com.adventure.retail.presentation.analytics;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.adventure.retail.application.analytics.AlertDto;
import com.adventure.retail.application.analytics.AnalyticsService;
import com.adventure.retail.application.analytics.DailySalesDto;
import com.adventure.retail.application.analytics.DashboardDto;
import com.adventure.retail.application.analytics.KpiDto;
import com.adventure.retail.application.analytics.NamedValueDto;
import com.adventure.retail.application.analytics.ReportDto;
import com.adventure.retail.application.analytics.ReportSummaryDto;
import com.adventure.retail.application.analytics.SeriesPointDto;
import com.adventure.retail.infrastructure.security.JwtAuthenticationFilter;
import com.adventure.retail.infrastructure.security.SecurityConfiguration;
import jakarta.servlet.FilterChain;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest({DashboardController.class, ReportController.class})
@Import(SecurityConfiguration.class)
class AnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnalyticsService analyticsService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @BeforeEach
    void setUpFilter() throws Exception {
        doAnswer(invocation -> {
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(invocation.getArgument(0), invocation.getArgument(1));
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }

    @Test
    @WithMockUser
    void dashboardShouldExposeKpisAndSeries() throws Exception {
        when(analyticsService.dashboard()).thenReturn(new DashboardDto(
                List.of(new KpiDto("sales-day", "Ventas del día", new BigDecimal("1500000"),
                        KpiDto.FORMAT_CURRENCY, new BigDecimal("12.4"), "vs. ayer", "shopping-cart",
                        List.of(BigDecimal.ONE, BigDecimal.TEN))),
                List.of(new SeriesPointDto("Ago", new BigDecimal("2500000"), new BigDecimal("3000000"))),
                List.of(new NamedValueDto("Bogotá", new BigDecimal("1500000"), "60%")),
                List.of(new NamedValueDto("Carpa Summit 4P", new BigDecimal("12"), "12 uds")),
                List.of(NamedValueDto.of("Sofía Restrepo", new BigDecimal("125"))),
                List.of(new AlertDto("low-stock", "Stock crítico", "1 producto está en el mínimo.",
                        AlertDto.LEVEL_CRITICAL)),
                List.of()));

        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kpis[0].key").value("sales-day"))
                .andExpect(jsonPath("$.kpis[0].value").value(1500000))
                .andExpect(jsonPath("$.kpis[0].format").value("currency"))
                .andExpect(jsonPath("$.monthlySales[0].label").value("Ago"))
                .andExpect(jsonPath("$.monthlySales[0].comparison").value(3000000))
                .andExpect(jsonPath("$.salesByTerritory[0].label").value("60%"))
                .andExpect(jsonPath("$.salespersonGoals[0].value").value(125))
                .andExpect(jsonPath("$.alerts[0].level").value("critical"));
    }

    @Test
    @WithMockUser
    void reportShouldExposeSummaryAndDailySales() throws Exception {
        when(analyticsService.report()).thenReturn(new ReportDto(
                new ReportSummaryDto(
                        new BigDecimal("9000000"), new BigDecimal("2500000"), new BigDecimal("2000000"),
                        new BigDecimal("25.0"), 24, 3, 18, 2, 1, 5, 4, 10, 9, 1,
                        new BigDecimal("3240000"), 3, 3, new BigDecimal("450000"), new BigDecimal("375000")),
                List.of(new DailySalesDto(LocalDate.of(2026, 8, 16), "Dom", new BigDecimal("800000"), 2)),
                List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of(), List.of()));

        mockMvc.perform(get("/api/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary.totalSales").value(9000000))
                .andExpect(jsonPath("$.summary.growth").value(25.0))
                .andExpect(jsonPath("$.summary.deliveredOrders").value(18))
                .andExpect(jsonPath("$.dailySales[0].day").value("Dom"))
                .andExpect(jsonPath("$.dailySales[0].date").value("2026-08-16"))
                .andExpect(jsonPath("$.dailySales[0].orders").value(2));
    }

    @Test
    void dashboardShouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isUnauthorized());
    }
}
