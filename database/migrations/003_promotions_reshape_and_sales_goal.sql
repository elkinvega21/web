-- ============================================================
-- SIC-06/SIC-07 — Alinea el esquema con el modelo de dominio actual
--
-- 1. `promotions` quedó desfasada respecto a PromotionJpaEntity: la promoción
--    dejó de ser "un producto con % de descuento" y pasó a ser una campaña con
--    vigencia por fechas, condiciones, monto mínimo y varios productos.
-- 2. `salespersons` no tenía meta mensual, sin la cual no se puede calcular
--    cumplimiento en el panel ni en reportes.
-- ============================================================

-- ── Promociones ───────────────────────────────────────────────

ALTER TABLE promotions ADD COLUMN description      TEXT;
ALTER TABLE promotions ADD COLUMN conditions       TEXT;
ALTER TABLE promotions ADD COLUMN minimum_amount   NUMERIC(14, 2) NOT NULL DEFAULT 0;
ALTER TABLE promotions ADD COLUMN start_date       DATE;
ALTER TABLE promotions ADD COLUMN end_date         DATE;

-- El descuento pasa de porcentaje fijo a valor genérico, interpretado según `type`.
ALTER TABLE promotions RENAME COLUMN discount_percent TO value;
ALTER TABLE promotions ALTER COLUMN value TYPE NUMERIC(14, 2);

UPDATE promotions SET start_date = COALESCE(starts_at::date, created_at::date);
UPDATE promotions SET end_date   = COALESCE(ends_at::date, (created_at + interval '30 days')::date);

ALTER TABLE promotions ALTER COLUMN start_date SET NOT NULL;
ALTER TABLE promotions ALTER COLUMN end_date   SET NOT NULL;

-- Relación N:M: una promoción puede cubrir varios productos.
CREATE TABLE promotion_products (
    promotion_id UUID NOT NULL REFERENCES promotions (id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES products (id)
);

INSERT INTO promotion_products (promotion_id, product_id)
SELECT id, product_id FROM promotions WHERE product_id IS NOT NULL;

CREATE INDEX idx_promotion_products_promotion ON promotion_products (promotion_id);

ALTER TABLE promotions DROP COLUMN product_id;
ALTER TABLE promotions DROP COLUMN starts_at;
ALTER TABLE promotions DROP COLUMN ends_at;

-- ── Meta mensual del vendedor ─────────────────────────────────

ALTER TABLE salespersons ADD COLUMN monthly_goal NUMERIC(14, 2) NOT NULL DEFAULT 0;
