package com.adventure.retail.application.territory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.domain.territory.Territory;
import com.adventure.retail.domain.territory.TerritoryRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TerritoryServiceTest {

    private TerritoryRepository territoryRepository;
    private TerritoryService territoryService;

    @BeforeEach
    void setUp() {
        territoryRepository = mock(TerritoryRepository.class);
        territoryService = new TerritoryService(territoryRepository);
    }

    @Test
    void createShouldRejectDuplicateName() {
        when(territoryRepository.existsByName("Bogotá")).thenReturn(true);

        assertThatThrownBy(() -> territoryService.create(new TerritoryRequest("Bogotá", "Centro", true)))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void updateShouldDeactivateTerritory() {
        UUID id = UUID.randomUUID();
        Territory bogota = Territory.create("Bogotá", "Centro");
        when(territoryRepository.findById(id)).thenReturn(Optional.of(bogota));
        when(territoryRepository.save(any(Territory.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Territory updated = territoryService.update(id, new TerritoryRequest("Bogotá", "Centro", false));

        assertThat(updated.isActive()).isFalse();
    }
}
