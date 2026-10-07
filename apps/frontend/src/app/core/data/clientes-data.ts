// (sin iconos)
export type Cliente = {
  id: string
  nombre: string
  initials: string
  tipoIdentificacion: 'NIT' | 'CC' | 'CE'
  identificacion: string
  email: string
  telefono: string
  celular: string
  territorio: string
  ciudad: string
  departamento: string
  vendedorAsignado: string
  categoria: 'A' | 'B' | 'C'
  estado: 'Activo' | 'Inactivo'
  fechaCreacion: string
  ultimaCompra: string
  totalPedidos: number
  totalGastado: number
  direcciones: Direccion[]
  contactos: Contacto[]
}

export type Direccion = {
  id: string
  tipo: 'Principal' | 'Envío' | 'Facturación'
  linea: string
  ciudad: string
  departamento: string
  esPrincipal: boolean
}

export type Contacto = {
  id: string
  nombre: string
  initials: string
  cargo: string
  email: string
  telefono: string
  principal: boolean
}

export type PedidoCliente = {
  id: string
  fecha: string
  total: number
  estado: 'Completado' | 'Pendiente' | 'Cancelado'
}

export type HistorialCambio = {
  id: string
  fecha: string
  usuario: string
  accion: string
  detalle: string
  tipo: 'creacion' | 'edicion' | 'eliminacion'
}

