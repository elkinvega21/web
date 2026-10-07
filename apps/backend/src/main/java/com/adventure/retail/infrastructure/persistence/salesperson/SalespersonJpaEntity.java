package com.adventure.retail.infrastructure.persistence.salesperson;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "salespersons")
public class SalespersonJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String email;

    private String phone;

    @Column(name = "territory_id")
    private UUID territoryId;

    @Column(nullable = false)
    private String status;

    @Column(name = "sales_total", nullable = false)
    private BigDecimal salesTotal;

    @Column(name = "sales_month", nullable = false)
    private BigDecimal salesMonth;

    @Column(name = "commission_rate", nullable = false)
    private BigDecimal commissionRate;

    @Column(name = "monthly_goal", nullable = false)
    private BigDecimal monthlyGoal;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected SalespersonJpaEntity() {
    }

    public SalespersonJpaEntity(UUID id, String code, String name, String email, String phone, UUID territoryId,
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
        this.monthlyGoal = monthlyGoal;
        this.createdAt = createdAt;
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
