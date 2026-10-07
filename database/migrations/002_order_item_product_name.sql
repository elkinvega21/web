-- SIC-04: nombre del producto congelado en el ítem del pedido
ALTER TABLE order_items ADD COLUMN product_name VARCHAR(200);

UPDATE order_items oi
SET product_name = p.name
FROM products p
WHERE p.id = oi.product_id;

ALTER TABLE order_items ALTER COLUMN product_name SET NOT NULL;
