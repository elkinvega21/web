package com.adventure.retail.application.analytics;

import java.math.BigDecimal;

/**
 * Entrada de un ranking o distribución. {@code label} es una anotación
 * opcional que acompaña al valor (porcentaje, unidades, % de meta).
 */
public record NamedValueDto(
        String name,
        BigDecimal value,
        String label) {

    public static NamedValueDto of(String name, BigDecimal value) {
        return new NamedValueDto(name, value, null);
    }
}
