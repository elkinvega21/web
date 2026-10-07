// (iconos: shopping-cart, calendar-range, user-plus, clock, circle-check-big, dollar-sign)
export type Kpi = {
  key: string
  label: string
  value: string
  delta: number
  deltaLabel: string
  icon: string
  spark: number[]
}

export const kpis: Kpi[] = [
  {
    key: 'sales-day',
    label: 'Ventas del día',
    value: '$4.820.000',
    delta: 12.4,
    deltaLabel: 'vs. ayer',
    icon: 'shopping-cart',
    spark: [18, 24, 20, 32, 28, 40, 44],
  },
  {
    key: 'sales-month',
    label: 'Ventas del mes',
    value: '$128.4M',
    delta: 8.1,
    deltaLabel: 'vs. mes anterior',
    icon: 'calendar-range',
    spark: [60, 72, 68, 80, 92, 88, 104],
  },
  {
    key: 'new-customers',
    label: 'Clientes nuevos',
    value: '342',
    delta: 5.6,
    deltaLabel: 'este mes',
    icon: 'user-plus',
    spark: [12, 16, 14, 22, 20, 26, 31],
  },
  {
    key: 'pending-orders',
    label: 'Pedidos pendientes',
    value: '58',
    delta: -3.2,
    deltaLabel: 'vs. semana pasada',
    icon: 'clock',
    spark: [40, 38, 42, 36, 34, 30, 28],
  },
  {
    key: 'completed-orders',
    label: 'Pedidos completados',
    value: '1.204',
    delta: 9.7,
    deltaLabel: 'este mes',
    icon: 'circle-check-big',
    spark: [70, 78, 82, 90, 96, 110, 120],
  },
  {
    key: 'revenue',
    label: 'Ingresos',
    value: '$96.7M',
    delta: 14.3,
    deltaLabel: 'margen 32%',
    icon: 'dollar-sign',
    spark: [50, 58, 64, 62, 74, 84, 92],
  },
]

// Ventas mensuales: ingresos vs. meta
export const monthlySales = [
  { month: 'Ene', ventas: 82, meta: 78 },
  { month: 'Feb', ventas: 74, meta: 80 },
  { month: 'Mar', ventas: 91, meta: 84 },
  { month: 'Abr', ventas: 88, meta: 86 },
  { month: 'May', ventas: 102, meta: 90 },
  { month: 'Jun', ventas: 96, meta: 94 },
  { month: 'Jul', ventas: 112, meta: 98 },
  { month: 'Ago', ventas: 108, meta: 102 },
  { month: 'Sep', ventas: 121, meta: 108 },
  { month: 'Oct', ventas: 118, meta: 112 },
  { month: 'Nov', ventas: 128, meta: 118 },
  { month: 'Dic', ventas: 134, meta: 124 },
]

// Ventas por territorio
export const territories = [
  { name: 'Andina', value: 42, fill: 'var(--chart-1)' },
  { name: 'Caribe', value: 26, fill: 'var(--chart-2)' },
  { name: 'Pacífico', value: 18, fill: 'var(--chart-3)' },
  { name: 'Oriente', value: 14, fill: 'var(--chart-4)' },
]

// Productos más vendidos (unidades en miles)
export const topProducts = [
  { product: 'Carpa Summit 4P', unidades: 4.8 },
  { product: 'Chaqueta Térmica X2', unidades: 4.1 },
  { product: 'Botas Trail Pro', unidades: 3.6 },
  { product: 'Mochila 45L', unidades: 3.2 },
  { product: 'Saco -10°C', unidades: 2.7 },
]

// Rendimiento de vendedores (% de cumplimiento de meta)
export const sellers = [
  { name: 'Laura M.', cumplimiento: 128 },
  { name: 'Diego R.', cumplimiento: 112 },
  { name: 'Sofía P.', cumplimiento: 104 },
  { name: 'Andrés G.', cumplimiento: 96 },
  { name: 'Camila T.', cumplimiento: 88 },
]

export type Activity = {
  id: string
  actor: string
  initials: string
  action: string
  target: string
  time: string
  tone: 'default' | 'success' | 'warning'
}

