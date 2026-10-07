export type LineaPedido = {
  id: string
  producto: string
  cantidad: number
  precio: number
  descuento: number
  subtotal: number
}

export type Pedido = {
  id: string
  clienteId: string
  cliente: string
  clienteNIT: string
  total: number
  subtotal: number
  descuentoGlobal: number
  iva: number
  estado: 'Pendiente' | 'Completado' | 'Cancelado' | 'Facturado'
  fecha: string
  vendedor: string
  observaciones: string
  lineas: LineaPedido[]
}

export type SeguimientoEntry = {
  id: string
  estado: string
  fecha: string
  hora: string
  usuario: string
  completado: boolean
}

export type HistorialPedido = {
  id: string
  fecha: string
  usuario: string
  accion: string
  detalle: string
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export const estadosPedido = ['Pendiente', 'Completado', 'Cancelado', 'Facturado'] as const
export const productosCatalogo = [
  'Carpa Summit 4P',
  'Chaqueta Térmica X2',
  'Botas Trail Pro',
  'Mochila 45L',
  'Saco -10°C',
  'Linterna Recargable',
  'Termo 1L Acero',
  'Bastones Trekking',
  'Cantimplora 750ml',
  'Kit Cocina Camping',
]

export const pedidos: Pedido[] = [
  {
    id: 'PED-001',
    clienteId: '1',
    cliente: 'Outdoor Bogotá S.A.S',
    clienteNIT: '900.123.456-7',
    total: 9906750,
    subtotal: 8325000,
    descuentoGlobal: 0,
    iva: 1581750,
    estado: 'Completado',
    fecha: '22/07/2026',
    vendedor: 'Laura M.',
    observaciones: 'Entregar en bodega Andina antes del 30/07. Contactar a Carlos Méndez.',
    lineas: [
      { id: 'l1', producto: 'Carpa Summit 4P', cantidad: 20, precio: 320000, descuento: 10, subtotal: 5760000 },
      { id: 'l2', producto: 'Chaqueta Térmica X2', cantidad: 15, precio: 180000, descuento: 5, subtotal: 2565000 },
    ],
  },
  {
    id: 'PED-002',
    clienteId: '2',
    cliente: 'Aventura Medellín S.A.S',
    clienteNIT: '900.456.789-0',
    total: 5414500,
    subtotal: 4550000,
    descuentoGlobal: 0,
    iva: 864500,
    estado: 'Pendiente',
    fecha: '15/07/2026',
    vendedor: 'Diego R.',
    observaciones: 'Pago pendiente de confirmación.',
    lineas: [
      { id: 'l3', producto: 'Botas Trail Pro', cantidad: 25, precio: 140000, descuento: 0, subtotal: 3500000 },
      { id: 'l4', producto: 'Mochila 45L', cantidad: 10, precio: 105000, descuento: 0, subtotal: 1050000 },
    ],
  },
  {
    id: 'PED-003',
    clienteId: '3',
    cliente: 'Trail Cali Ltda',
    clienteNIT: '900.789.012-3',
    total: 4760000,
    subtotal: 4000000,
    descuentoGlobal: 0,
    iva: 760000,
    estado: 'Pendiente',
    fecha: '08/07/2026',
    vendedor: 'Sofía P.',
    observaciones: '',
    lineas: [
      { id: 'l5', producto: 'Saco -10°C', cantidad: 12, precio: 200000, descuento: 0, subtotal: 2400000 },
      { id: 'l6', producto: 'Linterna Recargable', cantidad: 20, precio: 80000, descuento: 0, subtotal: 1600000 },
    ],
  },
  {
    id: 'PED-004',
    clienteId: '1',
    cliente: 'Outdoor Bogotá S.A.S',
    clienteNIT: '900.123.456-7',
    total: 15200000,
    subtotal: 12773109,
    descuentoGlobal: 5,
    iva: 2426891,
    estado: 'Facturado',
    fecha: '28/06/2026',
    vendedor: 'Laura M.',
    observaciones: 'Factura electrónica enviada.',
    lineas: [
      { id: 'l7', producto: 'Carpa Summit 4P', cantidad: 30, precio: 320000, descuento: 8, subtotal: 8832000 },
      { id: 'l8', producto: 'Termo 1L Acero', cantidad: 40, precio: 55000, descuento: 0, subtotal: 2200000 },
      { id: 'l9', producto: 'Kit Cocina Camping', cantidad: 15, precio: 95000, descuento: 5, subtotal: 1353750 },
    ],
  },
  {
    id: 'PED-005',
    clienteId: '5',
    cliente: 'Selva Amazonas S.A.S',
    clienteNIT: '800.567.890-1',
    total: 3560000,
    subtotal: 2991597,
    descuentoGlobal: 0,
    iva: 568403,
    estado: 'Cancelado',
    fecha: '15/06/2026',
    vendedor: 'Camila T.',
    observaciones: 'Cliente canceló el pedido por correo.',
    lineas: [
      { id: 'l10', producto: 'Bastones Trekking', cantidad: 10, precio: 95000, descuento: 0, subtotal: 950000 },
      { id: 'l11', producto: 'Cantimplora 750ml', cantidad: 30, precio: 35000, descuento: 0, subtotal: 1050000 },
    ],
  },
]

export function getPedido(id: string): Pedido | undefined {
  return pedidos.find((p) => p.id === id)
}

export function getSeguimiento(pedidoId: string): SeguimientoEntry[] {
  const data: Record<string, SeguimientoEntry[]> = {
    'PED-001': [
      { id: 's1', estado: 'Pedido creado', fecha: '15/07/2026', hora: '08:30', usuario: 'Laura M.', completado: true },
      { id: 's2', estado: 'Pendiente de pago', fecha: '15/07/2026', hora: '08:30', usuario: 'Sistema', completado: true },
      { id: 's3', estado: 'Pago confirmado', fecha: '18/07/2026', hora: '14:22', usuario: 'Sistema', completado: true },
      { id: 's4', estado: 'En preparación', fecha: '19/07/2026', hora: '09:00', usuario: 'Bodega Central', completado: true },
      { id: 's5', estado: 'Despachado', fecha: '21/07/2026', hora: '10:30', usuario: 'Logística', completado: true },
      { id: 's6', estado: 'Facturado', fecha: '22/07/2026', hora: '11:00', usuario: 'Sistema', completado: true },
      { id: 's7', estado: 'Completado', fecha: '22/07/2026', hora: '15:30', usuario: 'Sistema', completado: true },
    ],
    'PED-002': [
      { id: 's8', estado: 'Pedido creado', fecha: '15/07/2026', hora: '10:15', usuario: 'Diego R.', completado: true },
      { id: 's9', estado: 'Pendiente de pago', fecha: '15/07/2026', hora: '10:15', usuario: 'Sistema', completado: true },
      { id: 's10', estado: 'Pago confirmado', fecha: '', hora: '', usuario: '', completado: false },
    ],
  }
  return data[pedidoId] ?? []
}

export function getHistorialPedido(pedidoId: string): HistorialPedido[] {
  const data: Record<string, HistorialPedido[]> = {
    'PED-001': [
      { id: 'h1', fecha: '22/07/2026 15:30', usuario: 'Sistema', accion: 'Estado actualizado', detalle: 'Cambió a Completado' },
      { id: 'h2', fecha: '22/07/2026 11:00', usuario: 'Sistema', accion: 'Factura generada', detalle: 'Se emitió factura #FE-9931' },
      { id: 'h3', fecha: '15/07/2026 08:30', usuario: 'Laura M.', accion: 'Pedido creado', detalle: 'Creación inicial del pedido' },
    ],
  }
  return data[pedidoId] ?? []
}
