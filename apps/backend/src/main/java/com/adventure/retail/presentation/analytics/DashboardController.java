package com.adventure.retail.presentation.analytics;

import com.adventure.retail.application.analytics.AnalyticsService;
import com.adventure.retail.application.analytics.DashboardDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final AnalyticsService analyticsService;

    public DashboardController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public DashboardDto dashboard() {
        return analyticsService.dashboard();
    }
}
