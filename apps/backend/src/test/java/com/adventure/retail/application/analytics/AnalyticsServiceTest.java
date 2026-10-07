package com.adventure.retail.application.analytics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import com.adventure.retail.domain.order.Order;
import com.adventure.retail.domain.order.OrderItem;
import com.adventure.retail.domain.order.OrderRepository;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import com.adventure.retail.domain.salesperson.Salesperson;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import com.adventure.retail.domain.territory.Territory;
import com.adventure.retail.domain.territory.TerritoryRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AnalyticsServiceTest {

    private static final ZoneId ZONE = ZoneId.of("America/Bogota");

    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private CustomerRepository customerRepository;
    private SalespersonRepository salespersonRepository;
    private TerritoryRepository territoryRepository;
    private AnalyticsService analyticsService;

    private final UUID andinaId = UUID.randomUUID();
    private final UUID caribeId = UUID.randomUUID();
        private final Product carpa = new Product(UUID.randomUUID(), "SKU-1", "Carpa Summit 4P", "Camping", null, "unidad",
            new BigDecimal("500000"), new BigDecimal("300000"), 10, 4, "Activo", Instant.now());
    private final Product botas = new Product(UUID.randomUUID(), "SKU-2", "Botas Trail Pro", "Calzado", null, "unidad",
            new BigDecimal("200000"), new BigDecimal("120000"), 2, 5, "Activo", Instant.now());
            
    private Customer clienteAndina;
    private Customer clienteCaribe;

    @BeforeEach
    void setUp() {
        orderRepository = mock(OrderRepository.class);
        productRepository = mock(ProductRepository.class);
        customerRepository = mock(CustomerRepository.class);
        salespersonRepository = mock(SalespersonRepository.class);
        territoryRepository = mock(TerritoryRepository.class);

        clienteAndina = new Customer(UUID.randomUUID(), "CLI-001", "Aventura Bogotá", "NIT", "900111",
                null, null, null, andinaId, "Activo", BigDecimal.ZERO, Instant.now());
        clienteCaribe = new Customer(UUID.randomUUID(), "CLI-002", "Outdoor Santa Marta", "NIT", "900222",
                null, null, null, caribeId, "Inactivo", BigDecimal.ZERO, Instant.now());

        when(territoryRepository.findAll()).thenReturn(List.of(
                new Territory(andinaId, "Andina", "Centro", true),
                new Territory(caribeId, "Caribe", "Norte", true)));
        when(productRepository.findAll()).thenReturn(List.of(carpa, botas));
        when(customerRepository.findAll()).thenReturn(List.of(clienteAndina, clienteCaribe));
        when(salespersonRepository.findAll()).thenReturn(List.of());

        analyticsService = new AnalyticsService(orderRepository, productRepository, customerRepository,
                salespersonRepository, territoryRepository, ZONE.getId());
    }

    private Order order(Customer customer, String status, Instant createdAt, OrderItem... items) {
        BigDecimal total = List.of(items).stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new Order(UUID.randomUUID(), "PED-1", customer.getId(), null, status, total,
                List.of(items), createdAt);
    }

    @Test
    void cancelledOrdersShouldNotCountAsSales() {
        Instant now = Instant.now();
        when(orderRepository.findAll()).thenReturn(List.of(
                order(clienteAndina, Order.STATUS_DELIVERED, now,
                        new OrderItem(carpa.getId(), carpa.getName(), 2, new BigDecimal("500000"))),
                order(clienteAndina, Order.STATUS_CANCELLED, now,
                        new OrderItem(carpa.getId(), carpa.getName(), 5, new BigDecimal("500000")))));

        ReportDto report = analyticsService.report();

        assertThat(report.summary().totalSales()).isEqualByComparingTo("1000000");
        assertThat(report.summary().totalOrders()).isEqualTo(2);
        assertThat(report.summary().cancelledOrders()).isEqualTo(1);
        assertThat(report.summary().deliveredOrders()).isEqualTo(1);
    }

    @Test
    void salesShouldBeAttributedToTheTerritoryOfTheCustomer() {
        Instant now = Instant.now();
        when(orderRepository.findAll()).thenReturn(List.of(
                order(clienteAndina, Order.STATUS_DELIVERED, now,
                        new OrderItem(carpa.getId(), carpa.getName(), 3, new BigDecimal("500000"))),
                order(clienteCaribe, Order.STATUS_DELIVERED, now,
                        new OrderItem(botas.getId(), botas.getName(), 5, new BigDecimal("100000")))));

        List<NamedValueDto> byTerritory = analyticsService.report().salesByTerritory();

        assertThat(byTerritory).hasSize(2);
        assertThat(byTerritory.get(0).name()).isEqualTo("Andina");
        assertThat(byTerritory.get(0).value()).isEqualByComparingTo("1500000");
        assertThat(byTerritory.get(0).label()).isEqualTo("75%");
        assertThat(byTerritory.get(1).name()).isEqualTo("Caribe");
        assertThat(byTerritory.get(1).label()).isEqualTo("25%");
    }

    @Test
    void topProductsShouldAggregateUnitsAcrossOrders() {
        Instant now = Instant.now();
        when(orderRepository.findAll()).thenReturn(List.of(
                order(clienteAndina, Order.STATUS_DELIVERED, now,
                        new OrderItem(carpa.getId(), carpa.getName(), 2, new BigDecimal("500000"))),
                order(clienteCaribe, Order.STATUS_DELIVERED, now,
                        new OrderItem(carpa.getId(), carpa.getName(), 3, new BigDecimal("500000")),
                        new OrderItem(botas.getId(), botas.getName(), 1, new BigDecimal("200000")))));

        List<NamedValueDto> top = analyticsService.dashboard().topProducts();

        assertThat(top.get(0).name()).isEqualTo("Carpa Summit 4P");
        assertThat(top.get(0).value()).isEqualByComparingTo("5");
        assertThat(top.get(0).label()).isEqualTo("5 uds");
    }

    @Test
    void summaryShouldReportInventoryAndCustomerCounts() {
        when(orderRepository.findAll()).thenReturn(List.of());

        ReportSummaryDto summary = analyticsService.report().summary();

        // 10 carpas * 300000 + 2 botas * 120000
        assertThat(summary.inventoryValue()).isEqualByComparingTo("3240000");
        assertThat(summary.totalCustomers()).isEqualTo(2);
        assertThat(summary.activeCustomers()).isEqualTo(1);
        assertThat(summary.lowStock()).isEqualTo(1);
        assertThat(summary.averageTicket()).isEqualByComparingTo("0");
    }
}
