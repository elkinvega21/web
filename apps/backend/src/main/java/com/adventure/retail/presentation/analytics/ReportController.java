package com.adventure.retail.presentation.analytics;

import com.adventure.retail.application.analytics.AnalyticsService;
import com.adventure.retail.application.analytics.ReportDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final AnalyticsService analyticsService;

    public ReportController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ReportDto report() {
        return analyticsService.report();
    }
}
