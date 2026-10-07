export type VentaMensualTerritorio = {
  mes: string
  ventas: number
  meta: number
}

export type DistribucionCategoria = {
  categoria: string
  ventas: number
  porcentaje: number
}

export type TopVendedor = {
  nombre: string
  ventas: number
  clientes: number
}

export type TopCliente = {
  nombre: string
  ventas: number
  ultimaCompra: string
}

export type Territorio = {
  id: string
  nombre: string
  region: string
  ventasTotales: number
  ventasMes: number
  ventasPeriodoAnterior: number
  crecimiento: number
  participacion: number
  metaCumplimiento: number
  clientes: number
  clientesActivos: number
  clientesNuevos: number
  vendedores: number
  vendedoresActivos: number
  topVendedor: string
  topProducto: string
  visitasMes: number
  ticketPromedio: number
  ventasMensuales: VentaMensualTerritorio[]
  distribucionCategorias: DistribucionCategoria[]
  topVendedores: TopVendedor[]
  topClientes: TopCliente[]
  color: string
}

const meses = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']

function makeVentasMensuales(base: number): VentaMensualTerritorio[] {
  return meses.map((mes) => {
    const variacion = 0.85 + Math.random() * 0.3
    const ventas = Math.round(base * variacion)
    const meta = Math.round(base * 0.92)
    return { mes, ventas, meta }
  })
}

function makeDistribucion(): DistribucionCategoria[] {
  const cats = ['Ropa', 'Calzado', 'Camping', 'Accesorios', 'Equipaje']
  const total = cats.reduce((s) => s + Math.round(5000000 + Math.random() * 15000000), 0)
  return cats.map((categoria) => {
    const ventas = Math.round(3000000 + Math.random() * 12000000)
    return { categoria, ventas, porcentaje: 0 }
  }).map((item) => {
    const subTotal = item.ventas
    return { ...item, porcentaje: Math.round((subTotal / total) * 100) }
  })
}

function makeTopVendedores(base: string[], ventasBase: number[]): TopVendedor[] {
  return base.map((nombre, i) => ({
    nombre,
    ventas: Math.round(ventasBase[i] * (0.8 + Math.random() * 0.4)),
    clientes: Math.round(3 + Math.random() * 8),
  })).sort((a, b) => b.ventas - a.ventas)
}

function makeTopClientes(base: string[]): TopCliente[] {
  return base.slice(0, 5).map((nombre, i) => ({
    nombre,
    ventas: Math.round(5000000 + Math.random() * 25000000),
    ultimaCompra: `${15 + i}/07/2026`,
  })).sort((a, b) => b.ventas - a.ventas)
}

