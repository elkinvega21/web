package com.adventure.retail.application.salesperson;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record SalespersonRequest(
        @Size(max = 20, message = "El código no puede superar 20 caracteres")
        String code,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 160, message = "El nombre no puede superar 160 caracteres")
        String name,

        @Email(message = "Formato de correo inválido")
        String email,

        @Size(max = 30, message = "El teléfono no puede superar 30 caracteres")
        String phone,

        UUID territoryId,

        @DecimalMin(value = "0.00", message = "La comisión no puede ser negativa")
        @DecimalMax(value = "1.00", message = "La comisión no puede superar 100%")
        BigDecimal commissionRate,

        @DecimalMin(value = "0.00", message = "La meta mensual no puede ser negativa")
        BigDecimal monthlyGoal,

        @Size(max = 20, message = "Estado inválido")
        String status) {
}
