package com.adventure.retail.application.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import com.adventure.retail.domain.order.Order;
import com.adventure.retail.domain.order.OrderItem;
import com.adventure.retail.domain.order.OrderRepository;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OrderServiceTest {

    private OrderRepository orderRepository;
    private CustomerRepository customerRepository;
    private ProductRepository productRepository;
    private SalespersonRepository salespersonRepository;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderRepository = mock(OrderRepository.class);
        customerRepository = mock(CustomerRepository.class);
        productRepository = mock(ProductRepository.class);
        salespersonRepository = mock(SalespersonRepository.class);
        orderService = new OrderService(orderRepository, customerRepository, productRepository, salespersonRepository);
    }

    @Test
    void createShouldDecrementStockAndIncreaseCustomerTotal() {
        UUID customerId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        Customer customer = Customer.create("CLI-0001", "Juan Rojas", "CC", "101", null, null, null, null, "Activo");
        Product product = new Product(productId, "ADV-X", "Cuerda 9.8mm", "Equipo", null, "unidad", new BigDecimal("68.50"),
                BigDecimal.ZERO, 10, 2, "Activo", Instant.now());
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(productRepository.findByIds(List.of(productId))).thenReturn(List.of(product));
        when(orderRepository.count()).thenReturn(2L);
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order order = orderService.create(new OrderRequest(customerId, null,
                List.of(new OrderItemRequest(productId, 3))));

        assertThat(order.getNumber()).isEqualTo("PED-0003");
        assertThat(order.getTotal()).isEqualByComparingTo("205.50");
        verify(productRepository).save(any(Product.class));
        verify(customerRepository).save(any(Customer.class));
    }

    @Test
    void createShouldRejectInsufficientStock() {
        UUID customerId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        Customer customer = Customer.create("CLI-0001", "Juan Rojas", "CC", "101", null, null, null, null, "Activo");
        Product product = new Product(productId, "ADV-X", "Cuerda 9.8mm", "Equipo", null, "unidad", new BigDecimal("68.50"),
                BigDecimal.ZERO, 2, 2, "Activo", Instant.now());
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(productRepository.findByIds(List.of(productId))).thenReturn(List.of(product));

        assertThatThrownBy(() -> orderService.create(new OrderRequest(customerId, null,
                List.of(new OrderItemRequest(productId, 5)))))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void statusTransitionShouldFollowAllowedFlow() {
        UUID id = UUID.randomUUID();
        Order pending = Order.create("PED-0001", UUID.randomUUID(), null, List.of());
        when(orderRepository.findById(id)).thenReturn(Optional.of(pending));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order confirmed = orderService.updateStatus(id, Order.STATUS_CONFIRMED);

        assertThat(confirmed.getStatus()).isEqualTo("Confirmado");
        verify(orderRepository).save(confirmed);

        assertThatThrownBy(() -> orderService.updateStatus(id, Order.STATUS_DELIVERED))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    void cancelShouldRestock() {
        UUID id = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        Order pending = Order.create("PED-0001", UUID.randomUUID(), null,
                List.of(new OrderItem(productId, "Cuerda 9.8mm", 2, BigDecimal.ONE)));
        when(orderRepository.findById(id)).thenReturn(Optional.of(pending));
        when(productRepository.findByIds(any())).thenAnswer(invocation -> {
            Collection<UUID> ids = invocation.getArgument(0);
            return ids.stream()
                    .map(pid -> new Product(pid, "ADV-X", "Cuerda", "Equipo", null, "unidad", BigDecimal.ONE,
                            BigDecimal.ZERO, 0, 1, "Activo", Instant.now()))
                    .toList();
        });
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        orderService.updateStatus(id, Order.STATUS_CANCELLED);

        verify(productRepository, times(1)).save(any(Product.class));
    }
}