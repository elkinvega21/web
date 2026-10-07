package com.adventure.retail.presentation.territory;

import com.adventure.retail.application.territory.TerritoryDto;
import com.adventure.retail.application.territory.TerritoryRequest;
import com.adventure.retail.application.territory.TerritoryService;
import com.adventure.retail.domain.territory.Territory;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/territories")
public class TerritoryController {

    private final TerritoryService territoryService;

    public TerritoryController(TerritoryService territoryService) {
        this.territoryService = territoryService;
    }

    @GetMapping
    public List<TerritoryDto> list() {
        return territoryService.list().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public TerritoryDto getById(@PathVariable UUID id) {
        return toDto(territoryService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TerritoryDto create(@Valid @RequestBody TerritoryRequest request) {
        return toDto(territoryService.create(request));
    }

    @PutMapping("/{id}")
    public TerritoryDto update(@PathVariable UUID id, @Valid @RequestBody TerritoryRequest request) {
        return toDto(territoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        territoryService.delete(id);
    }

    private TerritoryDto toDto(Territory territory) {
        return new TerritoryDto(territory.getId(), territory.getName(), territory.getRegion(), territory.isActive());
    }
}
