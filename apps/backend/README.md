# Backend — Adventure Retail ERP

API REST de Spring Boot 3.3 (Java 20) con arquitectura hexagonal
(puertos y adaptadores).

## Módulos

- `domain/` — modelos de negocio y puertos (interfaces de repositorio).
- `application/` — casos de uso (servicios).
- `infrastructure/` — adaptadores JPA, seguridad, configuración.
- `presentation/` — controladores REST y DTOs.

## Ejecutar

```bash
mvn spring-boot:run
```

Requiere PostgreSQL local (ver `docker-compose.yml` en la raíz) o variable
`DB_URL`. El health check queda en `GET /api/health`.
