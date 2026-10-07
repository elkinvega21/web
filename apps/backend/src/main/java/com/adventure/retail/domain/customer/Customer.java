package com.adventure.retail.domain.customer;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Customer {

    private final UUID id;
    private final String code;
    private final String name;
    private final String documentType;
    private final String documentNumber;
    private final String email;
    private final String phone;
    private final String address;
    private final UUID territoryId;
    private final String status;
    private final BigDecimal totalPurchased;
    private final Instant createdAt;

    public Customer(UUID id, String code, String name, String documentType, String documentNumber,
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

    public static Customer create(String code, String name, String documentType, String documentNumber,
                                  String email, String phone, String address, UUID territoryId, String status) {
        return new Customer(UUID.randomUUID(), code, name, documentType, documentNumber,
                email, phone, address, territoryId, status, BigDecimal.ZERO, Instant.now());
    }

    public Customer withUpdatedData(String name, String documentType, String documentNumber,
                                    String email, String phone, String address, UUID territoryId, String status) {
        return new Customer(this.id, this.code, name, documentType, documentNumber,
                email, phone, address, territoryId, status, this.totalPurchased, this.createdAt);
    }

    public Customer addTotalPurchased(BigDecimal amount) {
        BigDecimal updated = this.totalPurchased.add(amount).max(BigDecimal.ZERO);
        return new Customer(this.id, this.code, this.name, this.documentType, this.documentNumber,
                this.email, this.phone, this.address, this.territoryId, this.status, updated, this.createdAt);
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
