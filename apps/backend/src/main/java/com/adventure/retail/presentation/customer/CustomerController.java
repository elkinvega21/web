package com.adventure.retail.presentation.customer;

import com.adventure.retail.application.customer.CustomerDto;
import com.adventure.retail.application.customer.CustomerRequest;
import com.adventure.retail.application.customer.CustomerService;
import com.adventure.retail.domain.customer.Customer;
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
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerDto> list(@RequestParam(required = false) String q,
                                  @RequestParam(required = false) String status) {
        return customerService.list(q, status).stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public CustomerDto getById(@PathVariable UUID id) {
        return toDto(customerService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerDto create(@Valid @RequestBody CustomerRequest request) {
        return toDto(customerService.create(request));
    }

    @PutMapping("/{id}")
    public CustomerDto update(@PathVariable UUID id, @Valid @RequestBody CustomerRequest request) {
        return toDto(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        customerService.delete(id);
    }

    private CustomerDto toDto(Customer customer) {
        return new CustomerDto(
                customer.getId(),
                customer.getCode(),
                customer.getName(),
                customer.getDocumentType(),
                customer.getDocumentNumber(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                customer.getTerritoryId(),
                customer.getStatus(),
                customer.getTotalPurchased(),
                customer.getCreatedAt());
    }
}
