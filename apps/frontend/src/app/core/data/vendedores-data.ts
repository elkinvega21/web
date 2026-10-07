export type VentaMensual = {
  mes: string
  ventas: number
  meta: number
}

export type Actividad = {
  id: string
  tipo: 'visita' | 'llamada' | 'pedido' | 'reunion'
  fecha: string
  descripcion: string
  cliente?: string
}

export type ClienteAsignado = {
  id: string
  nombre: string
  territorio: string
  totalComprado: number
  ultimaCompra: string
  estado: 'Activo' | 'Inactivo'
}

export type Comision = {
  periodo: string
  ventas: number
  tasa: number
  comision: number
  cobrada: boolean
}

export type Vendedor = {
  id: string
  nombre: string
  email: string
  telefono: string
  iniciales: string
  territorio: string
  ciudades: string[]
  fechaIngreso: string
  estado: 'Activo' | 'Inactivo'
  ventasTotales: number
  ventasMes: number
  ventasPeriodoAnterior: number
  metaMensual: number
  cumplimientoMeta: number
  comisionTotal: number
  comisionPendiente: number
  comisionTasa: number
  ranking: number
  clientesAsignados: number
  clientesNuevos: number
  visitasMes: number
  ventasMensuales: VentaMensual[]
  actividad: Actividad[]
  clientes: ClienteAsignado[]
  comisiones: Comision[]
}

export const territorios = ['Bogotá', 'Medellín', 'Cali', 'Costa Caribe', 'Santanderes', 'Eje Cafetero', 'Amazonía']

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

function makeVentas(base: number): VentaMensual[] {
  const meses = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
  return meses.map((mes, i) => {
    const ventas = Math.round(base * (0.85 + Math.random() * 0.3))
    const meta = Math.round(base * 0.9)
    return { mes, ventas, meta }
  })
}

function makeActividad(nombre: string, clientes: string[]): Actividad[] {
  const tipos: Actividad['tipo'][] = ['visita', 'llamada', 'pedido', 'reunion']
  const fechas = ['22/07', '21/07', '19/07', '18/07', '16/07', '15/07', '12/07', '10/07']
  return fechas.map((f, i) => ({
    id: `${nombre}-act-${i}`,
    tipo: tipos[i % 4],
    fecha: f,
    descripcion: i % 4 === 0 ? `Visita a ${clientes[i % clientes.length]}` :
                 i % 4 === 1 ? `Llamada de seguimiento a ${clientes[i % clientes.length]}` :
                 i % 4 === 2 ? `Pedido registrado para ${clientes[i % clientes.length]}` :
                 `Reunión de planificación comercial`,
    cliente: clientes[i % clientes.length],
  }))
}

function makeClientes(base: string[], count: number): ClienteAsignado[] {
  return base.slice(0, count).map((n, i) => ({
    id: `cli-${i}`,
    nombre: n,
    territorio: 'Bogotá',
    totalComprado: Math.round(3000000 + Math.random() * 20000000),
    ultimaCompra: `${10 + i}/07/2026`,
    estado: i % 5 === 0 ? 'Inactivo' as const : 'Activo' as const,
  }))
}

function makeComisiones(ventasMensuales: VentaMensual[], tasa: number): Comision[] {
  return ventasMensuales.map((v) => ({
    periodo: v.mes,
    ventas: v.ventas,
    tasa,
    comision: Math.round(v.ventas * tasa),
    cobrada: Math.random() > 0.3,
  }))
}

