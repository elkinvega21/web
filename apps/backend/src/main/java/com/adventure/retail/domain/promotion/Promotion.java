package com.adventure.retail.domain.promotion;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class Promotion {

    public static final String TYPE_PERCENTAGE = "Porcentaje";
    public static final String TYPE_FIXED_AMOUNT = "Monto fijo";
    public static final String TYPE_2X1 = "2x1";
    public static final String TYPE_COMBO = "Combo";

    public static final String STATUS_ACTIVE = "Activa";
    public static final String STATUS_SCHEDULED = "Programada";
    public static final String STATUS_EXPIRED = "Vencida";
    public static final String STATUS_DISABLED = "Desactivada";

    private final UUID id;
    private final String name;
    private final String description;
    private final String type;
    private final BigDecimal value;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final boolean active;
    private final String conditions;
    private final BigDecimal minimumAmount;
    private final List<UUID> productIds;
    private final Instant createdAt;
    private final Instant updatedAt;

    public Promotion(UUID id, String name, String description, String type, BigDecimal value,
                     LocalDate startDate, LocalDate endDate, boolean active, String conditions,
                     BigDecimal minimumAmount, List<UUID> productIds, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.value = value;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
        this.conditions = conditions;
        this.minimumAmount = minimumAmount;
        this.productIds = Collections.unmodifiableList(new ArrayList<>(productIds));
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Promotion create(String name, String description, String type, BigDecimal value,
                                   LocalDate startDate, LocalDate endDate, String conditions,
                                   BigDecimal minimumAmount, List<UUID> productIds) {
        Instant now = Instant.now();
        return new Promotion(UUID.randomUUID(), name, description, type, value, startDate, endDate,
                true, conditions, minimumAmount, productIds, now, now);
    }

    public Promotion withUpdatedData(String name, String description, String type, BigDecimal value,
                                     LocalDate startDate, LocalDate endDate, boolean active,
                                     String conditions, BigDecimal minimumAmount, List<UUID> productIds) {
        return new Promotion(this.id, name, description, type, value, startDate, endDate, active,
                conditions, minimumAmount, productIds, this.createdAt, Instant.now());
    }

    public Promotion withActive(boolean active) {
        return new Promotion(this.id, this.name, this.description, this.type, this.value,
                this.startDate, this.endDate, active, this.conditions, this.minimumAmount,
                this.productIds, this.createdAt, Instant.now());
    }

    public String getStatus(LocalDate today) {
        if (!active) {
            return STATUS_DISABLED;
        }
        if (today.isBefore(startDate)) {
            return STATUS_SCHEDULED;
        }
        if (today.isAfter(endDate)) {
            return STATUS_EXPIRED;
        }
        return STATUS_ACTIVE;
    }

    public boolean isExpiringSoon(LocalDate today, int days) {
        if (!active) {
            return false;
        }
        LocalDate horizon = today.plusDays(days);
        return !today.isAfter(endDate) && !endDate.isAfter(horizon);
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getValue() {
        return value;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isActive() {
        return active;
    }

    public String getConditions() {
        return conditions;
    }

    public BigDecimal getMinimumAmount() {
        return minimumAmount;
    }

    public List<UUID> getProductIds() {
        return productIds;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
