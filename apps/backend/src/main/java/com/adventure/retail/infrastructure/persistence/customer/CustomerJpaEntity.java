package com.adventure.retail.infrastructure.persistence.customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customers")
public class CustomerJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "document_number", nullable = false)
    private String documentNumber;

    private String email;

    private String phone;

    private String address;

    @Column(name = "territory_id")
    private UUID territoryId;

    @Column(nullable = false)
    private String status;

    @Column(name = "total_purchased", nullable = false)
    private BigDecimal totalPurchased;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected CustomerJpaEntity() {
    }

    public CustomerJpaEntity(UUID id, String code, String name, String documentType, String documentNumber,
                             String email, String phone, String address, UUID territoryId, String status,
                             BigDecimal totalPurchased, Instant createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.territoryId = territoryId;
        this.status = status;
        this.totalPurchased = totalPurchased;
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

    public String getDocumentType() {
        return documentType;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public UUID getTerritoryId() {
        return territoryId;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getTotalPurchased() {
        return totalPurchased;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
