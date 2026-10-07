# Adventure Retail — Sistema de Gestión Comercial

Sistema integral de gestión comercial para la operación de Adventure Retail:
dashboard, clientes, pedidos, productos, ofertas/promociones, territorios,
vendedores y reportes.

| Aspecto | Decisión |
|---|---|
| Arquitectura | Monorepo + Clean Architecture |
| Frontend | Angular + TypeScript (feature-based) |
| Backend | Spring Boot + Java (Clean Architecture) |
| Base de datos | PostgreSQL (Neon) |
| Autenticación | JWT + Spring Security |
| API | REST bajo `/api` |
| Control de versiones | Git + GitHub (GitFlow) |
| Gestión | Jira (historia → SIC-ID → branch → PR → código) |

## Estructura del monorepo

```text
.
├── apps/
│   ├── frontend/          # Angular (core, shared, features)
│   └── backend/           # Spring Boot (domain, application, infrastructure, presentation)
├── database/
│   ├── migrations/        # Cambios estructurales de PostgreSQL
│   ├── seeds/             # Datos de inicialización / prueba
│   └── README.md
├── docs/
│   ├── architecture/      # Decisiones y diagramas
│   ├── database/          # MER del modelo AdventureWorks
│   └── requirements/      # Historias de usuario y criterios de aceptación
├── docker/
│   ├── frontend/
│   └── backend/
├── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Estrategia de ramas (GitFlow)

```text
main
  └── develop
        ├── feature/SIC-01-auth
        ├── feature/SIC-02-customers
        ├── feature/SIC-03-orders
        └── feature/SIC-04-products
```

- `main`: versiones estables.
- `develop`: integración de funcionalidades.
- `feature/*`: una historia de usuario por rama, formato `feature/<ID>-<descripcion>`.

Convención de commits: [Conventional Commits](https://www.conventionalcommits.org/).

## Cómo levantar el proyecto

### Backend

```bash
cp .env.example .env        # completar DB_URL, DB_USERNAME, DB_PASSWORD, JWT_SECRET
cd apps/backend
mvn spring-boot:run
# GET http://localhost:8080/api/health
```

Al arrancar se crea el administrador definido por `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(por defecto `admin@adventureretail.com` / `Admin2025!`), que es la cuenta con la
que entra el frontend.

`CORS_ALLOWED_ORIGINS` debe incluir el origen del frontend (`http://localhost:4200`
en desarrollo) o el navegador bloqueará las llamadas al API.

### Frontend

```bash
cd apps/frontend
npm install
ng serve
# http://localhost:4200
```

Si el backend no responde, el panel y los reportes se quedan con datos de
prueba en lugar de fallar: el prototipo sigue siendo navegable sin API.

### Base de datos

Aplicar en orden `database/migrations/*.sql` y después `database/seeds/*.sql`.
Con Docker lo hace `docker/postgres/init.sh` en el primer arranque del contenedor.

### Docker

```bash
docker compose up --build
```

## Endpoints principales

```text
POST   /api/auth/login
GET    /api/auth/me
GET    /api/health

GET    /api/customers            GET    /api/customers/{id}
POST   /api/customers           PUT    /api/customers/{id}
DELETE /api/customers/{id}

GET    /api/orders               GET    /api/orders/{id}
POST   /api/orders              PATCH  /api/orders/{id}/status
DELETE /api/orders/{id}

GET    /api/products             GET    /api/products/{id}
POST   /api/products            PUT    /api/products/{id}
DELETE /api/products/{id}

GET    /api/salespersons         GET    /api/salespersons/{id}
POST   /api/salespersons        PUT    /api/salespersons/{id}
DELETE /api/salespersons/{id}

GET    /api/territories          GET    /api/territories/{id}
POST   /api/territories         PUT    /api/territories/{id}
DELETE /api/territories/{id}

GET    /api/promotions           GET    /api/promotions/{id}
GET    /api/promotions/expiring PATCH  /api/promotions/{id}/active
POST   /api/promotions          PUT    /api/promotions/{id}
DELETE /api/promotions/{id}

GET    /api/dashboard   # KPIs, series y rankings del panel
GET    /api/reports     # agregados del módulo de reportes
```

Todos los endpoints exigen JWT salvo `/api/auth/login` y `/api/health`.

`/api/dashboard` y `/api/reports` derivan sus cifras de los pedidos no
cancelados; sin datos en `orders` las gráficas salen en cero.

## Regla arquitectónica principal

> **El dominio no depende de la infraestructura. La infraestructura depende de
> las abstracciones definidas por el dominio y la aplicación.**

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
