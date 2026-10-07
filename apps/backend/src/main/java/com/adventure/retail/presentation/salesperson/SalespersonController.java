package com.adventure.retail.presentation.salesperson;

import com.adventure.retail.application.salesperson.SalespersonDto;
import com.adventure.retail.application.salesperson.SalespersonRequest;
import com.adventure.retail.application.salesperson.SalespersonService;
import com.adventure.retail.domain.salesperson.Salesperson;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salespersons")
public class SalespersonController {

    private final SalespersonService salespersonService;

    public SalespersonController(SalespersonService salespersonService) {
        this.salespersonService = salespersonService;
    }

    @GetMapping
    public List<SalespersonDto> list(@RequestParam(required = false) String q,
                                     @RequestParam(required = false) String status) {
        return salespersonService.list(q, status).stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public SalespersonDto getById(@PathVariable UUID id) {
        return toDto(salespersonService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SalespersonDto create(@Valid @RequestBody SalespersonRequest request) {
        return toDto(salespersonService.create(request));
    }

    @PutMapping("/{id}")
    public SalespersonDto update(@PathVariable UUID id, @Valid @RequestBody SalespersonRequest request) {
        return toDto(salespersonService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        salespersonService.delete(id);
    }

    private SalespersonDto toDto(Salesperson salesperson) {
        return new SalespersonDto(
                salesperson.getId(),
                salesperson.getCode(),
                salesperson.getName(),
                salesperson.getEmail(),
                salesperson.getPhone(),
                salesperson.getTerritoryId(),
                salesperson.getStatus(),
                salesperson.getSalesTotal(),
                salesperson.getSalesMonth(),
                salesperson.getCommissionRate(),
                salesperson.getMonthlyGoal(),
                salesperson.goalCompletion(),
                salesperson.getCreatedAt());
    }
}
