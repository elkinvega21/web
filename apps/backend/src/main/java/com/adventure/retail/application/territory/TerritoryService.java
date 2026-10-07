package com.adventure.retail.application.territory;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.territory.Territory;
import com.adventure.retail.domain.territory.TerritoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TerritoryService {

    private final TerritoryRepository territoryRepository;

    public TerritoryService(TerritoryRepository territoryRepository) {
        this.territoryRepository = territoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Territory> list() {
        return territoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Territory getById(UUID id) {
        return territoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Territorio no encontrado"));
    }

    @Transactional
    public Territory create(TerritoryRequest request) {
        if (territoryRepository.existsByName(request.name().trim())) {
            throw new ConflictException("Ya existe un territorio con ese nombre");
        }
        return territoryRepository.save(Territory.create(request.name().trim(), request.region()));
    }

    @Transactional
    public Territory update(UUID id, TerritoryRequest request) {
        Territory current = getById(id);
        if (!current.getName().equalsIgnoreCase(request.name().trim())
                && territoryRepository.existsByName(request.name().trim())) {
            throw new ConflictException("Ya existe un territorio con ese nombre");
        }
        Territory updated = current.withUpdatedData(
                request.name().trim(),
                request.region(),
                request.active() != null ? request.active() : current.isActive());
        return territoryRepository.save(updated);
    }

    @Transactional
    public void delete(UUID id) {
        getById(id);
        territoryRepository.deleteById(id);
    }
}
