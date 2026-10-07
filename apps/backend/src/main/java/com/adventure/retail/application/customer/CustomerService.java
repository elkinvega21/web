package com.adventure.retail.application.customer;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class CustomerService {

    private static final String DEFAULT_STATUS = "Activo";

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<Customer> list(String query, String status) {
        return customerRepository.search(query, status);
    }

    @Transactional(readOnly = true)
    public Customer getById(UUID id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado"));
    }

    @Transactional
    public Customer create(CustomerRequest request) {
        validateUniqueness(null, request.documentNumber());
        String code = StringUtils.hasText(request.code())
                ? request.code().toUpperCase(Locale.ROOT)
                : nextCode();

        Customer customer = Customer.create(
                code,
                request.name().trim(),
                request.documentType().trim().toUpperCase(Locale.ROOT),
                request.documentNumber().trim(),
                request.email(),
                request.phone(),
                request.address(),
                request.territoryId(),
                StringUtils.hasText(request.status()) ? request.status() : DEFAULT_STATUS);

        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(UUID id, CustomerRequest request) {
        Customer current = getById(id);
        validateUniqueness(id, request.documentNumber());

        Customer updated = current.withUpdatedData(
                request.name().trim(),
                request.documentType().trim().toUpperCase(Locale.ROOT),
                request.documentNumber().trim(),
                request.email(),
                request.phone(),
                request.address(),
                request.territoryId(),
                StringUtils.hasText(request.status()) ? request.status() : current.getStatus());

        return customerRepository.save(updated);
    }

    @Transactional
    public void delete(UUID id) {
        getById(id);
        customerRepository.deleteById(id);
    }

    private String nextCode() {
        return String.format(Locale.ROOT, "CLI-%04d", customerRepository.count() + 1);
    }

    private void validateUniqueness(UUID id, String documentNumber) {
        String doc = documentNumber == null ? "" : documentNumber.trim();
        if (customerRepository.existsByDocumentNumber(doc)) {
            customerRepository.findById(id)
                    .filter(customer -> customer.getDocumentNumber().equals(doc))
                    .orElseThrow(() -> new ConflictException("Ya existe un cliente con ese documento"));
        }
    }
}
