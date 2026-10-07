package com.adventure.retail.application.analytics;

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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Calcula los agregados del panel y de reportes a partir de los repositorios de
 * dominio. Las cifras se derivan de los pedidos no cancelados: un pedido
 * cancelado no representa ingreso.
 *
 * <p>El volumen de datos de este ERP permite agregar en memoria; si la operación
 * crece, estos cálculos son los candidatos naturales a bajar a consultas SQL.
 */
@Service
public class AnalyticsService {

    private static final String[] MONTH_LABELS = {
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    };

    private static final String[] DAY_LABELS = {
            "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
    };

    private static final int SPARK_DAYS = 7;
    private static final int DASHBOARD_MONTHS = 12;
    private static final int REPORT_MONTHS = 6;
    private static final int TOP_SIZE = 5;

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SalespersonRepository salespersonRepository;
    private final TerritoryRepository territoryRepository;
    private final ZoneId zone;

    public AnalyticsService(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            CustomerRepository customerRepository,
                            SalespersonRepository salespersonRepository,
                            TerritoryRepository territoryRepository,
                            @Value("${app.reporting.zone:America/Bogota}") String zoneId) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.salespersonRepository = salespersonRepository;
        this.territoryRepository = territoryRepository;
        this.zone = ZoneId.of(zoneId);
    }

    // ── Panel ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public DashboardDto dashboard() {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> orders = allOrders.stream().filter(o -> !o.isCancelled()).toList();
        List<Product> products = productRepository.findAll();
        List<Customer> customers = customerRepository.findAll();
        List<Salesperson> salespersons = salespersonRepository.findAll();
        List<Territory> territories = territoryRepository.findAll();

        return new DashboardDto(
                buildKpis(allOrders, orders, products, customers),
                monthlySeries(orders, salespersons, DASHBOARD_MONTHS),
                salesByTerritory(orders, customers, territories),
                topProductsByUnits(orders),
                salespersonGoals(salespersons),
                buildAlerts(products, allOrders, orders, salespersons),
                recentActivity(orders, salespersons));
    }

    private List<KpiDto> buildKpis(List<Order> allOrders, List<Order> orders,
                                   List<Product> products, List<Customer> customers) {
        LocalDate today = LocalDate.now(zone);
        YearMonth thisMonth = YearMonth.from(today);
        YearMonth lastMonth = thisMonth.minusMonths(1);

        BigDecimal salesToday = sumTotals(orders, o -> dateOf(o).equals(today));
        BigDecimal salesYesterday = sumTotals(orders, o -> dateOf(o).equals(today.minusDays(1)));

        BigDecimal salesThisMonth = sumTotals(orders, inMonth(thisMonth));
        BigDecimal salesLastMonth = sumTotals(orders, inMonth(lastMonth));

        long customersThisMonth = customers.stream().filter(c -> inMonth(thisMonth, c.getCreatedAt())).count();
        long customersLastMonth = customers.stream().filter(c -> inMonth(lastMonth, c.getCreatedAt())).count();

        List<Order> pendingOrders = allOrders.stream()
                .filter(o -> Order.STATUS_PENDING.equals(o.getStatus()))
                .toList();
        long pendingThisWeek = pendingOrders.stream()
                .filter(o -> !dateOf(o).isBefore(today.minusDays(6)))
                .count();
        long pendingLastWeek = pendingOrders.stream()
                .filter(o -> dateOf(o).isBefore(today.minusDays(6)) && !dateOf(o).isBefore(today.minusDays(13)))
                .count();
        long pendingTotal = pendingOrders.size();

        long deliveredThisMonth = orders.stream()
                .filter(o -> Order.STATUS_DELIVERED.equals(o.getStatus()))
                .filter(inMonth(thisMonth))
                .count();
        long deliveredLastMonth = orders.stream()
                .filter(o -> Order.STATUS_DELIVERED.equals(o.getStatus()))
                .filter(inMonth(lastMonth))
                .count();

        Map<UUID, BigDecimal> costByProduct = products.stream()
                .collect(Collectors.toMap(Product::getId, Product::getCost, (a, b) -> a));
        BigDecimal marginThisMonth = grossMargin(orders, costByProduct, inMonth(thisMonth));
        BigDecimal marginLastMonth = grossMargin(orders, costByProduct, inMonth(lastMonth));
        BigDecimal marginRate = salesThisMonth.signum() > 0
                ? marginThisMonth.multiply(BigDecimal.valueOf(100)).divide(salesThisMonth, 0, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<KpiDto> kpis = new ArrayList<>();
        kpis.add(new KpiDto("sales-day", "Ventas del día", salesToday, KpiDto.FORMAT_CURRENCY,
                percentChange(salesToday, salesYesterday), "vs. ayer", "shopping-cart",
                dailySalesSpark(orders, today)));
        kpis.add(new KpiDto("sales-month", "Ventas del mes", salesThisMonth, KpiDto.FORMAT_CURRENCY,
                percentChange(salesThisMonth, salesLastMonth), "vs. mes anterior", "calendar-range",
                dailySalesSpark(orders, today)));
        kpis.add(new KpiDto("new-customers", "Clientes nuevos", BigDecimal.valueOf(customersThisMonth),
                KpiDto.FORMAT_NUMBER,
                percentChange(BigDecimal.valueOf(customersThisMonth), BigDecimal.valueOf(customersLastMonth)),
                "este mes", "user-plus", dailyCustomerSpark(customers, today)));
        kpis.add(new KpiDto("pending-orders", "Pedidos pendientes", BigDecimal.valueOf(pendingTotal),
                KpiDto.FORMAT_NUMBER,
                percentChange(BigDecimal.valueOf(pendingThisWeek), BigDecimal.valueOf(pendingLastWeek)),
                "vs. semana pasada", "clock", dailyOrderCountSpark(orders, today)));
        kpis.add(new KpiDto("completed-orders", "Pedidos completados", BigDecimal.valueOf(deliveredThisMonth),
                KpiDto.FORMAT_NUMBER,
                percentChange(BigDecimal.valueOf(deliveredThisMonth), BigDecimal.valueOf(deliveredLastMonth)),
                "este mes", "circle-check-big", dailyOrderCountSpark(orders, today)));
        kpis.add(new KpiDto("revenue", "Ingresos", marginThisMonth, KpiDto.FORMAT_CURRENCY,
                percentChange(marginThisMonth, marginLastMonth), "margen " + marginRate + "%", "dollar-sign",
                dailySalesSpark(orders, today)));
        return kpis;
    }

    private List<AlertDto> buildAlerts(List<Product> products, List<Order> allOrders,
                                       List<Order> orders, List<Salesperson> salespersons) {
        List<AlertDto> alerts = new ArrayList<>();

        long lowStock = products.stream().filter(Product::isLowStock).count();
        if (lowStock > 0) {
            alerts.add(new AlertDto("low-stock", "Stock crítico",
                    lowStock + (lowStock == 1 ? " producto está" : " productos están") + " en o por debajo del mínimo.",
                    AlertDto.LEVEL_CRITICAL));
        }

        long pending = allOrders.stream().filter(o -> Order.STATUS_PENDING.equals(o.getStatus())).count();
        if (pending > 0) {
            alerts.add(new AlertDto("pending-orders", "Pedidos pendientes",
                    pending + (pending == 1 ? " pedido espera" : " pedidos esperan") + " confirmación.",
                    AlertDto.LEVEL_WARNING));
        }

        BigDecimal goal = salespersons.stream()
                .map(Salesperson::getMonthlyGoal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (goal.signum() > 0) {
            BigDecimal monthSales = sumTotals(orders, inMonth(YearMonth.now(zone)));
            BigDecimal progress = monthSales.multiply(BigDecimal.valueOf(100)).divide(goal, 0, RoundingMode.HALF_UP);
            alerts.add(new AlertDto("monthly-goal", "Meta mensual",
                    "Vas al " + progress + "% de la meta del equipo.", AlertDto.LEVEL_INFO));
        }

        return alerts;
    }

    private List<ActivityDto> recentActivity(List<Order> orders, List<Salesperson> salespersons) {
        Map<UUID, String> salespersonNames = salespersons.stream()
                .collect(Collectors.toMap(Salesperson::getId, Salesperson::getName, (a, b) -> a));

        return orders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(TOP_SIZE)
                .map(order -> {
                    String actor = order.getSalespersonId() != null
                            ? salespersonNames.getOrDefault(order.getSalespersonId(), "Sistema")
                            : "Sistema";
                    String tone = Order.STATUS_DELIVERED.equals(order.getStatus()) ? "success" : "default";
                    return new ActivityDto(
                            order.getId().toString(),
                            actor,
                            initialsOf(actor),
                            "registró el pedido",
                            "#" + order.getNumber(),
                            order.getCreatedAt(),
                            tone);
                })
                .toList();
    }

    // ── Reportes ──────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public ReportDto report() {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> orders = allOrders.stream().filter(o -> !o.isCancelled()).toList();
        List<Product> products = productRepository.findAll();
        List<Customer> customers = customerRepository.findAll();
        List<Salesperson> salespersons = salespersonRepository.findAll();
        List<Territory> territories = territoryRepository.findAll();

        return new ReportDto(
                buildSummary(allOrders, orders, products, customers, salespersons),
                dailySales(orders),
                monthlySeries(orders, salespersons, REPORT_MONTHS),
                customerGrowth(customers),
                customersByTerritory(customers, territories),
                salesByTerritory(orders, customers, territories),
                topProductsByRevenue(orders),
                ordersByStatus(allOrders),
                salesBySalesperson(orders, salespersons),
                salespersonGoals(salespersons),
                stockByCategory(products));
    }

    private ReportSummaryDto buildSummary(List<Order> allOrders,
                                          List<Order> orders,
                                          List<Product> products,
                                          List<Customer> customers,
                                          List<Salesperson> salespersons) {
        YearMonth thisMonth = YearMonth.now(zone);
        YearMonth lastMonth = thisMonth.minusMonths(1);

        BigDecimal totalSales = sumTotals(orders, o -> true);
        BigDecimal monthSales = sumTotals(orders, inMonth(thisMonth));
        BigDecimal previousSales = sumTotals(orders, inMonth(lastMonth));

        BigDecimal inventoryValue = products.stream()
                .map(p -> p.getCost().multiply(BigDecimal.valueOf(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal commissions = salespersons.stream()
                .map(s -> s.getSalesTotal().multiply(s.getCommissionRate()))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        long orderCount = orders.size();
        BigDecimal averageTicket = orderCount > 0
                ? totalSales.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new ReportSummaryDto(
                totalSales,
                monthSales,
                previousSales,
                percentChange(monthSales, previousSales),
                allOrders.size(),
                allOrders.stream().filter(o -> Order.STATUS_PENDING.equals(o.getStatus())).count(),
                allOrders.stream().filter(o -> Order.STATUS_DELIVERED.equals(o.getStatus())).count(),
                allOrders.stream().filter(o -> Order.STATUS_CONFIRMED.equals(o.getStatus())).count(),
                allOrders.stream().filter(Order::isCancelled).count(),
                customers.size(),
                customers.stream().filter(c -> "Activo".equals(c.getStatus())).count(),
                products.size(),
                products.stream().filter(p -> "Activo".equals(p.getStatus())).count(),
                products.stream().filter(Product::isLowStock).count(),
                inventoryValue,
                salespersons.size(),
                salespersons.stream().filter(s -> "Activo".equals(s.getStatus())).count(),
                commissions,
                averageTicket);
    }

    /** Ventas de los últimos siete días, del más antiguo al más reciente. */
    private List<DailySalesDto> dailySales(List<Order> orders) {
        LocalDate today = LocalDate.now(zone);
        List<DailySalesDto> series = new ArrayList<>();
        for (int i = SPARK_DAYS - 1; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            List<Order> ofDay = orders.stream().filter(o -> dateOf(o).equals(day)).toList();
            series.add(new DailySalesDto(
                    day,
                    DAY_LABELS[day.getDayOfWeek().getValue() - 1],
                    ofDay.stream().map(Order::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add),
                    ofDay.size()));
        }
        return series;
    }

    /**
     * Serie mensual de ventas. La comparación es la meta agregada del equipo,
     * que es el único objetivo declarado en el modelo.
     */
    private List<SeriesPointDto> monthlySeries(List<Order> orders, List<Salesperson> salespersons, int months) {
        BigDecimal teamGoal = salespersons.stream()
                .map(Salesperson::getMonthlyGoal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        YearMonth current = YearMonth.now(zone);
        List<SeriesPointDto> series = new ArrayList<>();
        for (int i = months - 1; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            series.add(new SeriesPointDto(
                    MONTH_LABELS[month.getMonthValue() - 1],
                    sumTotals(orders, inMonth(month)),
                    teamGoal.signum() > 0 ? teamGoal : null));
        }
        return series;
    }

    /** Altas de clientes por mes, del más antiguo al más reciente. */
    private List<SeriesPointDto> customerGrowth(List<Customer> customers) {
        YearMonth current = YearMonth.now(zone);
        List<SeriesPointDto> series = new ArrayList<>();
        for (int i = REPORT_MONTHS - 1; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            long count = customers.stream().filter(c -> inMonth(month, c.getCreatedAt())).count();
            series.add(new SeriesPointDto(MONTH_LABELS[month.getMonthValue() - 1], BigDecimal.valueOf(count), null));
        }
        return series;
    }

    private List<NamedValueDto> customersByTerritory(List<Customer> customers, List<Territory> territories) {
        return territories.stream()
                .map(t -> NamedValueDto.of(t.getName(), BigDecimal.valueOf(
                        customers.stream().filter(c -> t.getId().equals(c.getTerritoryId())).count())))
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .toList();
    }

    /** Ventas por territorio, atribuidas por el territorio del cliente. */
    private List<NamedValueDto> salesByTerritory(List<Order> orders, List<Customer> customers,
                                                 List<Territory> territories) {
        Map<UUID, UUID> territoryByCustomer = customers.stream()
                .filter(c -> c.getTerritoryId() != null)
                .collect(Collectors.toMap(Customer::getId, Customer::getTerritoryId, (a, b) -> a));

        Map<UUID, BigDecimal> salesByTerritory = new LinkedHashMap<>();
        for (Order order : orders) {
            UUID territoryId = territoryByCustomer.get(order.getCustomerId());
            if (territoryId != null) {
                salesByTerritory.merge(territoryId, order.getTotal(), BigDecimal::add);
            }
        }

        BigDecimal total = salesByTerritory.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return territories.stream()
                .map(t -> {
                    BigDecimal value = salesByTerritory.getOrDefault(t.getId(), BigDecimal.ZERO);
                    String share = total.signum() > 0
                            ? value.multiply(BigDecimal.valueOf(100)).divide(total, 0, RoundingMode.HALF_UP) + "%"
                            : "0%";
                    return new NamedValueDto(t.getName(), value, share);
                })
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .toList();
    }

    private List<NamedValueDto> topProductsByUnits(List<Order> orders) {
        Map<String, BigDecimal> units = new LinkedHashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                units.merge(item.getProductName(), BigDecimal.valueOf(item.getQuantity()), BigDecimal::add);
            }
        }
        return units.entrySet().stream()
                .map(e -> new NamedValueDto(e.getKey(), e.getValue(), e.getValue().stripTrailingZeros().toPlainString() + " uds"))
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .limit(TOP_SIZE)
                .toList();
    }

    private List<NamedValueDto> topProductsByRevenue(List<Order> orders) {
        Map<String, BigDecimal> revenue = new LinkedHashMap<>();
        Map<String, BigDecimal> units = new LinkedHashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                revenue.merge(item.getProductName(), item.getSubtotal(), BigDecimal::add);
                units.merge(item.getProductName(), BigDecimal.valueOf(item.getQuantity()), BigDecimal::add);
            }
        }
        return revenue.entrySet().stream()
                .map(e -> new NamedValueDto(e.getKey(), e.getValue(),
                        units.get(e.getKey()).stripTrailingZeros().toPlainString() + " uds"))
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .limit(8)
                .toList();
    }

    private List<NamedValueDto> ordersByStatus(List<Order> allOrders) {
        Map<String, Long> counts = allOrders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, LinkedHashMap::new, Collectors.counting()));
        return List.of(Order.STATUS_PENDING, Order.STATUS_CONFIRMED, Order.STATUS_SHIPPED,
                        Order.STATUS_DELIVERED, Order.STATUS_CANCELLED).stream()
                .map(status -> NamedValueDto.of(status, BigDecimal.valueOf(counts.getOrDefault(status, 0L))))
                .toList();
    }

    private List<NamedValueDto> salesBySalesperson(List<Order> orders, List<Salesperson> salespersons) {
        Map<UUID, BigDecimal> sales = new LinkedHashMap<>();
        for (Order order : orders) {
            if (order.getSalespersonId() != null) {
                sales.merge(order.getSalespersonId(), order.getTotal(), BigDecimal::add);
            }
        }
        return salespersons.stream()
                .filter(s -> "Activo".equals(s.getStatus()))
                .map(s -> new NamedValueDto(
                        s.getName(),
                        sales.getOrDefault(s.getId(), BigDecimal.ZERO),
                        s.goalCompletion() + "% meta"))
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .toList();
    }

    private List<NamedValueDto> salespersonGoals(List<Salesperson> salespersons) {
        return salespersons.stream()
                .filter(s -> "Activo".equals(s.getStatus()))
                .map(s -> NamedValueDto.of(s.getName(), BigDecimal.valueOf(s.goalCompletion())))
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .limit(TOP_SIZE)
                .toList();
    }

    private List<NamedValueDto> stockByCategory(List<Product> products) {
        Map<String, Long> stock = products.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(Product::getCategory, LinkedHashMap::new,
                        Collectors.summingLong(Product::getStock)));
        return stock.entrySet().stream()
                .map(e -> NamedValueDto.of(e.getKey(), BigDecimal.valueOf(e.getValue())))
                .sorted(Comparator.comparing(NamedValueDto::value).reversed())
                .toList();
    }

    // ── Utilidades ────────────────────────────────────────────────────────

    private BigDecimal sumTotals(List<Order> orders, Predicate<Order> filter) {
        return orders.stream()
                .filter(filter)
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal grossMargin(List<Order> orders, Map<UUID, BigDecimal> costByProduct, Predicate<Order> filter) {
        BigDecimal margin = BigDecimal.ZERO;
        for (Order order : orders.stream().filter(filter).toList()) {
            for (OrderItem item : order.getItems()) {
                BigDecimal cost = costByProduct.getOrDefault(item.getProductId(), BigDecimal.ZERO)
                        .multiply(BigDecimal.valueOf(item.getQuantity()));
                margin = margin.add(item.getSubtotal().subtract(cost));
            }
        }
        return margin;
    }

    private List<BigDecimal> dailySalesSpark(List<Order> orders, LocalDate today) {
        List<BigDecimal> spark = new ArrayList<>();
        for (int i = SPARK_DAYS - 1; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            spark.add(sumTotals(orders, o -> dateOf(o).equals(day)));
        }
        return spark;
    }

    private List<BigDecimal> dailyOrderCountSpark(List<Order> orders, LocalDate today) {
        List<BigDecimal> spark = new ArrayList<>();
        for (int i = SPARK_DAYS - 1; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            spark.add(BigDecimal.valueOf(orders.stream().filter(o -> dateOf(o).equals(day)).count()));
        }
        return spark;
    }

    private List<BigDecimal> dailyCustomerSpark(List<Customer> customers, LocalDate today) {
        List<BigDecimal> spark = new ArrayList<>();
        for (int i = SPARK_DAYS - 1; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            spark.add(BigDecimal.valueOf(customers.stream()
                    .filter(c -> c.getCreatedAt() != null
                            && c.getCreatedAt().atZone(zone).toLocalDate().equals(day))
                    .count()));
        }
        return spark;
    }

    private LocalDate dateOf(Order order) {
        return order.getCreatedAt().atZone(zone).toLocalDate();
    }

    private Predicate<Order> inMonth(YearMonth month) {
        return order -> YearMonth.from(dateOf(order)).equals(month);
    }

    private boolean inMonth(YearMonth month, Instant instant) {
        return instant != null && YearMonth.from(instant.atZone(zone).toLocalDate()).equals(month);
    }

    /** Variación porcentual con un decimal. Devuelve 0 si no hay base de comparación. */
    private BigDecimal percentChange(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .multiply(BigDecimal.valueOf(100))
                .divide(previous, 1, RoundingMode.HALF_UP);
    }

    private static String initialsOf(String name) {
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        }
        return ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
}
