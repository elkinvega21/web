# Frontend — Adventure Retail ERP

Aplicación Angular 19 (standalone, lazy loading por feature) con diseño
System Design System.

## Estructura

- `src/app/core/` — servicios HTTP, guards, interceptores.
- `src/app/shared/` — componentes, directivas y pipes reutilizables.
- `src/app/features/` — módulos por historia (dashboard, auth, clientes, ...).

## Ejecutar

```bash
npm install
npm start        # http://localhost:4200
npm test
```
