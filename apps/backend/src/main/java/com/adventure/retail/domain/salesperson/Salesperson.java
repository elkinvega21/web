package com.adventure.retail.domain.salesperson;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Salesperson {

    private final UUID id;
    private final String code;
    private final String name;
    private final String email;
    private final String phone;
    private final UUID territoryId;
    private final String status;
    private final BigDecimal salesTotal;
    private final BigDecimal salesMonth;
    private final BigDecimal commissionRate;
    private final BigDecimal monthlyGoal;
    private final Instant createdAt;

    public Salesperson(UUID id, String code, String name, String email, String phone, UUID territoryId,
                       String status, BigDecimal salesTotal, BigDecimal salesMonth,
                       BigDecimal commissionRate, BigDecimal monthlyGoal, Instant createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.territoryId = territoryId;
        this.status = status;
        this.salesTotal = salesTotal;
        this.salesMonth = salesMonth;
        this.commissionRate = commissionRate;
        this.monthlyGoal = monthlyGoal == null ? BigDecimal.ZERO : monthlyGoal;
        this.createdAt = createdAt;
    }

    public static Salesperson create(String code, String name, String email, String phone,
                                     UUID territoryId, BigDecimal commissionRate, BigDecimal monthlyGoal,
                                     String status) {
        return new Salesperson(UUID.randomUUID(), code, name, email, phone, territoryId,
                status, BigDecimal.ZERO, BigDecimal.ZERO, commissionRate, monthlyGoal, Instant.now());
    }

    public Salesperson withUpdatedData(String name, String email, String phone, UUID territoryId,
                                       String status, BigDecimal commissionRate, BigDecimal monthlyGoal) {
        return new Salesperson(this.id, this.code, name, email, phone, territoryId, status,
                this.salesTotal, this.salesMonth, commissionRate, monthlyGoal, this.createdAt);
    }

    public Salesperson addSales(BigDecimal amount) {
        return new Salesperson(this.id, this.code, this.name, this.email, this.phone, this.territoryId,
                this.status, this.salesTotal.add(amount), this.salesMonth.add(amount),
                this.commissionRate, this.monthlyGoal, this.createdAt);
    }

    /** Porcentaje de la meta mensual alcanzado. 0 si no hay meta definida. */
    public int goalCompletion() {
        if (monthlyGoal.signum() <= 0) {
            return 0;
        }
        return salesMonth.multiply(BigDecimal.valueOf(100))
                .divide(monthlyGoal, 0, java.math.RoundingMode.HALF_UP)
                .intValue();
    }

    public UUID getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public UUID getTerritoryId() {
        return territoryId;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getSalesTotal() {
        return salesTotal;
    }

    public BigDecimal getSalesMonth() {
        return salesMonth;
    }

    public BigDecimal getCommissionRate() {
        return commissionRate;
    }

    public BigDecimal getMonthlyGoal() {
        return monthlyGoal;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
