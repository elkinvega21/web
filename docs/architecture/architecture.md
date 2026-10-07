# Arquitectura — Sistema de Gestión Comercial

## Vista general

```text
┌───────────────┐
│    Usuario    │
└───────┬───────┘
        ▼
┌───────────────┐
│   Angular     │   Frontend — feature-based
└───────┬───────┘
        │ HTTP/REST (/api)
        ▼
┌─────────────────────────────────────────────┐
│             Spring Boot                     │
│               Clean Architecture            │
│   ┌──────────────┐                          │
│   │ Presentation │  Controllers + DTOs      │
│   ├──────────────┤                          │
│   │ Application  │  Casos de uso            │
│   ├──────────────┤                          │
│   │   Domain     │  Entidades + Ports       │
│   ├──────────────┤                          │
│   │Infrastructure│  JPA, seguridad, config  │
│   └──────────────┘                          │
└───────┬─────────────────────────────────────┘
        ▼
┌───────────────┐
│  PostgreSQL   │  Neon
└───────────────┘
```

## Responsabilidades

| Capa | Responsabilidad |
|---|---|
| Angular | Interfaz, navegación, formularios, consumo de API |
| Presentation | Recibir HTTP, validar entrada, ejecutar casos de uso, transformar respuesta |
| Application | Casos de uso y orquestación de operaciones |
| Domain | Entidades, reglas y contratos centrales del negocio |
| Infrastructure | Persistencia (JPA/PostgreSQL), seguridad (JWT/Spring Security), configuración |

## Regla de dependencias

```text
Presentation
    │
    ▼
Application
    │
    ▼
Domain
    ▲
    │
Infrastructure
```

El Domain no conoce Spring, JPA, PostgreSQL ni HTTP. Infrastructure implementa
los contratos definidos por el Domain.

## Flujo de una petición (GET /api/customers)

```text
Angular ─▶ CustomerController ─▶ GetCustomersUseCase ─▶ CustomerRepository
                                                          ▲
                                                          │ implements
                                          CustomerRepositoryAdapter
                                                          │
                                                          ▼
                                          CustomerJpaRepository ─▶ PostgreSQL
```

## Módulos funcionales

- Dashboard
- Clientes
- Pedidos
- Productos
- Ofertas / Promociones
- Territorios
- Vendedores
- Reportes

Cada módulo se organiza por funcionalidades tanto en backend como en frontend.
