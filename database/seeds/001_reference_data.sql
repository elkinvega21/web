-- ============================================================
-- Adventure Retail ERP — Datos de referencia iniciales (SIC-00)
-- ============================================================

-- Territorios de venta
INSERT INTO territories (name, region) VALUES
    ('Bogotá',             'Centro'),
    ('Medellín',           'Antioquia'),
    ('Cali',               'Pacífico'),
    ('Costa Caribe',       'Caribe'),
    ('Santanderes',        'Oriente'),
    ('Eje Cafetero',       'Andina'),
    ('Amazonía y Orinoquía','Orinoquía');

-- Productos de referencia
INSERT INTO products (sku, name, category, price, cost, stock, stock_min) VALUES
    ('ADV-SAC-001', 'Saco de montaña ADV',          'Ropa',      120.00, 78.00, 120, 20),
    ('ADV-IMP-002', 'Impermeable térmico',          'Ropa',       95.00, 60.00,  90, 15),
    ('ADV-COD-003', 'Cuerda dinámica 9.8mm',        'Equipo',     68.50, 41.00,  60, 10),
    ('ADV-MOS-004', 'Mosquetón auto-bloqueo',       'Equipo',     32.90, 18.00, 200, 30),
    ('ADV-CAR-005', 'Carpa 3 estaciones 2 personas','Camping',   210.00, 132.00,  40,  8),
    ('ADV-DOR-006', 'Dormitorio térmico -10°C',     'Camping',    89.00, 54.00,  75, 12),
    ('ADV-LIN-007', 'Linterna recargable 1000lm',   'Accesorios',  39.90, 22.00, 140, 25),
    ('ADV-BOT-008', 'Botella aislante 1L',          'Accesorios',  24.90, 13.00, 300, 40),
    ('ADV-CAM-009', 'Camiseta técnica algodón',     'Ropa',       29.90, 16.00, 250, 50),
    ('ADV-BOT-010', 'Bota trekking impermeable',    'Calzado',   139.00, 85.00,  55, 10);

-- Clientes de referencia
INSERT INTO customers (code, name, document_type, document_number, email, phone, territory_id, status) VALUES
    ('CLI-0001', 'Juan Pablo Rojas',    'CC', '1015392847', 'juan.rojas@gmail.com',        '3105550101', (SELECT id FROM territories WHERE name='Bogotá'),    'Activo'),
    ('CLI-0002', 'María Fernanda Gil',  'CC', '52948311',   'maria.gil@outlook.com',       '3205550202', (SELECT id FROM territories WHERE name='Medellín'),  'Activo'),
    ('CLI-0003', 'Andrés Felipe Torres','CC', '1032441987', 'andres.torres@yahoo.com',     '3115550303', (SELECT id FROM territories WHERE name='Cali'),      'Activo'),
    ('CLI-0004', 'Laura Camila Ortiz',  'CC', '1013567421', 'laura.ortiz@gmail.com',       '3005550404', (SELECT id FROM territories WHERE name='Costa Caribe'), 'Activo'),
    ('CLI-0005', 'Miguel Ángel Castro', 'NIT', '901234567',  'contacto@castroexp.com',     '3155550505', (SELECT id FROM territories WHERE name='Bogotá'),    'Activo');

-- Vendedores de referencia
INSERT INTO salespersons (code, name, email, phone, territory_id, commission_rate) VALUES
    ('VEN-001', 'Sofía Restrepo',   'sofia.restrepo@adventure.com', '3125551010', (SELECT id FROM territories WHERE name='Bogotá'),      0.0500),
    ('VEN-002', 'Carlos Mendoza',   'carlos.mendoza@adventure.com', '3135552020', (SELECT id FROM territories WHERE name='Medellín'),    0.0450),
    ('VEN-003', 'Valentina Parra',  'valentina.parra@adventure.com','3145553030', (SELECT id FROM territories WHERE name='Cali'),        0.0500);