export type ActividadCliente = {
  id: string
  fecha: string
  tipo: 'llamada' | 'correo' | 'reunion' | 'nota'
  descripcion: string
  realizadoPor: string
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const clientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Outdoor Bogotá S.A.S',
    initials: 'OB',
    tipoIdentificacion: 'NIT',
    identificacion: '900.123.456-7',
    email: 'ventas@outdoorbogota.co',
    telefono: '+57 601 234 5678',
    celular: '+57 310 123 4567',
    territorio: 'Andina',
    ciudad: 'Bogotá D.C.',
    departamento: 'Cundinamarca',
    vendedorAsignado: 'Laura M.',
    categoria: 'A',
    estado: 'Activo',
    fechaCreacion: '15/01/2024',
    ultimaCompra: '22/07/2026',
    totalPedidos: 47,
    totalGastado: 128400000,
    direcciones: [
      { id: 'd1', tipo: 'Principal', linea: 'Carrera 15 #88-34, Oficina 302', ciudad: 'Bogotá D.C.', departamento: 'Cundinamarca', esPrincipal: true },
      { id: 'd2', tipo: 'Envío', linea: 'Av. El Dorado #68C-25, Bodega 12', ciudad: 'Bogotá D.C.', departamento: 'Cundinamarca', esPrincipal: false },
    ],
    contactos: [
      { id: 'c1', nombre: 'Carlos Méndez', initials: 'CM', cargo: 'Gerente de Compras', email: 'carlos@outdoorbogota.co', telefono: '+57 310 111 2233', principal: true },
      { id: 'c2', nombre: 'Ana Torres', initials: 'AT', cargo: 'Auxiliar Administrativo', email: 'ana@outdoorbogota.co', telefono: '+57 310 111 2244', principal: false },
    ],
  },
  {
    id: '2',
    nombre: 'Aventura Medellín S.A.S',
    initials: 'AM',
    tipoIdentificacion: 'NIT',
    identificacion: '900.456.789-0',
    email: 'info@aventuramed.com',
    telefono: '+57 604 345 6789',
    celular: '+57 320 234 5678',
    territorio: 'Caribe',
    ciudad: 'Medellín',
    departamento: 'Antioquia',
    vendedorAsignado: 'Diego R.',
    categoria: 'A',
    estado: 'Activo',
    fechaCreacion: '03/03/2024',
    ultimaCompra: '18/07/2026',
    totalPedidos: 32,
    totalGastado: 89200000,
    direcciones: [
      { id: 'd3', tipo: 'Principal', linea: 'Calle 10 #42-15, Edificio Centro', ciudad: 'Medellín', departamento: 'Antioquia', esPrincipal: true },
    ],
    contactos: [
      { id: 'c3', nombre: 'Pedro Ramírez', initials: 'PR', cargo: 'CEO', email: 'pedro@aventuramed.com', telefono: '+57 320 333 4455', principal: true },
    ],
  },
  {
    id: '3',
    nombre: 'Trail Cali Ltda',
    initials: 'TC',
    tipoIdentificacion: 'NIT',
    identificacion: '900.789.012-3',
    email: 'compras@trailcali.com',
    telefono: '+57 602 456 7890',
    celular: '+57 315 345 6789',
    territorio: 'Pacífico',
    ciudad: 'Cali',
    departamento: 'Valle del Cauca',
    vendedorAsignado: 'Sofía P.',
    categoria: 'B',
    estado: 'Activo',
    fechaCreacion: '12/06/2024',
    ultimaCompra: '05/07/2026',
    totalPedidos: 28,
    totalGastado: 56100000,
    direcciones: [
      { id: 'd4', tipo: 'Principal', linea: 'Av. 3N #7-52, Local 101', ciudad: 'Cali', departamento: 'Valle del Cauca', esPrincipal: true },
      { id: 'd5', tipo: 'Facturación', linea: 'Calle 15 #4-08, Oficina 201', ciudad: 'Cali', departamento: 'Valle del Cauca', esPrincipal: false },
    ],
    contactos: [
      { id: 'c4', nombre: 'María Fernández', initials: 'MF', cargo: 'Jefe de Compras', email: 'maria@trailcali.com', telefono: '+57 315 555 6677', principal: true },
      { id: 'c5', nombre: 'Luis García', initials: 'LG', cargo: 'Auxiliar', email: 'luis@trailcali.com', telefono: '+57 315 555 6688', principal: false },
    ],
  },
  {
    id: '4',
    nombre: 'Montaña Bucaramanga',
    initials: 'MB',
    tipoIdentificacion: 'NIT',
    identificacion: '800.123.456-7',
    email: 'ventas@montanabga.com',
    telefono: '+57 607 567 8901',
    celular: '+57 300 456 7890',
    territorio: 'Oriente',
    ciudad: 'Bucaramanga',
    departamento: 'Santander',
    vendedorAsignado: 'Andrés G.',
    categoria: 'B',
    estado: 'Activo',
    fechaCreacion: '20/08/2024',
    ultimaCompra: '28/06/2026',
    totalPedidos: 15,
    totalGastado: 32400000,
    direcciones: [
      { id: 'd6', tipo: 'Principal', linea: 'Carrera 27 #45-12', ciudad: 'Bucaramanga', departamento: 'Santander', esPrincipal: true },
    ],
    contactos: [
      { id: 'c6', nombre: 'Diana Torres', initials: 'DT', cargo: 'Directora', email: 'diana@montanabga.com', telefono: '+57 300 777 8899', principal: true },
    ],
  },
  {
    id: '5',
    nombre: 'Selva Amazonas S.A.S',
    initials: 'SA',
    tipoIdentificacion: 'NIT',
    identificacion: '800.567.890-1',
    email: 'contacto@selvaamazonas.com',
    telefono: '+57 608 678 9012',
    celular: '+57 311 567 8901',
    territorio: 'Andina',
    ciudad: 'Leticia',
    departamento: 'Amazonas',
    vendedorAsignado: 'Camila T.',
    categoria: 'C',
    estado: 'Activo',
    fechaCreacion: '05/11/2024',
    ultimaCompra: '12/06/2026',
    totalPedidos: 8,
    totalGastado: 12800000,
    direcciones: [
      { id: 'd7', tipo: 'Principal', linea: 'Calle 11 #8-32', ciudad: 'Leticia', departamento: 'Amazonas', esPrincipal: true },
    ],
    contactos: [
      { id: 'c7', nombre: 'Jorge Pérez', initials: 'JP', cargo: 'Propietario', email: 'jorge@selvaamazonas.com', telefono: '+57 311 999 0011', principal: true },
    ],
  },
  {
    id: '6',
    nombre: 'Costa Caribe Outdoors',
    initials: 'CO',
    tipoIdentificacion: 'NIT',
    identificacion: '900.234.567-8',
    email: 'info@costacaribeout.com',
    telefono: '+57 605 789 0123',
    celular: '+57 301 234 5678',
    territorio: 'Caribe',
    ciudad: 'Barranquilla',
    departamento: 'Atlántico',
    vendedorAsignado: 'Diego R.',
    categoria: 'B',
    estado: 'Inactivo',
    fechaCreacion: '22/12/2024',
    ultimaCompra: '02/04/2026',
    totalPedidos: 12,
    totalGastado: 22400000,
    direcciones: [
      { id: 'd8', tipo: 'Principal', linea: 'Calle 72 #45-10, Centro Comercial', ciudad: 'Barranquilla', departamento: 'Atlántico', esPrincipal: true },
      { id: 'd9', tipo: 'Envío', linea: 'Zona Franca, Bodega 7', ciudad: 'Barranquilla', departamento: 'Atlántico', esPrincipal: false },
    ],
    contactos: [
      { id: 'c8', nombre: 'Roberto Sánchez', initials: 'RS', cargo: 'Gerente', email: 'roberto@costacaribeout.com', telefono: '+57 301 222 3344', principal: true },
    ],
  },
  {
    id: '7',
    nombre: 'EcoTrail Pereira',
    initials: 'EP',
    tipoIdentificacion: 'NIT',
    identificacion: '900.345.678-9',
    email: 'ventas@ecotrailpereira.com',
    telefono: '+57 606 890 1234',
    celular: '+57 313 678 9012',
    territorio: 'Pacífico',
    ciudad: 'Pereira',
    departamento: 'Risaralda',
    vendedorAsignado: 'Sofía P.',
    categoria: 'C',
    estado: 'Activo',
    fechaCreacion: '14/02/2025',
    ultimaCompra: '20/07/2026',
    totalPedidos: 6,
    totalGastado: 9800000,
    direcciones: [
      { id: 'd10', tipo: 'Principal', linea: 'Av. Circunvalar #12-34', ciudad: 'Pereira', departamento: 'Risaralda', esPrincipal: true },
    ],
    contactos: [
      { id: 'c9', nombre: 'Andrea Gómez', initials: 'AG', cargo: 'Administradora', email: 'andrea@ecotrailpereira.com', telefono: '+57 313 444 5566', principal: true },
    ],
  },
]

