ALTER TABLE products
    ADD COLUMN description TEXT,
    ADD COLUMN unit VARCHAR(20) NOT NULL DEFAULT 'unidad';