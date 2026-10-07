package com.adventure.retail.application.analytics;

import java.math.BigDecimal;
import java.util.List;

/**
 * Indicador del panel. El valor viaja crudo y {@code format} indica cómo debe
 * presentarlo el cliente, para no acoplar el backend a un locale concreto.
 */
public record KpiDto(
        String key,
        String label,
        BigDecimal value,
        String format,
        BigDecimal delta,
        String deltaLabel,
        String icon,
        List<BigDecimal> spark) {

    public static final String FORMAT_CURRENCY = "currency";
    public static final String FORMAT_NUMBER = "number";
}
