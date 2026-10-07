#!/bin/bash
# El entrypoint de postgres solo ejecuta los ficheros que estÃ¡n directamente en
# /docker-entrypoint-initdb.d â€” no recorre subcarpetas. Este script se monta ahÃ­
# y aplica migraciones y seeds en orden alfabÃ©tico desde sus respectivos montajes.
set -e

run_all() {
    local dir="$1"
    local label="$2"
    if [ ! -d "$dir" ]; then
        echo "[init] sin $label en $dir, se omite"
        return
    fi
    for file in "$dir"/*.sql; do
        [ -e "$file" ] || continue
        echo "[init] aplicando $label: $(basename "$file")"
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --file "$file"
    done
}

run_all /docker-entrypoint-initdb.d/migrations migraciÃ³n
run_all /docker-entrypoint-initdb.d/seeds seed
