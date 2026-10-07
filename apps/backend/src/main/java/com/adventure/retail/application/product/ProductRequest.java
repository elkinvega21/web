package com.adventure.retail.application.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "El SKU es obligatorio")
        @Size(max = 50, message = "El SKU no puede superar 50 caracteres")
        String sku,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
        String name,

        @Size(max = 100, message = "La categoría no puede superar 100 caracteres")
        String category,

        @Size(max = 2000, message = "La descripción no puede superar 2000 caracteres")
        String description,

        @Size(max = 20, message = "La unidad no puede superar 20 caracteres")
        String unit,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
        BigDecimal price,

        @DecimalMin(value = "0.00", message = "El costo no puede ser negativo")
        BigDecimal cost,

        Integer stock,

        Integer stockMin,

        @Size(max = 20, message = "Estado inválido")
        String status) {
}