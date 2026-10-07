export type Categoria = {
  id: string
  nombre: string
  icono: string
}

export type Promocion = {
  descuento: number
  vigenciaInicio: string
  vigenciaFin: string
  activa: boolean
}

export type Producto = {
  id: string
  sku: string
  nombre: string
  descripcion: string
  categoriaId: string
  precio: number
  costo: number
  margen: number
  stock: number
  stockMinimo: number
  unidad: string
  estado: 'Activo' | 'Inactivo' | 'Descatalogado'
  promocion?: Promocion
  relacionados: string[]
  creado: string
  actualizado: string
}

export const categorias: Categoria[] = [
  { id: 'ropa', nombre: 'Ropa', icono: '👕' },
  { id: 'calzado', nombre: 'Calzado', icono: '👟' },
  { id: 'camping', nombre: 'Camping', icono: '⛺' },
  { id: 'accesorios', nombre: 'Accesorios', icono: '🔦' },
  { id: 'equipaje', nombre: 'Equipaje', icono: '🎒' },
]

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value)
}

export const productos: Producto[] = [
  {
    id: 'PROD-001', sku: 'ROP-CHA-001', nombre: 'Chaqueta Térmica X2',
    descripcion: 'Chaqueta térmica con capa exterior cortaviento e interior polar desmontable. Ideal para altitudes superiores a 3000 m.',
    categoriaId: 'ropa', precio: 180000, costo: 108000, margen: 40, stock: 45, stockMinimo: 15, unidad: 'unidad', estado: 'Activo',
    promocion: { descuento: 15, vigenciaInicio: '01/08/2026', vigenciaFin: '31/08/2026', activa: true },
    relacionados: ['PROD-003', 'PROD-007'], creado: '10/01/2026', actualizado: '20/07/2026',
  },
  {
    id: 'PROD-002', sku: 'ROP-CAM-002', nombre: 'Camiseta DryFit',
    descripcion: 'Camiseta transpirable de secado rápido para actividades al aire libre. Costuras planas antirozaduras.',
    categoriaId: 'ropa', precio: 55000, costo: 33000, margen: 40, stock: 120, stockMinimo: 30, unidad: 'unidad', estado: 'Activo',
    relacionados: ['PROD-003', 'PROD-014'], creado: '15/02/2026', actualizado: '18/07/2026',
  },
  {
    id: 'PROD-003', sku: 'ROP-PAN-003', nombre: 'Pantalón Cargo Explorer',
    descripcion: 'Pantalón cargo con 6 bolsillos, tela ripstop y refuerzos en rodillas. Ideal para trekking y expediciones.',
    categoriaId: 'ropa', precio: 120000, costo: 72000, margen: 40, stock: 8, stockMinimo: 20, unidad: 'unidad', estado: 'Activo',
    relacionados: ['PROD-001', 'PROD-006'], creado: '01/03/2026', actualizado: '25/07/2026',
  },
  {
    id: 'PROD-004', sku: 'CAL-BOT-004', nombre: 'Botas Trail Pro',
    descripcion: 'Bota de trekking impermeable con membrana GORE-TEX, suela Vibram y puntera reforzada.',
    categoriaId: 'calzado', precio: 280000, costo: 168000, margen: 40, stock: 25, stockMinimo: 10, unidad: 'par', estado: 'Activo',
    promocion: { descuento: 10, vigenciaInicio: '15/07/2026', vigenciaFin: '15/08/2026', activa: true },
    relacionados: ['PROD-005', 'PROD-013'], creado: '05/01/2026', actualizado: '22/07/2026',
  },
  {
    id: 'PROD-005', sku: 'CAL-ZAP-005', nombre: 'Zapatillas Running Trail',
    descripcion: 'Zapatilla ligera para trail running con amortiguación reactiva y suela multidireccional.',
    categoriaId: 'calzado', precio: 195000, costo: 117000, margen: 40, stock: 3, stockMinimo: 15, unidad: 'par', estado: 'Activo',
    relacionados: ['PROD-004', 'PROD-014'], creado: '20/02/2026', actualizado: '28/07/2026',
  },
  {
    id: 'PROD-006', sku: 'CAL-CAR-006', nombre: 'Carpa Summit 4P',
    descripcion: 'Carpa para 4 personas con doble techo, piso impermeable y ventilación cruzada. Incluye bolsa de compresión.',
    categoriaId: 'camping', precio: 320000, costo: 192000, margen: 40, stock: 12, stockMinimo: 8, unidad: 'unidad', estado: 'Activo',
    promocion: { descuento: 20, vigenciaInicio: '01/07/2026', vigenciaFin: '31/08/2026', activa: true },
    relacionados: ['PROD-007', 'PROD-012'], creado: '01/01/2026', actualizado: '15/07/2026',
  },
  {
    id: 'PROD-007', sku: 'CAM-SAC-007', nombre: 'Saco Dormir -10°C',
    descripcion: 'Saco de dormir con relleno de pluma de ganso, temperatura confort -5°C, límite -10°C. Compacto y ligero.',
    categoriaId: 'camping', precio: 200000, costo: 120000, margen: 40, stock: 18, stockMinimo: 10, unidad: 'unidad', estado: 'Activo',
    relacionados: ['PROD-006', 'PROD-011'], creado: '10/02/2026', actualizado: '20/07/2026',
  },
  {
    id: 'PROD-008', sku: 'CAM-KIT-008', nombre: 'Kit Cocina Camping',
    descripcion: 'Set de cocina para camping con olla, sartén, platos, cubiertos y hornillo plegable. 12 piezas.',
    categoriaId: 'camping', precio: 95000, costo: 57000, margen: 40, stock: 30, stockMinimo: 12, unidad: 'unidad', estado: 'Activo',
    promocion: { descuento: 25, vigenciaInicio: '01/07/2026', vigenciaFin: '30/09/2026', activa: true },
    relacionados: ['PROD-009', 'PROD-012'], creado: '01/03/2026', actualizado: '25/07/2026',
  },
  {
    id: 'PROD-009', sku: 'ACC-LIN-009', nombre: 'Linterna Recargable LED',
    descripcion: 'Linterna LED recargable USB-C con 3 modos de luz, resistencia IP68 y autonomía de 12 horas.',
    categoriaId: 'accesorios', precio: 80000, costo: 48000, margen: 40, stock: 2, stockMinimo: 20, unidad: 'unidad', estado: 'Activo',
    relacionados: ['PROD-010', 'PROD-011'], creado: '15/01/2026', actualizado: '29/07/2026',
  },
  {
    id: 'PROD-010', sku: 'ACC-TER-010', nombre: 'Termo 1L Acero',
    descripcion: 'Termo de acero inoxidable con doble pared al vacío. Mantiene bebidas calientes 12h / frías 24h.',
    categoriaId: 'accesorios', precio: 55000, costo: 33000, margen: 40, stock: 60, stockMinimo: 25, unidad: 'unidad', estado: 'Activo',
    relacionados: ['PROD-011', 'PROD-009'], creado: '20/02/2026', actualizado: '15/07/2026',
  },
  {
    id: 'PROD-011', sku: 'ACC-CAN-011', nombre: 'Cantimplora 750ml',
    descripcion: 'Cantimplora ligera de aluminio con funda de tela y mosquetón. Ideal para excursiones cortas.',
    categoriaId: 'accesorios', precio: 35000, costo: 21000, margen: 40, stock: 0, stockMinimo: 30, unidad: 'unidad', estado: 'Inactivo',
    relacionados: ['PROD-010', 'PROD-009'], creado: '01/04/2026', actualizado: '28/07/2026',
  },
  {
    id: 'PROD-012', sku: 'ACC-BAS-012', nombre: 'Bastones Trekking Ajustables',
    descripcion: 'Par de bastones de trekking de aluminio 7075, ajustables de 65 a 135 cm. Empuñadura ergonómica.',
    categoriaId: 'accesorios', precio: 95000, costo: 57000, margen: 40, stock: 22, stockMinimo: 10, unidad: 'par', estado: 'Activo',
    relacionados: ['PROD-006', 'PROD-007'], creado: '10/03/2026', actualizado: '20/07/2026',
  },
  {
    id: 'PROD-013', sku: 'EQU-MOC-013', nombre: 'Mochila 45L Trail',
    descripcion: 'Mochila de 45 litros con espalda ergonómica, cubierta impermeable y compartimento para hidratación.',
    categoriaId: 'equipaje', precio: 210000, costo: 126000, margen: 40, stock: 15, stockMinimo: 8, unidad: 'unidad', estado: 'Activo',
    promocion: { descuento: 10, vigenciaInicio: '01/08/2026', vigenciaFin: '31/08/2026', activa: true },
    relacionados: ['PROD-014', 'PROD-004'], creado: '05/01/2026', actualizado: '22/07/2026',
  },
  {
    id: 'PROD-014', sku: 'EQU-MAL-014', nombre: 'Maleta Viaje 60L',
    descripcion: 'Maleta rígida con 4 ruedas dobles, candado TSA y compartimento interior organizador.',
    categoriaId: 'equipaje', precio: 260000, costo: 156000, margen: 40, stock: 0, stockMinimo: 5, unidad: 'unidad', estado: 'Descatalogado',
    relacionados: ['PROD-013', 'PROD-002'], creado: '01/02/2026', actualizado: '01/07/2026',
  },
]

export function getCategoria(id: string): Categoria | undefined {
  return categorias.find((c) => c.id === id)
}

export function getProducto(id: string): Producto | undefined {
  return productos.find((p) => p.id === id)
}

export function getProductosRelacionados(ids: string[]): Producto[] {
  return productos.filter((p) => ids.includes(p.id))
}
