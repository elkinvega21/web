# Base de datos — Adventure Retail ERP

PostgreSQL 16. Los scripts están versionados y se aplican en orden.

## Estructura

- `migrations/` — cambios de esquema idempotentes, numerados en orden de aplicación.
- `seeds/` — datos de referencia y de demostración (territorios, productos, clientes, vendedores).

## Local

Con docker-compose (raíz del repo) la base `adventure_retail` se levanta y las
migraciones + seeds se montan en `/docker-entrypoint-initdb.d`, ejecutándose
solo la primera vez que se crea el volumen.

## Convención

- Los archivos deben ser re-ejecutables (los seeds usan `INSERT ... SELECT`
  para resolver los UUID de claves foráneas).
- Una tabla nueva o columna nueva se agrega en un archivo `NNN_descripcion.sql`,
  nunca editando archivos ya aplicados.
