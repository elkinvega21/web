-- ============================================================
-- Adventure Retail ERP — Movimiento de ventas de prueba
--
-- Sin pedidos no hay nada que graficar: el panel y los reportes derivan todas
-- sus cifras de `orders` / `order_items`. Las fechas son relativas a now() para
-- que las series diarias y mensuales tengan forma sin importar cuándo se siembre.
--
-- Requiere 001_reference_data.sql (territorios, productos, clientes, vendedores).
-- ============================================================

-- ── Pedidos ───────────────────────────────────────────────────

INSERT INTO orders (number, customer_id, salesperson_id, status, created_at)
SELECT v.number, c.id, s.id, v.status, now() - make_interval(days => v.days_ago)
FROM (VALUES
    -- Última semana: alimenta la serie diaria del panel.
    ('PED-00001', 'CLI-0001', 'VEN-001', 'Entregado',  0),
    ('PED-00002', 'CLI-0005', 'VEN-001', 'Confirmado', 0),
    ('PED-00003', 'CLI-0002', 'VEN-002', 'Entregado',  1),
    ('PED-00004', 'CLI-0003', 'VEN-003', 'Pendiente',  1),
    ('PED-00005', 'CLI-0004', 'VEN-001', 'Entregado',  2),
    ('PED-00006', 'CLI-0001', 'VEN-001', 'Enviado',    3),
    ('PED-00007', 'CLI-0002', 'VEN-002', 'Entregado',  3),
    ('PED-00008', 'CLI-0005', 'VEN-002', 'Cancelado',  4),
    ('PED-00009', 'CLI-0003', 'VEN-003', 'Entregado',  5),
    ('PED-00010', 'CLI-0004', 'VEN-003', 'Pendiente',  6),
    -- Resto del mes en curso.
    ('PED-00011', 'CLI-0001', 'VEN-001', 'Entregado',  9),
    ('PED-00012', 'CLI-0002', 'VEN-002', 'Entregado', 12),
    ('PED-00013', 'CLI-0005', 'VEN-001', 'Entregado', 16),
    ('PED-00014', 'CLI-0003', 'VEN-003', 'Entregado', 20),
    -- Meses anteriores: alimentan la serie mensual y el comparativo.
    ('PED-00015', 'CLI-0001', 'VEN-001', 'Entregado', 34),
    ('PED-00016', 'CLI-0004', 'VEN-003', 'Entregado', 41),
    ('PED-00017', 'CLI-0002', 'VEN-002', 'Entregado', 52),
    ('PED-00018', 'CLI-0005', 'VEN-001', 'Cancelado', 58),
    ('PED-00019', 'CLI-0003', 'VEN-003', 'Entregado', 67),
    ('PED-00020', 'CLI-0001', 'VEN-001', 'Entregado', 79),
    ('PED-00021', 'CLI-0002', 'VEN-002', 'Entregado', 94),
    ('PED-00022', 'CLI-0004', 'VEN-003', 'Entregado', 108),
    ('PED-00023', 'CLI-0005', 'VEN-001', 'Entregado', 126),
    ('PED-00024', 'CLI-0003', 'VEN-002', 'Entregado', 141)
) AS v(number, customer_code, salesperson_code, status, days_ago)
JOIN customers    c ON c.code = v.customer_code
JOIN salespersons s ON s.code = v.salesperson_code;