const data: Vendedor[] = [
  {
    id: 'VEND-001', nombre: 'Laura Martínez', email: 'laura.m@adventure-retail.com', telefono: '+57 310 123 4567',
    iniciales: 'LM', territorio: 'Bogotá', ciudades: ['Bogotá D.C.', 'Soacha', 'Chía'], fechaIngreso: '15/03/2023',
    estado: 'Activo', ventasTotales: 45200000, ventasMes: 8250000, ventasPeriodoAnterior: 49000000, metaMensual: 8000000, cumplimientoMeta: 103,
    comisionTotal: 2260000, comisionPendiente: 452000, comisionTasa: 0.05, ranking: 1,
    clientesAsignados: 15, clientesNuevos: 3, visitasMes: 22,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-002', nombre: 'Diego Ramírez', email: 'diego.r@adventure-retail.com', telefono: '+57 320 456 7890',
    iniciales: 'DR', territorio: 'Medellín', ciudades: ['Medellín', 'Envigado', 'Itagüí'], fechaIngreso: '02/06/2023',
    estado: 'Activo', ventasTotales: 38000000, ventasMes: 7200000, ventasPeriodoAnterior: 43000000, metaMensual: 7500000, cumplimientoMeta: 96,
    comisionTotal: 1900000, comisionPendiente: 380000, comisionTasa: 0.05, ranking: 3,
    clientesAsignados: 12, clientesNuevos: 2, visitasMes: 18,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-003', nombre: 'Sofía Pérez', email: 'sofia.p@adventure-retail.com', telefono: '+57 315 789 0123',
    iniciales: 'SP', territorio: 'Cali', ciudades: ['Cali', 'Yumbo', 'Palmira'], fechaIngreso: '20/01/2024',
    estado: 'Activo', ventasTotales: 32000000, ventasMes: 5800000, ventasPeriodoAnterior: 35000000, metaMensual: 6000000, cumplimientoMeta: 97,
    comisionTotal: 1600000, comisionPendiente: 320000, comisionTasa: 0.05, ranking: 5,
    clientesAsignados: 10, clientesNuevos: 2, visitasMes: 16,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-004', nombre: 'Camila Torres', email: 'camila.t@adventure-retail.com', telefono: '+57 322 234 5678',
    iniciales: 'CT', territorio: 'Amazonía', ciudades: ['Leticia', 'Florencia', 'Mocoa'], fechaIngreso: '10/09/2023',
    estado: 'Activo', ventasTotales: 28000000, ventasMes: 5100000, ventasPeriodoAnterior: 30000000, metaMensual: 5500000, cumplimientoMeta: 93,
    comisionTotal: 1400000, comisionPendiente: 280000, comisionTasa: 0.05, ranking: 7,
    clientesAsignados: 8, clientesNuevos: 1, visitasMes: 14,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-005', nombre: 'Andrés Gutiérrez', email: 'andres.g@adventure-retail.com', telefono: '+57 301 345 6789',
    iniciales: 'AG', territorio: 'Costa Caribe', ciudades: ['Barranquilla', 'Cartagena', 'Santa Marta'], fechaIngreso: '05/05/2023',
    estado: 'Activo', ventasTotales: 35000000, ventasMes: 6600000, ventasPeriodoAnterior: 39000000, metaMensual: 6500000, cumplimientoMeta: 102,
    comisionTotal: 1750000, comisionPendiente: 350000, comisionTasa: 0.05, ranking: 4,
    clientesAsignados: 11, clientesNuevos: 3, visitasMes: 20,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-006', nombre: 'Valeria Hernández', email: 'valeria.h@adventure-retail.com', telefono: '+57 318 567 8901',
    iniciales: 'VH', territorio: 'Santanderes', ciudades: ['Bucaramanga', 'Cúcuta', 'San Gil'], fechaIngreso: '18/11/2023',
    estado: 'Activo', ventasTotales: 30000000, ventasMes: 5400000, ventasPeriodoAnterior: 32000000, metaMensual: 5800000, cumplimientoMeta: 93,
    comisionTotal: 1500000, comisionPendiente: 300000, comisionTasa: 0.05, ranking: 6,
    clientesAsignados: 9, clientesNuevos: 1, visitasMes: 15,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-007', nombre: 'Felipe Narváez', email: 'felipe.n@adventure-retail.com', telefono: '+57 312 678 9012',
    iniciales: 'FN', territorio: 'Eje Cafetero', ciudades: ['Manizales', 'Pereira', 'Armenia'], fechaIngreso: '22/08/2023',
    estado: 'Inactivo', ventasTotales: 22000000, ventasMes: 0, ventasPeriodoAnterior: 26000000, metaMensual: 5000000, cumplimientoMeta: 0,
    comisionTotal: 1100000, comisionPendiente: 110000, comisionTasa: 0.05, ranking: 8,
    clientesAsignados: 7, clientesNuevos: 0, visitasMes: 0,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
  {
    id: 'VEND-008', nombre: 'Patricia López', email: 'patricia.l@adventure-retail.com', telefono: '+57 314 789 0123',
    iniciales: 'PL', territorio: 'Bogotá', ciudades: ['Bogotá D.C.', 'Zipaquirá', 'Cajicá'], fechaIngreso: '01/04/2023',
    estado: 'Activo', ventasTotales: 40000000, ventasMes: 7800000, ventasPeriodoAnterior: 46000000, metaMensual: 7500000, cumplimientoMeta: 104,
    comisionTotal: 2000000, comisionPendiente: 400000, comisionTasa: 0.05, ranking: 2,
    clientesAsignados: 13, clientesNuevos: 4, visitasMes: 21,
    ventasMensuales: [] as VentaMensual[],
    actividad: [] as Actividad[], clientes: [] as ClienteAsignado[], comisiones: [] as Comision[],
  },
]

const nombresClientes: Record<string, string[]> = {
  'VEND-001': ['Outdoor Bogotá S.A.S', 'Colombia Trek', 'Alta Montaña Ltda', 'Camping Express', 'Naturaleza Viva', 'Deportes Andinos', 'Equipos Térmicos', 'Aventura Total', 'Expediciones Colombia', 'Travesía SAS', 'Montaña y Valle', 'Rocas y Rutas', 'Campamento Base', 'Selva Urbana', 'Bogotá Outdoor'],
  'VEND-002': ['Aventura Medellín S.A.S', 'Antioquia Trekking', 'Montaña Eterna', 'Expediciones PAISA', 'Equipar Outdoor', 'Valle del Aburrá', 'Deportes Montaña', 'Ríos y Cumbres', 'Travesía Andina', 'Medellín Aventura', 'Camping Antioquia', 'Naturaleza Viva'],
  'VEND-003': ['Trail Cali Ltda', 'Pacífico Aventura', 'Valle Trek', 'Deportes Extremos', 'Montaña Caucana', 'Expediciones Vallecaucanas', 'Camping Pacífico', 'Rutas del Valle', 'Naturaleza Colombia', 'Aventura Sur'],
  'VEND-004': ['Selva Amazonas S.A.S', 'Amazonía Trek', 'Pulmón Verde', 'Expediciones Amazónicas', 'Río y Selva', 'Naturaleza Sur', 'Aventura Amazónica', 'Camping Leticia'],
  'VEND-005': ['Caribe Outdoor', 'Costa Aventura', 'Mangle Travel', 'Sol y Montaña', 'Expediciones Caribe', 'Travesía Costera', 'Naturaleza Norte', 'Camping Cartagena', 'Deportes Marinos', 'Aventura Caribe', 'Tropical Trek'],
  'VEND-006': ['Santander Trek', 'Oriente Aventura', 'Cañón Chicamocha', 'Expediciones Santandereanas', 'Naturaleza Nororiente', 'Camping Bucaramanga', 'Rutas del Oriente', 'Aventura Norte', 'Montaña Santandereana'],
  'VEND-007': ['Cafetero Trek', 'Eje Aventura', 'Montaña Cafetera', 'Expediciones del Café', 'Naturaleza Verde', 'Camping Pereira', 'Rutas del Café'],
  'VEND-008': ['Cundinamarca Trek', 'Bogotá Aventura', 'Sabana Outdoor', 'Equipos Térmicos SAS', 'Colombia Vertical', 'Travesía Andina SAS', 'Campo y Montaña', 'Expediciones Centrales', 'Naturaleza Sabana', 'Rutas de la Sabana', 'Montaña Cundinamarquesa', 'Altiplano Trek', 'Naturaleza Viva SAS'],
}

data.forEach((v) => {
  const base = Math.round(v.ventasMes * 0.85)
  v.ventasMensuales = makeVentas(base)
  const cNames = nombresClientes[v.id]
  v.clientes = makeClientes(cNames, v.clientesAsignados)
  v.actividad = makeActividad(v.nombre, cNames)
  v.comisiones = makeComisiones(v.ventasMensuales, v.comisionTasa)
})

export const vendedores = data

export function getVendedor(id: string): Vendedor | undefined {
  return vendedores.find((v) => v.id === id)
}

export function getRanking(): Vendedor[] {
  return [...vendedores].filter((v) => v.estado === 'Activo').sort((a, b) => b.ventasMes - a.ventasMes)
}
