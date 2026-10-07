package com.adventure.retail.domain.territory;

import java.util.UUID;

public class Territory {

    private final UUID id;
    private final String name;
    private final String region;
    private final boolean active;

    public Territory(UUID id, String name, String region, boolean active) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.active = active;
    }

    public static Territory create(String name, String region) {
        return new Territory(UUID.randomUUID(), name, region, true);
    }

    public Territory withUpdatedData(String name, String region, boolean active) {
        return new Territory(this.id, name, region, active);
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
