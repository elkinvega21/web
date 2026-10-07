export type HistorialPromo = {
  id: string
  fecha: string
  usuario: string
  accion: string
  detalle: string
}

export type Promocion = {
  id: string
  nombre: string
  descripcion: string
  tipo: 'Porcentaje' | 'Monto fijo' | '2x1' | 'Combo'
  valor: number
  fechaInicio: string
  fechaFin: string
  estado: 'Activa' | 'Programada' | 'Vencida' | 'Desactivada'
  condiciones: string
  aplicaMinimo: number
  productos: string[]
  productoNombres: string[]
  creado: string
  actualizado: string
  historial: HistorialPromo[]
}

export const tiposPromo = ['Porcentaje', 'Monto fijo', '2x1', 'Combo'] as const

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

const catalogo = [
  'Carpa Summit 4P', 'Chaqueta Térmica X2', 'Botas Trail Pro', 'Mochila 45L Trail',
  'Saco Dormir -10°C', 'Kit Cocina Camping', 'Linterna Recargable LED', 'Termo 1L Acero',
  'Cantimplora 750ml', 'Bastones Trekking', 'Zapatillas Running Trail', 'Camiseta DryFit',
  'Pantalón Cargo Explorer', 'Maleta Viaje 60L',
]

export const promociones: Promocion[] = [
  {
    id: 'PROMO-001', nombre: 'Liquidación temporada alta',
    descripcion: '20% de descuento en toda la línea de carpas y equipos de camping para la temporada de vacaciones.',
    tipo: 'Porcentaje', valor: 20,
    fechaInicio: '01/07/2026', fechaFin: '31/08/2026',
    estado: 'Activa', condiciones: 'Sin monto mínimo. Válido solo para compras en tienda física.',
    aplicaMinimo: 0,
    productos: ['PROD-006', 'PROD-007', 'PROD-008'],
    productoNombres: ['Carpa Summit 4P', 'Saco Dormir -10°C', 'Kit Cocina Camping'],
    creado: '15/06/2026', actualizado: '28/06/2026',
    historial: [
      { id: 'h1', fecha: '28/06/2026 10:30', usuario: 'Admin', accion: 'Activada', detalle: 'Promoción activada para temporada alta' },
      { id: 'h2', fecha: '15/06/2026 14:00', usuario: 'Admin', accion: 'Creada', detalle: 'Creación inicial de la promoción' },
    ],
  },
  {
    id: 'PROMO-002', nombre: 'Descuento calzado trail',
    descripcion: '10% off en botas y zapatillas trail running. Aprovecha la nueva colección.',
    tipo: 'Porcentaje', valor: 10,
    fechaInicio: '15/07/2026', fechaFin: '15/08/2026',
    estado: 'Activa', condiciones: 'Mínimo 1 par. Aplica también en compras online.',
    aplicaMinimo: 0,
    productos: ['PROD-004', 'PROD-005'],
    productoNombres: ['Botas Trail Pro', 'Zapatillas Running Trail'],
    creado: '10/07/2026', actualizado: '14/07/2026',
    historial: [
      { id: 'h3', fecha: '14/07/2026 09:15', usuario: 'Admin', accion: 'Activada', detalle: 'Activación programada' },
    ],
  },
  {
    id: 'PROMO-003', nombre: 'Combo Aventura Familiar',
    descripcion: 'Carpa + Saco de dormir + Kit de cocina con descuento del 25%. El combo perfecto para camping familiar.',
    tipo: 'Combo', valor: 25,
    fechaInicio: '01/07/2026', fechaFin: '30/09/2026',
    estado: 'Activa', condiciones: 'Compra de los 3 productos. Descuento aplica sobre el total.',
    aplicaMinimo: 0,
    productos: ['PROD-006', 'PROD-007', 'PROD-008'],
    productoNombres: ['Carpa Summit 4P', 'Saco Dormir -10°C', 'Kit Cocina Camping'],
    creado: '20/06/2026', actualizado: '30/06/2026',
    historial: [
      { id: 'h4', fecha: '30/06/2026 11:00', usuario: 'Admin', accion: 'Activada', detalle: 'Combo activado' },
    ],
  },
  {
    id: 'PROMO-004', nombre: '2x1 Accesorios',
    descripcion: 'Lleva 2 accesorios al precio de 1. Aplica en linternas, termos y cantimploras.',
    tipo: '2x1', valor: 50,
    fechaInicio: '01/08/2026', fechaFin: '31/08/2026',
    estado: 'Programada', condiciones: 'Aplica solo en accesorios seleccionados. El de menor valor es gratis.',
    aplicaMinimo: 0,
    productos: ['PROD-009', 'PROD-010', 'PROD-011'],
    productoNombres: ['Linterna Recargable LED', 'Termo 1L Acero', 'Cantimplora 750ml'],
    creado: '25/07/2026', actualizado: '25/07/2026',
    historial: [
      { id: 'h5', fecha: '25/07/2026 16:45', usuario: 'Admin', accion: 'Creada', detalle: 'Programada para inicio en agosto' },
    ],
  },
  {
    id: 'PROMO-005', nombre: 'Mochila con descuento',
    descripcion: '15% de descuento en mochilas 45L y maletas viaje 60L.',
    tipo: 'Porcentaje', valor: 15,
    fechaInicio: '01/08/2026', fechaFin: '31/08/2026',
    estado: 'Programada', condiciones: 'Mínimo 1 unidad. No acumulable con otras promociones.',
    aplicaMinimo: 0,
    productos: ['PROD-013', 'PROD-014'],
    productoNombres: ['Mochila 45L Trail', 'Maleta Viaje 60L'],
    creado: '27/07/2026', actualizado: '27/07/2026',
    historial: [
      { id: 'h6', fecha: '27/07/2026 08:30', usuario: 'Admin', accion: 'Creada', detalle: 'Programada para agosto' },
    ],
  },
  {
    id: 'PROMO-006', nombre: 'Oferta relámpago julio',
    descripcion: 'Descuento de $50.000 en chaquetas térmicas. ¡Solo por tiempo limitado!',
    tipo: 'Monto fijo', valor: 50000,
    fechaInicio: '10/07/2026', fechaFin: '20/07/2026',
    estado: 'Vencida', condiciones: 'Mínimo 1 chaqueta. Válido por 10 días.',
    aplicaMinimo: 0,
    productos: ['PROD-001'],
    productoNombres: ['Chaqueta Térmica X2'],
    creado: '05/07/2026', actualizado: '20/07/2026',
    historial: [
      { id: 'h7', fecha: '20/07/2026 23:59', usuario: 'Sistema', accion: 'Vencida', detalle: 'Fecha de finalización alcanzada' },
      { id: 'h8', fecha: '10/07/2026 00:00', usuario: 'Sistema', accion: 'Activada', detalle: 'Inicio automático' },
    ],
  },
  {
    id: 'PROMO-007', nombre: 'Descuento ropa deportiva',
    descripcion: '12% de descuento en camisetas DryFit y pantalones cargo. Ideal para preparar la temporada.',
    tipo: 'Porcentaje', valor: 12,
    fechaInicio: '01/06/2026', fechaFin: '30/06/2026',
    estado: 'Vencida', condiciones: 'Mínimo 2 prendas. Aplica en tienda física y online.',
    aplicaMinimo: 2,
    productos: ['PROD-002', 'PROD-003'],
    productoNombres: ['Camiseta DryFit', 'Pantalón Cargo Explorer'],
    creado: '20/05/2026', actualizado: '30/06/2026',
    historial: [
      { id: 'h9', fecha: '30/06/2026', usuario: 'Sistema', accion: 'Vencida', detalle: '' },
    ],
  },
  {
    id: 'PROMO-008', nombre: 'Descuento por volumen',
    descripcion: '20% off en compras superiores a $1.000.000 en cualquier producto del catálogo.',
    tipo: 'Porcentaje', valor: 20,
    fechaInicio: '15/06/2026', fechaFin: '31/07/2026',
    estado: 'Desactivada', condiciones: 'Compra mínima de $1.000.000. Aplica en todos los productos.',
    aplicaMinimo: 1000000,
    productos: [],
    productoNombres: [],
    creado: '10/06/2026', actualizado: '12/07/2026',
    historial: [
      { id: 'h10', fecha: '12/07/2026 15:20', usuario: 'Admin', accion: 'Desactivada', detalle: 'Se desactivó por baja rentabilidad' },
      { id: 'h11', fecha: '15/06/2026 08:00', usuario: 'Sistema', accion: 'Activada', detalle: 'Inicio programado' },
    ],
  },
  {
    id: 'PROMO-009', nombre: 'Combo Trail Completo',
    descripcion: 'Botas + Bastones + Mochila con 30% de descuento. El pack definitivo para senderismo.',
    tipo: 'Combo', valor: 30,
    fechaInicio: '01/08/2026', fechaFin: '15/09/2026',
    estado: 'Programada', condiciones: 'Compra de los 3 productos. No aplica con otras promociones.',
    aplicaMinimo: 0,
    productos: ['PROD-004', 'PROD-012', 'PROD-013'],
    productoNombres: ['Botas Trail Pro', 'Bastones Trekking', 'Mochila 45L Trail'],
    creado: '28/07/2026', actualizado: '28/07/2026',
    historial: [
      { id: 'h12', fecha: '28/07/2026 10:00', usuario: 'Admin', accion: 'Creada', detalle: 'Nuevo combo programado' },
    ],
  },
  {
    id: 'PROMO-010', nombre: 'Lleva 3 paga 2',
    descripcion: '2x1 en toda la línea de termos y cantimploras. Aprovecha para hidratarte en tus aventuras.',
    tipo: '2x1', valor: 100,
    fechaInicio: '20/07/2026', fechaFin: '03/08/2026',
    estado: 'Activa', condiciones: 'Aplica solo en productos seleccionados. Se descuenta el de menor valor.',
    aplicaMinimo: 0,
    productos: ['PROD-010', 'PROD-011'],
    productoNombres: ['Termo 1L Acero', 'Cantimplora 750ml'],
    creado: '15/07/2026', actualizado: '19/07/2026',
    historial: [
      { id: 'h13', fecha: '19/07/2026 14:00', usuario: 'Admin', accion: 'Activada', detalle: 'Activación manual' },
    ],
  },
]

export function getPromocion(id: string): Promocion | undefined {
  return promociones.find((p) => p.id === id)
}

export function getPromosVencimiento(): Promocion[] {
  const hoy = new Date()
  const en7dias = new Date(hoy)
  en7dias.setDate(en7dias.getDate() + 7)
  return promociones.filter((p) => {
    if (p.estado !== 'Activa') return false
    const [dd, mm, yyyy] = p.fechaFin.split('/').map(Number)
    const fin = new Date(yyyy, mm - 1, dd)
    return fin >= hoy && fin <= en7dias
  })
}