export const activity: Activity[] = [
  {
    id: 'a1',
    actor: 'Diego Ramírez',
    initials: 'DR',
    action: 'cerró la orden',
    target: '#PED-20482 · $2.4M',
    time: 'Hace 8 min',
    tone: 'success',
  },
  {
    id: 'a2',
    actor: 'Sistema',
    initials: 'SY',
    action: 'generó factura electrónica',
    target: '#FE-9931',
    time: 'Hace 21 min',
    tone: 'default',
  },
  {
    id: 'a3',
    actor: 'Sofía Pardo',
    initials: 'SP',
    action: 'registró nuevo cliente',
    target: 'Outdoor Cali S.A.S',
    time: 'Hace 46 min',
    tone: 'default',
  },
  {
    id: 'a4',
    actor: 'Bodega Central',
    initials: 'BC',
    action: 'reportó stock bajo en',
    target: 'Botas Trail Pro',
    time: 'Hace 1 h',
    tone: 'warning',
  },
  {
    id: 'a5',
    actor: 'Andrés Gómez',
    initials: 'AG',
    action: 'actualizó la cotización',
    target: '#COT-5521',
    time: 'Hace 2 h',
    tone: 'default',
  },
]

export type Alert = {
  id: string
  title: string
  detail: string
  level: 'critical' | 'warning' | 'info'
}

export const alerts: Alert[] = [
  {
    id: 'al1',
    title: 'Stock crítico',
    detail: '3 SKU por debajo del mínimo en bodega Andina.',
    level: 'critical',
  },
  {
    id: 'al2',
    title: 'Pagos vencidos',
    detail: '$8.2M en cartera con más de 30 días.',
    level: 'warning',
  },
  {
    id: 'al3',
    title: 'Meta trimestral',
    detail: 'Vas al 92% del objetivo Q3. Faltan $6.1M.',
    level: 'info',
  },
]

export type Notification = {
  id: string
  title: string
  time: string
  unread: boolean
}

export const notifications: Notification[] = [
  { id: 'n1', title: 'Nuevo pedido mayorista de Aventura Bogotá', time: '5 min', unread: true },
  { id: 'n2', title: 'Devolución aprobada #DEV-338', time: '32 min', unread: true },
  { id: 'n3', title: 'Cierre de caja pendiente de aprobación', time: '1 h', unread: true },
  { id: 'n4', title: 'Reporte mensual disponible para descarga', time: '3 h', unread: false },
]

export type Task = {
  id: string
  title: string
  due: string
  priority: 'alta' | 'media' | 'baja'
  done: boolean
}

export const tasks: Task[] = [
  { id: 't1', title: 'Aprobar órdenes de compra pendientes', due: 'Hoy', priority: 'alta', done: false },
  { id: 't2', title: 'Revisar cartera vencida con contabilidad', due: 'Hoy', priority: 'alta', done: false },
  { id: 't3', title: 'Confirmar inventario bodega Caribe', due: 'Mañana', priority: 'media', done: false },
  { id: 't4', title: 'Llamada con proveedor Summit', due: '28 jul', priority: 'media', done: true },
  { id: 't5', title: 'Cargar catálogo temporada alta', due: '30 jul', priority: 'baja', done: false },
]

export type CalendarEvent = {
  day: number
  label: string
  tone: 'primary' | 'success' | 'warning'
}

export const calendarEvents: CalendarEvent[] = [
  { day: 29, label: 'Cierre de mes', tone: 'primary' },
  { day: 30, label: 'Reunión ventas', tone: 'success' },
  { day: 31, label: 'Pago proveedores', tone: 'warning' },
]

export const quickActions = [
  { key: 'new-order', label: 'Nuevo pedido' },
  { key: 'new-customer', label: 'Registrar cliente' },
  { key: 'invoice', label: 'Emitir factura' },
  { key: 'inventory', label: 'Ajustar inventario' },
  { key: 'report', label: 'Generar reporte' },
  { key: 'quote', label: 'Nueva cotización' },
]
