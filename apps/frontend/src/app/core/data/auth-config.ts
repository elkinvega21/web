// Configuración y utilidades del módulo de autenticación (prototipo funcional).
// En producción esta lógica vive en el backend (Spring Boot + PostgreSQL).

export const AUTH_CONFIG = {
  maxAttempts: 3,
  lockSeconds: 30,
  otpLength: 6,
  otpResendSeconds: 30,
} as const

export type UserRole =
  | 'Administrador'
  | 'Gerente Comercial'
  | 'Supervisor'
  | 'Vendedor'

export type UserPreferences = {
  idioma: string
  tema: 'claro' | 'oscuro' | 'sistema'
  zonaHoraria: string
  formatoFecha: string
  formatoNumerico: string
  notificaciones: Record<string, boolean>
}

export type SessionUser = {
  name: string
  email: string
  role: UserRole
  initials: string
  apellido: string
  telefono: string
  cargo: string
  departamento: string
  biografia: string
  foto: string | null
  fechaRegistro: string
  ultimoAcceso: string
  preferencias: UserPreferences
  twoFactorEnabled: boolean
  expiracionPassword: string
}

// Cuenta de demostración para probar el flujo completo.
export const DEMO_USER = {
  email: 'admin@adventureretail.com',
  password: 'Admin2025!',
  user: {
    name: 'Laura',
    email: 'admin@adventureretail.com',
    role: 'Administrador' as UserRole,
    initials: 'LR',
    apellido: 'Restrepo',
    telefono: '+57 300 123 4567',
    cargo: 'Administradora del Sistema',
    departamento: 'Tecnología',
    biografia: 'Responsable de la administración y configuración del ERP. Más de 8 años de experiencia en sistemas empresariales.',
    foto: null,
    fechaRegistro: '2024-03-15',
    ultimoAcceso: '2026-07-29T08:30:00',
    preferencias: {
      idioma: 'es',
      tema: 'sistema',
      zonaHoraria: 'America/Bogota',
      formatoFecha: 'DD/MM/AAAA',
      formatoNumerico: '1.234,56',
      notificaciones: {
        nuevoPedido: true,
        pedidoCompletado: true,
        metaAlcanzada: true,
        nuevoCliente: true,
        clienteCumpleaños: false,
        stockBajo: true,
        stockCritico: true,
        promocionActivada: false,
        actualizacionDisponible: true,
        tareasAsignadas: true,
        alertasSeguridad: true,
      },
    },
    twoFactorEnabled: false,
    expiracionPassword: '2026-09-15',
  } satisfies SessionUser,
}

// Código OTP simulado para la verificación por correo.
export const DEMO_OTP = '482913'

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export type PasswordChecks = {
  length: boolean
  upper: boolean
  lower: boolean
  number: boolean
  symbol: boolean
}

export function checkPassword(value: string): PasswordChecks {
  return {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  }
}

export function passwordScore(value: string): number {
  const checks = checkPassword(value)
  return Object.values(checks).filter(Boolean).length
}

export function passwordStrengthLabel(score: number): {
  label: string
  tone: 'weak' | 'medium' | 'strong'
} {
  if (score <= 2) return { label: 'Débil', tone: 'weak' }
  if (score <= 4) return { label: 'Media', tone: 'medium' }
  return { label: 'Fuerte', tone: 'strong' }
}

// Simula latencia de red para mostrar estados de carga.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
