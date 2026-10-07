package com.adventure.retail.application.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CustomerRequest(
        @Size(max = 20, message = "El código no puede superar 20 caracteres")
        String code,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 160, message = "El nombre no puede superar 160 caracteres")
        String name,

        @NotBlank(message = "El tipo de documento es obligatorio")
        @Size(max = 10, message = "Tipo de documento inválido")
        String documentType,

        @NotBlank(message = "El número de documento es obligatorio")
        @Size(max = 30, message = "El número de documento no puede superar 30 caracteres")
        String documentNumber,

        @Email(message = "Formato de correo inválido")
        @Size(max = 255, message = "El correo no puede superar 255 caracteres")
        String email,

        @Size(max = 30, message = "El teléfono no puede superar 30 caracteres")
        String phone,

        @Size(max = 255, message = "La dirección no puede superar 255 caracteres")
        String address,

        UUID territoryId,

        @Size(max = 20, message = "Estado inválido")
        String status) {
}
