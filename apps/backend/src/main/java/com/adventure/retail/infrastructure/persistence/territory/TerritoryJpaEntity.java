package com.adventure.retail.infrastructure.persistence.territory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "territories")
public class TerritoryJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private String region;

    @Column(nullable = false)
    private boolean active;

    protected TerritoryJpaEntity() {
    }

    public TerritoryJpaEntity(UUID id, String name, String region, boolean active) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRegion() {
        return region;
    }

    public boolean isActive() {
        return active;
    }
}
