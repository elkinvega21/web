import { vendedores } from './vendedores-data'
import { pedidos } from './pedidos-data'
import { productos } from './productos-data'
import { clientes } from './clientes-data'
import { territorios } from './territorios-data'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export type ReporteGeneral = {
  ventasTotales: number
  ventasMes: number
  ventasPeriodoAnterior: number
  crecimiento: number
  totalPedidos: number
  pedidosPendientes: number
  pedidosCompletados: number
  pedidosFacturados: number
  totalClientes: number
  clientesActivos: number
  totalProductos: number
  productosActivos: number
  stockBajo: number
  valorInventario: number
  totalVendedores: number
  vendedoresActivos: number
  comisionesTotales: number
  ticketPromedio: number
}

export type VentaPorDia = { dia: string; ventas: number; pedidos: number }
export type SerieMensual = { mes: string; valor: number; anterior?: number }
export type TopItem = { nombre: string; valor: number; label?: string }

export function getReporteGeneral(): ReporteGeneral {
  const activos = vendedores.filter((v) => v.estado === 'Activo')
  const ventasTotales = vendedores.reduce((s, v) => s + v.ventasTotales, 0)
  const ventasMes = vendedores.reduce((s, v) => s + v.ventasMes, 0)
  const ventasAnterior = vendedores.reduce((s, v) => s + v.ventasPeriodoAnterior, 0)
  const totalClientes = clientes.length
  const clientesActivos = clientes.filter((c) => c.estado === 'Activo').length
  const prodsActivos = productos.filter((p) => p.estado === 'Activo')
  const stockBajo = productos.filter((p) => p.stockMinimo > 0 && p.stock > 0 && p.stock <= p.stockMinimo).length
  const valorInv = productos.reduce((s, p) => s + p.costo * p.stock, 0)

  return {
    ventasTotales,
    ventasMes,
    ventasPeriodoAnterior: ventasAnterior,
    crecimiento: ventasAnterior > 0 ? Math.round(((ventasMes - ventasAnterior / 6) / (ventasAnterior / 6)) * 100) : 0,
    totalPedidos: pedidos.length,
    pedidosPendientes: pedidos.filter((p) => p.estado === 'Pendiente').length,
    pedidosCompletados: pedidos.filter((p) => p.estado === 'Completado').length,
    pedidosFacturados: pedidos.filter((p) => p.estado === 'Facturado').length,
    totalClientes,
    clientesActivos,
    totalProductos: productos.length,
    productosActivos: prodsActivos.length,
    stockBajo,
    valorInventario: valorInv,
    totalVendedores: vendedores.length,
    vendedoresActivos: activos.length,
    comisionesTotales: vendedores.reduce((s, v) => s + v.comisionTotal, 0),
    ticketPromedio: totalClientes > 0 ? Math.round(ventasTotales / totalClientes) : 0,
  }
}

export function getVentasPorDia(): VentaPorDia[] {
  return [
    { dia: 'Lun', ventas: 4200000, pedidos: 12 },
    { dia: 'Mar', ventas: 3800000, pedidos: 10 },
    { dia: 'Mié', ventas: 5100000, pedidos: 15 },
    { dia: 'Jue', ventas: 4600000, pedidos: 13 },
    { dia: 'Vie', ventas: 6200000, pedidos: 18 },
    { dia: 'Sáb', ventas: 7800000, pedidos: 22 },
    { dia: 'Dom', ventas: 2900000, pedidos: 8 },
  ]
}

export function getVentasMensuales(): SerieMensual[] {
  const meses = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
  const ventas = [28500000, 30200000, 31800000, 29500000, 33500000, 35200000]
  const anterior = [27000000, 28800000, 30100000, 28200000, 31000000, 32500000]
  return meses.map((mes, i) => ({ mes, valor: ventas[i], anterior: anterior[i] }))
}

export function getClientesPorTerritorio(): TopItem[] {
  return territorios.map((t) => ({ nombre: t.nombre, valor: t.clientes }))
}

export function getTopProductos(): TopItem[] {
  return [...productos]
    .sort((a, b) => b.precio * b.stock - a.precio * a.stock)
    .slice(0, 8)
    .map((p) => ({ nombre: p.nombre, valor: p.precio * p.stock, label: `${p.stock} uds` }))
}

export function getPedidosPorEstado(): TopItem[] {
  return [
    { nombre: 'Completados', valor: pedidos.filter((p) => p.estado === 'Completado').length },
    { nombre: 'Pendientes', valor: pedidos.filter((p) => p.estado === 'Pendiente').length },
    { nombre: 'Facturados', valor: pedidos.filter((p) => p.estado === 'Facturado').length },
    { nombre: 'Cancelados', valor: pedidos.filter((p) => p.estado === 'Cancelado').length },
  ]
}

export function getVentasPorVendedor(): TopItem[] {
  return [...vendedores]
    .filter((v) => v.estado === 'Activo')
    .sort((a, b) => b.ventasMes - a.ventasMes)
    .map((v) => ({ nombre: v.nombre, valor: v.ventasMes, label: `${v.cumplimientoMeta}% meta` }))
}

export function getCumplimientoMetas(): TopItem[] {
  return [...vendedores]
    .filter((v) => v.estado === 'Activo')
    .sort((a, b) => b.ventasMes - a.ventasMes)
    .map((v) => ({ nombre: v.nombre, valor: v.cumplimientoMeta }))
}

export function getVentasPorTerritorio(): TopItem[] {
  return [...territorios]
    .sort((a, b) => b.ventasMes - a.ventasMes)
    .map((t) => ({ nombre: t.nombre, valor: t.ventasMes, label: `${t.participacion}%` }))
}

export function getStockPorCategoria(): TopItem[] {
  const cats = ['Ropa', 'Calzado', 'Camping', 'Accesorios', 'Equipaje']
  const catMap: Record<string, string> = { ropa: 'Ropa', calzado: 'Calzado', camping: 'Camping', accesorios: 'Accesorios', equipaje: 'Equipaje' }
  return cats.map((cat) => {
    const total = productos.filter((p) => catMap[p.categoriaId] === cat).reduce((s, p) => s + p.stock, 0)
    return { nombre: cat, valor: total }
  })
}

export function getCrecimientoClientes(): SerieMensual[] {
  const meses = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
  return meses.map((mes, i) => ({ mes, valor: 20 + i * 4 + Math.round(Math.random() * 5) }))
}
