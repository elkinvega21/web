package com.adventure.retail.application.customer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CustomerServiceTest {

    private CustomerRepository customerRepository;
    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerRepository = mock(CustomerRepository.class);
        customerService = new CustomerService(customerRepository);
    }

    @Test
    void createShouldGenerateSequentialCode() {
        when(customerRepository.existsByDocumentNumber("1015392847")).thenReturn(false);
        when(customerRepository.count()).thenReturn(4L);
        when(customerRepository.save(any(Customer.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Customer created = customerService.create(new CustomerRequest(
                null, "Ana López", "CC", "1015392847", "ana@example.com",
                "3001112233", "Calle 1", null, "Activo"));

        assertThat(created.getCode()).isEqualTo("CLI-0005");
        verify(customerRepository).save(created);
    }

    @Test
    void createShouldRejectDuplicateDocument() {
        when(customerRepository.existsByDocumentNumber("1015392847")).thenReturn(true);

        assertThatThrownBy(() -> customerService.create(new CustomerRequest(
                null, "Ana López", "CC", "1015392847", null, null, null, null, null)))
                .isInstanceOf(ConflictException.class);

        verify(customerRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void updateShouldThrowWhenCustomerDoesNotExist() {
        UUID id = UUID.randomUUID();
        when(customerRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.update(id, new CustomerRequest(
                null, "Ana", "CC", "101", null, null, null, null, null)))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void updateShouldKeepCodeAndHistory() {
        UUID id = UUID.randomUUID();
        Customer existing = Customer.create("CLI-0001", "Juan Rojas", "CC", "101",
                null, null, null, null, "Activo");
        when(customerRepository.findById(id)).thenReturn(Optional.of(existing));
        when(customerRepository.existsByDocumentNumber("102")).thenReturn(false);
        when(customerRepository.save(any(Customer.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Customer updated = customerService.update(id, new CustomerRequest(
                null, "Juan Pablo Rojas", "CC", "102", "juan@example.com", null, null, null, "Inactivo"));

        assertThat(updated.getCode()).isEqualTo("CLI-0001");
        assertThat(updated.getName()).isEqualTo("Juan Pablo Rojas");
        assertThat(updated.getDocumentNumber()).isEqualTo("102");
        assertThat(updated.getStatus()).isEqualTo("Inactivo");
    }
}
