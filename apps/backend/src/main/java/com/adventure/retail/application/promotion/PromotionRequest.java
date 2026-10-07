package com.adventure.retail.application.promotion;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PromotionRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 160, message = "El nombre no puede superar 160 caracteres")
        String name,

        @Size(max = 1000, message = "La descripción no puede superar 1000 caracteres")
        String description,

        @NotBlank(message = "El tipo es obligatorio")
        @Size(max = 20, message = "Tipo inválido")
        String type,

        @NotNull(message = "El valor del descuento es obligatorio")
        @DecimalMin(value = "0.01", message = "El descuento debe ser mayor a cero")
        BigDecimal value,

        @NotNull(message = "La fecha de inicio es obligatoria")
        LocalDate startDate,

        @NotNull(message = "La fecha de fin es obligatoria")
        LocalDate endDate,

        Boolean active,

        @Size(max = 1000, message = "Las condiciones no pueden superar 1000 caracteres")
        String conditions,

        @DecimalMin(value = "0.00", message = "El monto mínimo no puede ser negativo")
        BigDecimal minimumAmount,

        List<UUID> productIds) {
}
