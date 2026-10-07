package com.adventure.retail.application.order;

import jakarta.validation.constraints.NotBlank;

public record StatusUpdateRequest(
        @NotBlank(message = "El estado es obligatorio")
        String status) {
}
