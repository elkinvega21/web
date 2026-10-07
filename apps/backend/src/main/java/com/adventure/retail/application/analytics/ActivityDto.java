package com.adventure.retail.application.analytics;

import java.time.Instant;

/**
 * Entrada del feed de actividad. Se deriva de los pedidos recientes: no existe
 * bitácora de auditoría en el modelo, así que este es el único hecho registrado
 * con marca de tiempo del que se puede reconstruir actividad.
 */
public record ActivityDto(
        String id,
        String actor,
        String initials,
        String action,
        String target,
        Instant time,
        String tone) {
}