export const territorios: Territorio[] = [
  {
    id: 'TER-001', nombre: 'Bogotá', region: 'Centro',
    ventasTotales: 85200000, ventasMes: 16050000, ventasPeriodoAnterior: 78200000, crecimiento: 8.9,
    participacion: 28, metaCumplimiento: 103, clientes: 28, clientesActivos: 25, clientesNuevos: 7,
    vendedores: 2, vendedoresActivos: 2, topVendedor: 'Laura Martínez', topProducto: 'Carpa Summit 4P',
    visitasMes: 43, ticketPromedio: 185000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#6366f1',
  },
  {
    id: 'TER-002', nombre: 'Medellín', region: 'Centro-Occidente',
    ventasTotales: 38000000, ventasMes: 7200000, ventasPeriodoAnterior: 35500000, crecimiento: 7.0,
    participacion: 18, metaCumplimiento: 96, clientes: 18, clientesActivos: 16, clientesNuevos: 4,
    vendedores: 1, vendedoresActivos: 1, topVendedor: 'Diego Ramírez', topProducto: 'Botas Trail Pro',
    visitasMes: 18, ticketPromedio: 172000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#f59e0b',
  },
  {
    id: 'TER-003', nombre: 'Cali', region: 'Suroccidente',
    ventasTotales: 32000000, ventasMes: 5800000, ventasPeriodoAnterior: 29800000, crecimiento: 7.4,
    participacion: 14, metaCumplimiento: 97, clientes: 14, clientesActivos: 12, clientesNuevos: 3,
    vendedores: 1, vendedoresActivos: 1, topVendedor: 'Sofía Pérez', topProducto: 'Saco Dormir -10°C',
    visitasMes: 16, ticketPromedio: 168000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#10b981',
  },
  {
    id: 'TER-004', nombre: 'Costa Caribe', region: 'Norte',
    ventasTotales: 35000000, ventasMes: 6600000, ventasPeriodoAnterior: 32000000, crecimiento: 9.4,
    participacion: 15, metaCumplimiento: 102, clientes: 15, clientesActivos: 14, clientesNuevos: 5,
    vendedores: 1, vendedoresActivos: 1, topVendedor: 'Andrés Gutiérrez', topProducto: 'Mochila 45L Trail',
    visitasMes: 20, ticketPromedio: 195000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#ec4899',
  },
  {
    id: 'TER-005', nombre: 'Santanderes', region: 'Nororiente',
    ventasTotales: 30000000, ventasMes: 5400000, ventasPeriodoAnterior: 28500000, crecimiento: 5.3,
    participacion: 11, metaCumplimiento: 93, clientes: 12, clientesActivos: 10, clientesNuevos: 2,
    vendedores: 1, vendedoresActivos: 1, topVendedor: 'Valeria Hernández', topProducto: 'Chaqueta Térmica X2',
    visitasMes: 15, ticketPromedio: 155000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#8b5cf6',
  },
  {
    id: 'TER-006', nombre: 'Eje Cafetero', region: 'Occidente',
    ventasTotales: 22000000, ventasMes: 3800000, ventasPeriodoAnterior: 21000000, crecimiento: 4.8,
    participacion: 8, metaCumplimiento: 85, clientes: 9, clientesActivos: 7, clientesNuevos: 1,
    vendedores: 1, vendedoresActivos: 0, topVendedor: '—', topProducto: 'Cantimplora 750ml',
    visitasMes: 8, ticketPromedio: 142000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#14b8a6',
  },
  {
    id: 'TER-007', nombre: 'Amazonía', region: 'Sur',
    ventasTotales: 28000000, ventasMes: 5100000, ventasPeriodoAnterior: 26500000, crecimiento: 5.7,
    participacion: 6, metaCumplimiento: 93, clientes: 10, clientesActivos: 8, clientesNuevos: 2,
    vendedores: 1, vendedoresActivos: 1, topVendedor: 'Camila Torres', topProducto: 'Kit Cocina Camping',
    visitasMes: 14, ticketPromedio: 210000,
    ventasMensuales: [] as VentaMensualTerritorio[],
    distribucionCategorias: [] as DistribucionCategoria[],
    topVendedores: [] as TopVendedor[],
    topClientes: [] as TopCliente[],
    color: '#06b6d4',
  },
]

// Fill computed data
territorios.forEach((t) => {
  t.ventasMensuales = makeVentasMensuales(Math.round(t.ventasMes * 0.85))
  t.distribucionCategorias = makeDistribucion()

  const nombresVendedores: Record<string, string[]> = {
    'Bogotá': ['Laura Martínez', 'Patricia López'],
    'Medellín': ['Diego Ramírez'],
    'Cali': ['Sofía Pérez'],
    'Costa Caribe': ['Andrés Gutiérrez'],
    'Santanderes': ['Valeria Hernández'],
    'Eje Cafetero': ['Felipe Narváez'],
    'Amazonía': ['Camila Torres'],
  }
  const ventasBase: Record<string, number[]> = {
    'Bogotá': [8250000, 7800000],
    'Medellín': [7200000],
    'Cali': [5800000],
    'Costa Caribe': [6600000],
    'Santanderes': [5400000],
    'Eje Cafetero': [3800000],
    'Amazonía': [5100000],
  }
  t.topVendedores = makeTopVendedores(nombresVendedores[t.nombre], ventasBase[t.nombre])

  const nombresClientes: Record<string, string[]> = {
    'Bogotá': ['Outdoor Bogotá S.A.S', 'Colombia Trek', 'Alta Montaña Ltda', 'Camping Express', 'Naturaleza Viva'],
    'Medellín': ['Aventura Medellín S.A.S', 'Antioquia Trekking', 'Montaña Eterna'],
    'Cali': ['Trail Cali Ltda', 'Pacífico Aventura', 'Valle Trek'],
    'Costa Caribe': ['Caribe Outdoor', 'Costa Aventura', 'Mangle Travel'],
    'Santanderes': ['Santander Trek', 'Oriente Aventura', 'Cañón Chicamocha'],
    'Eje Cafetero': ['Cafetero Trek', 'Eje Aventura', 'Montaña Cafetera'],
    'Amazonía': ['Selva Amazonas S.A.S', 'Amazonía Trek', 'Pulmón Verde'],
  }
  t.topClientes = makeTopClientes(nombresClientes[t.nombre] ?? ['Cliente ' + t.nombre])
})

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export function getTerritorio(id: string): Territorio | undefined {
  return territorios.find((t) => t.id === id)
}