-- ── Líneas de pedido ──────────────────────────────────────────
-- El precio unitario y el nombre se congelan desde el catálogo vigente.

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
SELECT o.id, p.id, p.name, v.quantity, p.price, p.price * v.quantity
FROM (VALUES
    ('PED-00001', 'ADV-CAR-005',  3),
    ('PED-00001', 'ADV-DOR-006',  4),
    ('PED-00002', 'ADV-SAC-001',  6),
    ('PED-00002', 'ADV-CAM-009', 12),
    ('PED-00003', 'ADV-BOT-010',  5),
    ('PED-00003', 'ADV-LIN-007',  8),
    ('PED-00004', 'ADV-MOS-004', 20),
    ('PED-00005', 'ADV-CAR-005',  2),
    ('PED-00005', 'ADV-COD-003',  6),
    ('PED-00006', 'ADV-IMP-002',  7),
    ('PED-00007', 'ADV-BOT-008', 25),
    ('PED-00007', 'ADV-CAM-009', 10),
    ('PED-00008', 'ADV-CAR-005',  4),
    ('PED-00009', 'ADV-BOT-010',  3),
    ('PED-00009', 'ADV-SAC-001',  5),
    ('PED-00010', 'ADV-LIN-007',  6),
    ('PED-00011', 'ADV-DOR-006',  8),
    ('PED-00011', 'ADV-BOT-008', 15),
    ('PED-00012', 'ADV-CAR-005',  5),
    ('PED-00013', 'ADV-IMP-002',  9),
    ('PED-00013', 'ADV-MOS-004', 30),
    ('PED-00014', 'ADV-BOT-010',  4),
    ('PED-00015', 'ADV-CAR-005',  6),
    ('PED-00015', 'ADV-DOR-006',  5),
    ('PED-00016', 'ADV-SAC-001',  8),
    ('PED-00017', 'ADV-BOT-010',  6),
    ('PED-00017', 'ADV-COD-003', 10),
    ('PED-00018', 'ADV-CAM-009', 20),
    ('PED-00019', 'ADV-CAR-005',  4),
    ('PED-00020', 'ADV-IMP-002', 11),
    ('PED-00020', 'ADV-LIN-007', 14),
    ('PED-00021', 'ADV-BOT-008', 40),
    ('PED-00022', 'ADV-DOR-006',  7),
    ('PED-00023', 'ADV-CAR-005',  3),
    ('PED-00023', 'ADV-SAC-001',  9),
    ('PED-00024', 'ADV-BOT-010',  5)
) AS v(order_number, sku, quantity)
JOIN orders   o ON o.number = v.order_number
JOIN products p ON p.sku    = v.sku;

-- El total del pedido es la suma de sus líneas, no un dato independiente.
UPDATE orders o
SET total = COALESCE((SELECT SUM(oi.subtotal) FROM order_items oi WHERE oi.order_id = o.id), 0);

-- ── Acumulados y metas del vendedor ───────────────────────────
-- Los pedidos cancelados no cuentan como venta.

UPDATE salespersons s
SET sales_total = COALESCE((
        SELECT SUM(o.total) FROM orders o
        WHERE o.salesperson_id = s.id AND o.status <> 'Cancelado'), 0),
    sales_month = COALESCE((
        SELECT SUM(o.total) FROM orders o
        WHERE o.salesperson_id = s.id AND o.status <> 'Cancelado'
          AND date_trunc('month', o.created_at) = date_trunc('month', now())), 0);

UPDATE salespersons SET monthly_goal = 6000.00 WHERE code = 'VEN-001';
UPDATE salespersons SET monthly_goal = 5000.00 WHERE code = 'VEN-002';
UPDATE salespersons SET monthly_goal = 4500.00 WHERE code = 'VEN-003';

-- El total comprado del cliente se deriva de sus pedidos.
UPDATE customers c
SET total_purchased = COALESCE((
        SELECT SUM(o.total) FROM orders o
        WHERE o.customer_id = c.id AND o.status <> 'Cancelado'), 0);

-- ── Promociones ───────────────────────────────────────────────

INSERT INTO promotions (name, description, type, value, start_date, end_date, active, conditions, minimum_amount)
VALUES
    ('Temporada alta camping', 'Descuento en carpas y dormitorios para la temporada de fin de año.',
     'Porcentaje', 15.00, (now() - interval '10 days')::date, (now() + interval '20 days')::date, TRUE,
     'Aplica sobre el precio de lista. No acumulable con otras promociones.', 200.00),
    ('Combo montañista', 'Cuerda y mosquetones con precio preferencial.',
     'Monto fijo', 25.00, (now() - interval '5 days')::date, (now() + interval '40 days')::date, TRUE,
     'Debe incluir al menos una cuerda y dos mosquetones.', 150.00),
    ('2x1 en camisetas técnicas', 'Lleva dos camisetas y paga una.',
     '2x1', 0.00, (now() + interval '15 days')::date, (now() + interval '45 days')::date, TRUE,
     'Válido únicamente en tienda física.', 0.00),
    ('Liquidación linternas', 'Descuento de cierre de referencia.',
     'Porcentaje', 30.00, (now() - interval '90 days')::date, (now() - interval '60 days')::date, FALSE,
     'Hasta agotar existencias.', 0.00);

INSERT INTO promotion_products (promotion_id, product_id)
SELECT pr.id, p.id
FROM (VALUES
    ('Temporada alta camping',     'ADV-CAR-005'),
    ('Temporada alta camping',     'ADV-DOR-006'),
    ('Combo montañista',           'ADV-COD-003'),
    ('Combo montañista',           'ADV-MOS-004'),
    ('2x1 en camisetas técnicas',  'ADV-CAM-009'),
    ('Liquidación linternas',      'ADV-LIN-007')
) AS v(promotion_name, sku)
JOIN promotions pr ON pr.name = v.promotion_name
JOIN products   p  ON p.sku   = v.sku;
