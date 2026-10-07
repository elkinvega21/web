package com.adventure.retail.presentation.order;

import com.adventure.retail.application.order.OrderDto;
import com.adventure.retail.application.order.OrderItemDto;
import com.adventure.retail.application.order.OrderRequest;
import com.adventure.retail.application.order.OrderService;
import com.adventure.retail.application.order.StatusUpdateRequest;
import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import com.adventure.retail.domain.order.Order;
import com.adventure.retail.domain.order.OrderItem;
import com.adventure.retail.domain.salesperson.Salesperson;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final SalespersonRepository salespersonRepository;

    public OrderController(OrderService orderService, CustomerRepository customerRepository,
                           SalespersonRepository salespersonRepository) {
        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.salespersonRepository = salespersonRepository;
    }

    @GetMapping
    public List<OrderDto> list(@RequestParam(required = false) String q,
                               @RequestParam(required = false) String status) {
        return orderService.list(q, status).stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public OrderDto getById(@PathVariable UUID id) {
        return toDto(orderService.getById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@Valid @RequestBody OrderRequest request) {
        return toDto(orderService.create(request));
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusUpdateRequest request) {
        return toDto(orderService.updateStatus(id, request.status()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        orderService.delete(id);
    }

    private OrderDto toDto(Order order) {
        Map<UUID, Customer> customers = customerRepository.findAll().stream()
                .collect(Collectors.toMap(Customer::getId, Function.identity()));
        Customer customer = customers.get(order.getCustomerId());

        Map<UUID, Salesperson> salespersons = salespersonRepository.findAll().stream()
                .collect(Collectors.toMap(Salesperson::getId, Function.identity()));
        Salesperson salesperson = order.getSalespersonId() != null
                ? salespersons.get(order.getSalespersonId())
                : null;

        List<OrderItemDto> items = order.getItems().stream()
                .map(item -> new OrderItemDto(item.getProductId(), item.getProductName(),
                        item.getQuantity(), item.getUnitPrice(), item.getSubtotal()))
                .toList();

        return new OrderDto(
                order.getId(),
                order.getNumber(),
                order.getCustomerId(),
                customer != null ? customer.getName() : "-",
                order.getSalespersonId(),
                salesperson != null ? salesperson.getName() : null,
                order.getStatus(),
                order.getTotal(),
                items,
                order.getCreatedAt());
    }
}
