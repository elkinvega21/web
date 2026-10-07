-- ============================================================
-- Adventure Retail ERP — Esquema inicial (SIC-00)
-- Motor: PostgreSQL 16
-- ============================================================

CREATE TABLE territories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    region      VARCHAR(100),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(120) NOT NULL,
    roles         VARCHAR(255) NOT NULL DEFAULT 'ROLE_USER',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE customers (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code             VARCHAR(20)  NOT NULL UNIQUE,
    name             VARCHAR(160) NOT NULL,
    document_type    VARCHAR(10)  NOT NULL,
    document_number  VARCHAR(30)  NOT NULL,
    email            VARCHAR(255),
    phone            VARCHAR(30),
    address          VARCHAR(255),
    territory_id     UUID REFERENCES territories (id),
    status           VARCHAR(20)  NOT NULL DEFAULT 'Activo',
    total_purchased  NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE salespersons (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code             VARCHAR(20)  NOT NULL UNIQUE,
    name             VARCHAR(160) NOT NULL,
    email            VARCHAR(255),
    phone            VARCHAR(30),
    territory_id     UUID REFERENCES territories (id),
    status           VARCHAR(20)  NOT NULL DEFAULT 'Activo',
    sales_total      NUMERIC(14, 2) NOT NULL DEFAULT 0,
    sales_month      NUMERIC(14, 2) NOT NULL DEFAULT 0,
    commission_rate  NUMERIC(5, 4) NOT NULL DEFAULT 0.0500,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku         VARCHAR(50)  NOT NULL UNIQUE,
    name        VARCHAR(200) NOT NULL,
    category    VARCHAR(100),
    price       NUMERIC(14, 2) NOT NULL,
    cost        NUMERIC(14, 2) NOT NULL DEFAULT 0,
    stock       INTEGER      NOT NULL DEFAULT 0,
    stock_min   INTEGER      NOT NULL DEFAULT 0,
    status      VARCHAR(20)  NOT NULL DEFAULT 'Activo',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE promotions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(200) NOT NULL,
    type              VARCHAR(50)  NOT NULL,
    discount_percent  NUMERIC(5, 2) NOT NULL DEFAULT 0,
    product_id        UUID REFERENCES products (id),
    starts_at         TIMESTAMPTZ,
    ends_at           TIMESTAMPTZ,
    active            BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number           VARCHAR(30)  NOT NULL UNIQUE,
    customer_id      UUID         NOT NULL REFERENCES customers (id),
    salesperson_id   UUID         REFERENCES salespersons (id),
    status           VARCHAR(20)  NOT NULL DEFAULT 'Pendiente',
    total            NUMERIC(14, 2) NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products (id),
    quantity    INTEGER NOT NULL,
    unit_price  NUMERIC(14, 2) NOT NULL,
    subtotal    NUMERIC(14, 2) NOT NULL
);

CREATE INDEX idx_customers_territory    ON customers (territory_id);
CREATE INDEX idx_customers_status       ON customers (status);
CREATE INDEX idx_orders_customer        ON orders (customer_id);
CREATE INDEX idx_orders_status          ON orders (status);
CREATE INDEX idx_order_items_order      ON order_items (order_id);
CREATE INDEX idx_order_items_product    ON order_items (product_id);
CREATE INDEX idx_products_category      ON products (category);
CREATE INDEX idx_salespersons_territory ON salespersons (territory_id);
