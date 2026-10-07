# Modelo Entidad-Relación (MER) — AdventureWorks

Modelo preliminar del sistema de gestión comercial. El proyecto usa el modelo
AdventureWorks como fuente de datos. Pendiente de refinamiento en los sprints.

## Entidades principales

```text
User ────< Salesperson >──── Territory
              │
Customer >────< Order >────< OrderItem >──── Product
              │                              │
              │                              └────< Promotion
              └──────── >────────────────────┘
```

## Detalle por entidad

### User
- id, email, password_hash, name, roles

### Customer
- id, code, name, document_type, document_number, email, phone, territory_id, status, total_purchased

### Salesperson
- id, code, name, email, phone, territory_id, status, sales_total, sales_month, commission_rate

### Territory
- id, name, region, active

### Product
- id, sku, name, category, price, cost, stock, stock_min, status

### Promotion
- id, name, type, discount_percent, product_id, starts_at, ends_at, active

### Order
- id, number, customer_id, salesperson_id, status (Pendiente/Completado/Facturado), total, created_at

### OrderItem
- id, order_id, product_id, quantity, unit_price, subtotal

## Ubicación de scripts

```text
database/
├── migrations/   # CREATE/ALTER estructurales
├── seeds/        # datos de inicialización y prueba
└── README.md
```
