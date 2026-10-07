package com.adventure.retail.application.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record OrderRequest(
        @NotNull(message = "El cliente es obligatorio")
        UUID customerId,

        UUID salespersonId,

        @NotEmpty(message = "El pedido debe tener al menos un producto")
        List<@Valid OrderItemRequest> items) {
}
