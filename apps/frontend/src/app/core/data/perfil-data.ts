export type SesionActiva = {
  id: string
  dispositivo: string
  icono: 'laptop' | 'smartphone' | 'tablet'
  navegador: string
  ip: string
  ubicacion: string
  ultimaActividad: string
  inicio: string
  esActual: boolean
}

export type Actividad = {
  id: string
  tipo: 'login' | 'logout' | 'password' | 'perfil' | 'preferencia' | 'nueva_sesion'
  descripcion: string
  timestamp: string
  relativo: string
}

export type NotificacionConfig = {
  key: string
  label: string
  categoria: string
}

export const CATEGORIAS_NOTIFICACIONES = [
  {
    categoria: 'Ventas',
    items: [
      { key: 'nuevoPedido', label: 'Nuevo pedido' },
      { key: 'pedidoCompletado', label: 'Pedido completado' },
      { key: 'metaAlcanzada', label: 'Meta alcanzada' },
    ],
  },
  {
    categoria: 'Clientes',
    items: [
      { key: 'nuevoCliente', label: 'Nuevo registro' },
      { key: 'clienteCumpleaños', label: 'Cliente cumpleaños' },
    ],
  },
  {
    categoria: 'Productos',
    items: [
      { key: 'stockBajo', label: 'Stock bajo' },
      { key: 'stockCritico', label: 'Stock crítico' },
      { key: 'promocionActivada', label: 'Promoción activada' },
    ],
  },
  {
    categoria: 'Sistema',
    items: [
      { key: 'actualizacionDisponible', label: 'Actualización disponible' },
      { key: 'tareasAsignadas', label: 'Tareas asignadas' },
      { key: 'alertasSeguridad', label: 'Alertas de seguridad' },
    ],
  },
]

export const SESIONES_MOCK: SesionActiva[] = [
  {
    id: 's1',
    dispositivo: 'Windows 11 Pro',
    icono: 'laptop',
    navegador: 'Microsoft Edge 128',
    ip: '192.168.1.42',
    ubicacion: 'Bogotá, Colombia',
    ultimaActividad: 'Ahora',
    inicio: '29/07/2026 08:15',
    esActual: true,
  },
  {
    id: 's2',
    dispositivo: 'Samsung Galaxy S25',
    icono: 'smartphone',
    navegador: 'Chrome Mobile 128',
    ip: '186.29.84.12',
    ubicacion: 'Bogotá, Colombia',
    ultimaActividad: 'Hace 3 horas',
    inicio: '29/07/2026 06:02',
    esActual: false,
  },
]

export const ACTIVIDAD_MOCK: Actividad[] = [
  { id: 'a1', tipo: 'login', descripcion: 'Inicio de sesión desde Windows 11', timestamp: '2026-07-29T08:15:00', relativo: 'Hace 3 horas' },
  { id: 'a2', tipo: 'preferencia', descripcion: 'Cambió el tema a modo oscuro', timestamp: '2026-07-28T22:30:00', relativo: 'Ayer' },
  { id: 'a3', tipo: 'password', descripcion: 'Cambió su contraseña', timestamp: '2026-07-28T18:00:00', relativo: 'Ayer' },
  { id: 'a4', tipo: 'login', descripcion: 'Inicio de sesión desde Android', timestamp: '2026-07-28T07:45:00', relativo: 'Ayer' },
  { id: 'a5', tipo: 'perfil', descripcion: 'Actualizó su información personal', timestamp: '2026-07-27T14:20:00', relativo: 'Hace 2 días' },
  { id: 'a6', tipo: 'logout', descripcion: 'Cierre de sesión', timestamp: '2026-07-27T18:30:00', relativo: 'Hace 2 días' },
  { id: 'a7', tipo: 'nueva_sesion', descripcion: 'Nueva sesión iniciada desde dispositivo Android', timestamp: '2026-07-26T09:10:00', relativo: 'Hace 3 días' },
  { id: 'a8', tipo: 'preferencia', descripcion: 'Cambió el idioma a Español', timestamp: '2026-07-25T11:00:00', relativo: 'Hace 4 días' },
  { id: 'a9', tipo: 'login', descripcion: 'Inicio de sesión desde Windows 11', timestamp: '2026-07-25T08:00:00', relativo: 'Hace 4 días' },
  { id: 'a10', tipo: 'perfil', descripcion: 'Actualizó su foto de perfil', timestamp: '2026-07-24T16:45:00', relativo: 'Hace 5 días' },
  { id: 'a11', tipo: 'logout', descripcion: 'Cierre de sesión', timestamp: '2026-07-24T18:00:00', relativo: 'Hace 5 días' },
  { id: 'a12', tipo: 'password', descripcion: 'Cambió su contraseña', timestamp: '2026-07-20T10:30:00', relativo: 'Hace 9 días' },
]

export const DEPARTAMENTOS = [
  'Tecnología', 'Ventas', 'Marketing', 'Operaciones',
  'Finanzas', 'Recursos Humanos', 'Logística', 'Dirección',
]

export function getActividadPorTipo(actividades: Actividad[], tipo: string): Actividad[] {
  if (tipo === 'todas') return actividades
  return actividades.filter((a) => a.tipo === tipo)
}

export function getDiasExpiracionPassword(fechaExpiracion: string): number {
  const hoy = new Date()
  const exp = new Date(fechaExpiracion)
  return Math.ceil((exp.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
}

export function getEstadoPassword(dias: number): { label: string; color: string } {
  if (dias > 30) return { label: 'Saludable', color: 'text-success' }
  if (dias > 7) return { label: 'Próximo a vencer', color: 'text-warning' }
  return { label: 'Expirado', color: 'text-destructive' }
}
