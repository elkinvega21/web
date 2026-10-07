package com.adventure.retail.application.territory;

import java.util.UUID;

public record TerritoryDto(
        UUID id,
        String name,
        String region,
        boolean active) {
}
