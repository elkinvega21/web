package com.adventure.retail.application.territory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TerritoryRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
        String name,

        @Size(max = 100, message = "La región no puede superar 100 caracteres")
        String region,

        Boolean active) {
}
