package com.adventure.retail.application.analytics;

import java.math.BigDecimal;

/**
 * Punto de una serie temporal. {@code comparison} es la serie de contraste
 * (meta o periodo anterior) y puede ser nulo.
 */
public record SeriesPointDto(
        String label,
        BigDecimal value,
        BigDecimal comparison) {
}
