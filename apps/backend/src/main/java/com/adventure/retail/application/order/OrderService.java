package com.adventure.retail.application.order;

import com.adventure.retail.application.exception.ConflictException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.customer.Customer;
import com.adventure.retail.domain.customer.CustomerRepository;
import com.adventure.retail.domain.order.Order;
import com.adventure.retail.domain.order.OrderItem;
import com.adventure.retail.domain.order.OrderRepository;
import com.adventure.retail.domain.product.Product;
import com.adventure.retail.domain.product.ProductRepository;
import com.adventure.retail.domain.salesperson.Salesperson;
import com.adventure.retail.domain.salesperson.SalespersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of(
            Order.STATUS_PENDING, Order.STATUS_CONFIRMED, Order.STATUS_SHIPPED,
            Order.STATUS_DELIVERED, Order.STATUS_CANCELLED);

    private static final Map<String, Set<String>> ALLOWED_TRANSITIONS = Map.of(
            Order.STATUS_PENDING, Set.of(Order.STATUS_CONFIRMED, Order.STATUS_CANCELLED),
            Order.STATUS_CONFIRMED, Set.of(Order.STATUS_SHIPPED, Order.STATUS_CANCELLED),
            Order.STATUS_SHIPPED, Set.of(Order.STATUS_DELIVERED),
            Order.STATUS_DELIVERED, Set.of(),
            Order.STATUS_CANCELLED, Set.of());

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final SalespersonRepository salespersonRepository;

    public OrderService(OrderRepository orderRepository, CustomerRepository customerRepository,
                        ProductRepository productRepository, SalespersonRepository salespersonRepository) {
        this.orderRepository = orderRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.salespersonRepository = salespersonRepository;
    }

    @Transactional(readOnly = true)
    public List<Order> list(String query, String status) {
        return orderRepository.search(query, status);
    }

    @Transactional(readOnly = true)
    public Order getById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pedido no encontrado"));
    }

    @Transactional
    public Order create(OrderRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new NotFoundException("Cliente no encontrado"));

        Salesperson salesperson = null;
        if (request.salespersonId() != null) {
            salesperson = salespersonRepository.findById(request.salespersonId())
                    .orElseThrow(() -> new NotFoundException("Vendedor no encontrado"));
        }

        Map<UUID, Product> products = loadProducts(request);
        List<OrderItem> items = buildItems(request, products);

        Order order = Order.create(nextNumber(), customer.getId(), request.salespersonId(), items);

        for (OrderItem item : items) {
            Product product = products.get(item.getProductId());
            productRepository.save(product.withStock(product.getStock() - item.getQuantity()));
        }

        customerRepository.save(customer.addTotalPurchased(order.getTotal()));
        if (salesperson != null) {
            salespersonRepository.save(salesperson.addSales(order.getTotal()));
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateStatus(UUID id, String newStatus) {
        Order order = getById(id);
        if (!VALID_STATUSES.contains(newStatus)) {
            throw new ConflictException("Estado de pedido inválido");
        }
        Set<String> allowed = ALLOWED_TRANSITIONS.get(order.getStatus());
        if (allowed == null || !allowed.contains(newStatus)) {
            throw new ConflictException("No se puede pasar el pedido de '" + order.getStatus()
                    + "' a '" + newStatus + "'");
        }

        Order updated = order.withStatus(newStatus);

        if (newStatus.equals(Order.STATUS_CANCELLED) && !order.isCancelled()) {
            restock(order);
        }

        return orderRepository.save(updated);
    }

    @Transactional
    public void delete(UUID id) {
        Order order = getById(id);
        if (!order.isCancelled()) {
            restock(order);
        }
        orderRepository.deleteById(id);
    }

    private List<OrderItem> buildItems(OrderRequest request, Map<UUID, Product> products) {
        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequest item : request.items()) {
            Product product = products.get(item.productId());
            if (product.getStock() < item.quantity()) {
                throw new ConflictException("Stock insuficiente para '" + product.getName() + "'");
            }
            items.add(new OrderItem(product.getId(), product.getName(), item.quantity(), product.getPrice()));
        }
        return items;
    }

    private Map<UUID, Product> loadProducts(OrderRequest request) {
        List<UUID> ids = request.items().stream().map(OrderItemRequest::productId).toList();
        Map<UUID, Product> products = productRepository.findByIds(ids).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        for (UUID id : ids) {
            if (!products.containsKey(id)) {
                throw new NotFoundException("Producto no encontrado");
            }
        }
        return products;
    }

    private void restock(Order order) {
        List<UUID> ids = order.getItems().stream().map(OrderItem::getProductId).toList();
        Map<UUID, Product> products = productRepository.findByIds(ids).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        for (OrderItem item : order.getItems()) {
            Product product = products.get(item.getProductId());
            if (product != null) {
                productRepository.save(product.withStock(product.getStock() + item.getQuantity()));
            }
        }
    }

    private String nextNumber() {
        return String.format(Locale.ROOT, "PED-%04d", orderRepository.count() + 1);
    }
}
