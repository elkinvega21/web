# Criterios de aceptación

## Criterios técnicos del Sprint 1

1. El repositorio Monorepo existe en GitHub.
2. Frontend y Backend pueden ejecutarse independientemente.
3. La estructura Clean Architecture está creada.
4. El Backend puede iniciarse sin credenciales hardcodeadas.
5. Las variables de conexión a PostgreSQL se obtienen del entorno.
6. El Frontend puede realizar una petición al Backend.
7. El endpoint `/api/health` responde correctamente.
8. Las ramas `main`, `develop` y `feature/*` están definidas.
9. El README explica cómo levantar el proyecto.
10. Las credenciales reales no forman parte del repositorio.

## Definition of Done

```text
[ ] Código implementado
[ ] Criterios de aceptación cumplidos
[ ] Pruebas realizadas
[ ] Código revisado
[ ] Sin errores críticos
[ ] Pull Request creado
[ ] Pull Request revisado
[ ] Código integrado en develop
[ ] Jira actualizado
[ ] Documentación actualizada cuando corresponda
```

## Ejemplos por historia

- **HU-02 Gestionar clientes (SIC-02)**
  - Listar clientes con filtros (estado, territorio).
  - Ver detalle de un cliente por id.
  - Crear, actualizar y eliminar clientes.
  - Las validaciones de entrada retornan 400; cliente inexistente retorna 404.

- **HU-08 Dashboard (SIC-08)**
  - Mostrar KPIs: ventas totales, pedidos, clientes activos, vendedores activos.
  - Los datos provienen de `/api/dashboard`.
  - Respuesta 401 si no hay token válido.
