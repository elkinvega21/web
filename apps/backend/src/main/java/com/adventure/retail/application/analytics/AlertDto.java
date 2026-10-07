package com.adventure.retail.application.analytics;

/** Alerta operativa derivada del estado real de los datos. */
public record AlertDto(
        String id,
        String title,
        String detail,
        String level) {

    public static final String LEVEL_CRITICAL = "critical";
    public static final String LEVEL_WARNING = "warning";
    public static final String LEVEL_INFO = "info";
}
