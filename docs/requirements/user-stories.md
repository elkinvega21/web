# Historias de Usuario

Formato de trazabilidad: `HU-XX Gestionar <módulo>` → `SIC-XX` → `feature/SIC-XX-*`.

| Historia | ID | Sprint | Backlog |
|---|---|---|---|
| HU-01 Iniciar sesión y mantener sesión segura (JWT) | SIC-01 | 2 | Sí |
| HU-02 Gestionar clientes (CRUD) | SIC-02 | 2 | Sí |
| HU-03 Gestionar vendedores | SIC-03 | 2 | Sí |
| HU-04 Gestionar pedidos | SIC-04 | 2 | Sí |
| HU-05 Gestionar productos e inventario | SIC-05 | 3 | Sí |
| HU-06 Gestionar territorios | SIC-06 | 3 | Sí |
| HU-07 Gestionar ofertas y promociones | SIC-07 | 3 | Sí |
| HU-08 Visualizar dashboard con KPIs | SIC-08 | 3 | Sí |
| HU-09 Visualizar reportes de ventas | SIC-09 | 3 | Sí |

## Sprint 1 (técnico)

```text
SIC-00  Monorepo, Angular y Spring Boot configurados
SIC-01  Clean Architecture + Domain/Application/Infrastructure/Presentation
SIC-02  JWT + Spring Security base
SIC-03  Endpoint /api/health
SIC-04  Conexión a PostgreSQL/Neon por variables de entorno
```

> El SDD define que el desarrollo funcional de login, clientes, vendedores y
> pedidos corresponde principalmente al Sprint 2. Las historias de Sprint 2 y 3
> se implementan de forma incremental sobre la arquitectura del Sprint 1.