export const territories = ['Andina', 'Caribe', 'Pacífico', 'Oriente']
export const categories = ['A', 'B', 'C'] as const
export const statuses = ['Activo', 'Inactivo'] as const
export const sellers = ['Laura M.', 'Diego R.', 'Sofía P.', 'Andrés G.', 'Camila T.']

export function getCliente(id: string): Cliente | undefined {
  return clientes.find((c) => c.id === id)
}

export function getPedidosCliente(clienteId: string): PedidoCliente[] {
  const pedidos: Record<string, PedidoCliente[]> = {
    '1': [
      { id: 'PED-001', fecha: '22/07/2026', total: 12400000, estado: 'Completado' },
      { id: 'PED-002', fecha: '15/07/2026', total: 8900000, estado: 'Completado' },
      { id: 'PED-003', fecha: '08/07/2026', total: 5600000, estado: 'Pendiente' },
      { id: 'PED-004', fecha: '28/06/2026', total: 15200000, estado: 'Completado' },
      { id: 'PED-005', fecha: '15/06/2026', total: 7200000, estado: 'Cancelado' },
    ],
  }
  return pedidos[clienteId] ?? []
}

export function getHistorial(clienteId: string): HistorialCambio[] {
  const historial: Record<string, HistorialCambio[]> = {
    '1': [
      { id: 'h1', fecha: '22/07/2026 14:30', usuario: 'Laura M.', accion: 'Pedido completado', detalle: 'Se completó pedido PED-001 por $12.4M', tipo: 'edicion' },
      { id: 'h2', fecha: '15/07/2026 09:15', usuario: 'Laura M.', accion: 'Actualización de contacto', detalle: 'Se actualizó teléfono de Ana Torres', tipo: 'edicion' },
      { id: 'h3', fecha: '02/07/2026 11:00', usuario: 'Sistema', accion: 'Categoría actualizada', detalle: 'Cambio de categoría B a A', tipo: 'edicion' },
      { id: 'h4', fecha: '15/01/2024 08:00', usuario: 'Admin', accion: 'Cliente creado', detalle: 'Registro inicial del cliente', tipo: 'creacion' },
    ],
  }
  return historial[clienteId] ?? []
}

export function getActividad(clienteId: string): ActividadCliente[] {
  const actividad: Record<string, ActividadCliente[]> = {
    '1': [
      { id: 'a1', fecha: '22/07/2026 15:00', tipo: 'llamada', descripcion: 'Llamada de seguimiento post-venta. Cliente satisfecho.', realizadoPor: 'Laura M.' },
      { id: 'a2', fecha: '20/07/2026 10:30', tipo: 'correo', descripcion: 'Envío de cotización para nuevos productos de temporada.', realizadoPor: 'Laura M.' },
      { id: 'a3', fecha: '18/07/2026 08:45', tipo: 'reunion', descripcion: 'Reunión presencial para revisar catálogo de invierno.', realizadoPor: 'Laura M.' },
      { id: 'a4', fecha: '15/07/2026 16:20', tipo: 'nota', descripcion: 'Cliente interesado en líneas de calzado térmico.', realizadoPor: 'Sistema' },
    ],
  }
  return actividad[clienteId] ?? []
}

export type ActividadTipo = 'llamada' | 'correo' | 'reunion' | 'nota'
export const actividadTipos: { key: ActividadTipo; label: string; icon: string }[] = [
  { key: 'llamada', label: 'Llamada', icon: 'phone' },
  { key: 'correo', label: 'Correo', icon: 'mail' },
  { key: 'reunion', label: 'Reunión', icon: 'users' },
  { key: 'nota', label: 'Nota', icon: 'message-square' },
]
