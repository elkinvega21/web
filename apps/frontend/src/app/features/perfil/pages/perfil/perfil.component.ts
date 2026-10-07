import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DEMO_USER, delay, passwordScore } from '../../../../core/data/auth-config';
import {
  ACTIVIDAD_MOCK,
  CATEGORIAS_NOTIFICACIONES,
  DEPARTAMENTOS,
  getActividadPorTipo,
  getDiasExpiracionPassword,
  getEstadoPassword,
  SESIONES_MOCK,
} from '../../../../core/data/perfil-data';
import type { Actividad, SesionActiva } from '../../../../core/data/perfil-data';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppPasswordInput } from '../../../../shared/components/password-input/password-input.component';
import { AppPasswordStrength } from '../../../../shared/components/password-strength/password-strength.component';

type PerfilTab = 'datos' | 'cuenta' | 'preferencias' | 'notificaciones' | 'seguridad' | 'sesiones' | 'actividad';

interface TabItem {
  id: PerfilTab;
  label: string;
  icon: string;
}

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

const TABS: TabItem[] = [
  { id: 'datos', label: 'Datos Personales', icon: 'user' },
  { id: 'cuenta', label: 'Mi Cuenta', icon: 'key-round' },
  { id: 'preferencias', label: 'Preferencias', icon: 'settings' },
  { id: 'notificaciones', label: 'Notificaciones', icon: 'bell' },
  { id: 'seguridad', label: 'Seguridad', icon: 'shield' },
  { id: 'sesiones', label: 'Sesiones Activas', icon: 'monitor' },
  { id: 'actividad', label: 'Actividad Reciente', icon: 'clock' },
];

const TEMAS = [
  { value: 'claro', icon: '☀️', label: 'Claro' },
  { value: 'oscuro', icon: '🌙', label: 'Oscuro' },
  { value: 'sistema', icon: '💻', label: 'Sistema' },
] as const;

const TIPOS_ACTIVIDAD = [
  { value: 'todas', label: 'Todas' },
  { value: 'login', label: 'Inicio sesión' },
  { value: 'logout', label: 'Cierre sesión' },
  { value: 'password', label: 'Cambio contraseña' },
  { value: 'perfil', label: 'Edición perfil' },
  { value: 'preferencia', label: 'Preferencias' },
  { value: 'nueva_sesion', label: 'Nueva sesión' },
];

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, AppButton, AppConfirmDialog, AppField, IconComponent, AppPasswordInput, AppPasswordStrength],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Mi Perfil</h1>
        <p class="text-sm text-muted-foreground">Gestiona tu información personal, preferencias y seguridad</p>
      </div>

      <div class="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside class="shrink-0 lg:w-56">
          <nav class="flex gap-1 overflow-x-auto border-b pb-2 lg:flex-col lg:gap-0.5 lg:border-b-0 lg:pb-0" aria-label="Secciones del perfil">
            @for (t of TABS; track t.id) {
              <button
                type="button"
                (click)="tab.set(t.id)"
                class="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                [class]="tabClass(t.id)"
              >
                <app-icon [name]="t.icon" [size]="16" class="shrink-0" />
                {{ t.label }}
              </button>
            }
          </nav>
        </aside>

        <div class="min-w-0 flex-1">
          <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            @switch (tab()) {
              @case ('datos') {
                <form (ngSubmit)="guardarDatosPersonales()">
                  <h2 class="mb-5 text-base font-semibold text-card-foreground">Datos Personales</h2>
                  <div class="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div class="group relative shrink-0">
                      <div class="flex size-28 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-3xl font-semibold text-primary">
                        @if (fotoPreview(); as prev) {
                          <img [src]="prev" alt="Preview" class="size-full object-cover" />
                        } @else {
                          {{ user.initials }}
                        }
                      </div>
                      <div
                        class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100"
                        (click)="fotoInput.click()"
                      >
                        <app-icon name="camera" [size]="24" class="text-background" />
                      </div>
                      <input #fotoInput type="file" accept="image/*" class="hidden" (change)="handleFotoChange($event)" aria-label="Cambiar foto de perfil" />
                      @if (fotoPreview()) {
                        <button
                          type="button"
                          (click)="eliminarFoto(fotoInput)"
                          class="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground"
                          aria-label="Eliminar foto"
                        >
                          <app-icon name="x" [size]="12" />
                        </button>
                      }
                    </div>
                    <div class="text-center sm:text-left">
                      <p class="text-base font-medium text-card-foreground">{{ nombre }} {{ apellido }}</p>
                      <p class="text-sm text-muted-foreground">{{ cargo }}</p>
                      <p class="mt-0.5 text-xs text-muted-foreground">Miembro desde {{ user.fechaRegistro }}</p>
                    </div>
                  </div>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <app-field id="nombre" label="Nombre">
                      <input appInput [(ngModel)]="nombre" name="nombre" type="text" />
                    </app-field>
                    <app-field id="apellido" label="Apellido">
                      <input appInput [(ngModel)]="apellido" name="apellido" type="text" />
                    </app-field>
                    <app-field id="email" label="Correo electrónico">
                      <input appInput [(ngModel)]="email" name="email" type="email" />
                    </app-field>
                    <app-field id="telefono" label="Teléfono">
                      <input appInput [(ngModel)]="telefono" name="telefono" type="tel" />
                    </app-field>
                    <app-field id="cargo" label="Cargo">
                      <input appInput [(ngModel)]="cargo" name="cargo" type="text" />
                    </app-field>
                    <app-field id="departamento" label="Departamento">
                      <select
                        [(ngModel)]="departamento"
                        name="departamento"
                        class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        @for (d of DEPARTAMENTOS; track d) {
                          <option [value]="d">{{ d }}</option>
                        }
                      </select>
                    </app-field>
                    <app-field id="biografia" label="Biografía" class="sm:col-span-2">
                      <textarea
                        appInput
                        [(ngModel)]="biografia"
                        name="biografia"
                        [attr.maxlength]="500"
                        rows="3"
                      ></textarea>
                      <p class="mt-1 text-right text-xs text-muted-foreground">{{ biografia.length }}/500</p>
                    </app-field>
                  </div>
                  <div class="mt-5 flex justify-end gap-2">
                    <button appButton type="button" variant="outline" size="lg" className="h-10">Cancelar</button>
                    <button appButton type="submit" size="lg" className="h-10">Guardar cambios</button>
                  </div>
                </form>
              }

              @case ('cuenta') {
                <div>
                  <h2 class="mb-5 text-base font-semibold text-card-foreground">Mi Cuenta</h2>
                  <div class="mb-6 grid gap-3 sm:grid-cols-2">
                    <div class="rounded-lg bg-muted/50 px-4 py-3">
                      <p class="text-[11px] text-muted-foreground">Correo</p>
                      <p class="text-sm font-medium text-card-foreground">{{ user.email }}</p>
                    </div>
                    <div class="rounded-lg bg-muted/50 px-4 py-3">
                      <p class="text-[11px] text-muted-foreground">Rol</p>
                      <p class="text-sm font-medium text-card-foreground">{{ user.role }}</p>
                    </div>
                    <div class="rounded-lg bg-muted/50 px-4 py-3">
                      <p class="text-[11px] text-muted-foreground">Fecha de registro</p>
                      <p class="text-sm font-medium text-card-foreground">{{ user.fechaRegistro }}</p>
                    </div>
                    <div class="rounded-lg bg-muted/50 px-4 py-3">
                      <p class="text-[11px] text-muted-foreground">Último acceso</p>
                      <p class="text-sm font-medium text-card-foreground">Hoy 08:15</p>
                    </div>
                  </div>
                  <hr class="mb-5 border-border" />
                  <h3 class="mb-4 text-sm font-semibold text-card-foreground">Cambiar contraseña</h3>
                  <form (ngSubmit)="handleChangePassword()" class="max-w-md space-y-4">
                    <app-field id="passActual" label="Contraseña actual">
                      <app-password-input [(ngModel)]="passActual" name="passActual" autocomplete="current-password" />
                    </app-field>
                    <app-field id="passNueva" label="Nueva contraseña">
                      <app-password-input [(ngModel)]="passNueva" name="passNueva" autocomplete="new-password" />
                      @if (passNueva) {
                        <app-password-strength [value]="passNueva" class="mt-2" />
                      }
                    </app-field>
                    <app-field
                      id="passConfirmar"
                      label="Confirmar nueva contraseña"
                      [error]="passConfirmar !== '' && passNueva !== passConfirmar ? 'Las contraseñas no coinciden' : null"
                    >
                      <app-password-input [(ngModel)]="passConfirmar" name="passConfirmar" autocomplete="new-password" />
                    </app-field>
                    <button
                      appButton
                      type="submit"
                      size="lg"
                      className="h-9 gap-1.5"
                      [disabled]="passLoading()"
                      [attr.disabled]="passLoading() || null"
                    >
                      @if (passLoading()) {
                        <app-icon name="loader-circle" [size]="16" class="animate-spin" />
                      }
                      Cambiar contraseña
                    </button>
                  </form>
                  <div class="mt-4 flex items-center gap-2 text-xs">
                    <span class="text-muted-foreground">Último cambio:</span>
                    <span class="font-medium" [class]="estadoPass().color">{{ diasExp() }} días ({{ estadoPass().label }})</span>
                  </div>
                </div>
              }

              @case ('preferencias') {
                <div>
                  <h2 class="mb-5 text-base font-semibold text-card-foreground">Preferencias</h2>
                  <div class="max-w-lg space-y-5">
                    <div>
                      <label class="text-xs font-medium text-muted-foreground">Idioma</label>
                      <select
                        [(ngModel)]="idioma"
                        name="idioma"
                        class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        <option value="es">🇪🇸 Español</option>
                        <option value="en">🇺🇸 English</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="pt">🇵🇹 Português</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-muted-foreground">Tema</label>
                      <div class="mt-1 flex gap-1 rounded-lg border border-input bg-background p-1">
                        @for (t of TEMAS; track t.value) {
                          <button
                            type="button"
                            (click)="setTema(t.value)"
                            class="flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors"
                            [class]="temaBtnClass(t.value)"
                          >
                            {{ t.icon }} {{ t.label }}
                          </button>
                        }
                      </div>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-muted-foreground">Zona horaria</label>
                      <select
                        [(ngModel)]="zonaHoraria"
                        name="zonaHoraria"
                        class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        <option value="America/Bogota">America/Bogota (UTC-5)</option>
                        <option value="America/Mexico_City">America/Mexico_City (UTC-6)</option>
                        <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires (UTC-3)</option>
                        <option value="America/Santiago">America/Santiago (UTC-4)</option>
                        <option value="America/Lima">America/Lima (UTC-5)</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-muted-foreground">Formato de fecha</label>
                      <select
                        [(ngModel)]="formatoFecha"
                        name="formatoFecha"
                        class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        <option value="DD/MM/AAAA">DD/MM/AAAA (29/07/2026)</option>
                        <option value="MM/DD/AAAA">MM/DD/AAAA (07/29/2026)</option>
                        <option value="AAAA-MM-DD">AAAA-MM-DD (2026-07-29)</option>
                      </select>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-muted-foreground">Formato numérico</label>
                      <select
                        [(ngModel)]="formatoNumerico"
                        name="formatoNumerico"
                        class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        <option value="1.234,56">1.234,56 (Colombia)</option>
                        <option value="1,234.56">1,234.56 (Internacional)</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-6 flex justify-end">
                    <button appButton size="lg" className="h-10" (click)="guardarPreferencias()">Guardar preferencias</button>
                  </div>
                </div>
              }

              @case ('notificaciones') {
                <div>
                  <h2 class="mb-1 text-base font-semibold text-card-foreground">Notificaciones</h2>
                  <p class="mb-5 text-sm text-muted-foreground">Configura qué notificaciones deseas recibir y por qué canal.</p>
                  <div class="max-w-lg space-y-4">
                    @for (cat of CATEGORIAS_NOTIFICACIONES; track cat.categoria) {
                      <div>
                        <p class="mb-2 text-xs font-medium text-muted-foreground">{{ cat.categoria }}</p>
                        <div class="space-y-2">
                          @for (item of cat.items; track item.key) {
                            <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                              <label [attr.for]="'notif-' + item.key" class="cursor-pointer text-sm text-card-foreground">{{ item.label }}</label>
                              <button
                                type="button"
                                role="switch"
                                [attr.id]="'notif-' + item.key"
                                [attr.aria-checked]="notificaciones[item.key]"
                                (click)="toggleNotificacion(item.key)"
                                class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full px-0.5 outline-none transition-colors"
                                [class.bg-primary]="notificaciones[item.key]"
                                [class.bg-input]="!(notificaciones[item.key])"
                                [class.justify-end]="notificaciones[item.key]"
                              >
                                <span class="pointer-events-none inline-block size-4 rounded-full bg-background shadow-sm transition-transform"></span>
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    }
                    <hr class="border-border" />
                    <div>
                      <label class="text-xs font-medium text-muted-foreground">Canal preferido</label>
                      <select
                        [(ngModel)]="canalPreferido"
                        name="canalPreferido"
                        class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                      >
                        <option value="ambos">Correo + Notificación in-app</option>
                        <option value="correo">Solo correo</option>
                        <option value="inapp">Solo notificación in-app</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-6 flex justify-end">
                    <button appButton size="lg" className="h-10" (click)="guardarPreferencias()">Guardar preferencias</button>
                  </div>
                </div>
              }

              @case ('seguridad') {
                <div>
                  <h2 class="mb-5 text-base font-semibold text-card-foreground">Seguridad</h2>
                  <div class="max-w-lg space-y-5">
                    <div class="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p class="text-sm font-medium text-card-foreground">Verificación en dos pasos (2FA)</p>
                        <p class="mt-0.5 text-xs text-muted-foreground">Añade una capa adicional de seguridad a tu cuenta</p>
                      </div>
                      <button
                        appButton
                        type="button"
                        size="sm"
                        className="h-8"
                        [variant]="twoFactor() ? 'destructive' : 'default'"
                        (click)="twoFactor() ? handleTwoFactorDeactivate() : handleTwoFactorActivate()"
                      >
                        {{ twoFactor() ? 'Desactivar' : 'Activar' }}
                      </button>
                    </div>
                    <div class="rounded-lg border border-border p-4">
                      <p class="mb-3 text-sm font-medium text-card-foreground">Dispositivos de confianza</p>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                          <div>
                            <p class="text-sm text-card-foreground">Windows 11 · Edge 128</p>
                            <p class="text-xs text-muted-foreground">Agregado el 15/07/2026</p>
                          </div>
                          <button type="button" class="text-xs text-destructive hover:underline">Revocar</button>
                        </div>
                        <div class="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                          <div>
                            <p class="text-sm text-card-foreground">Samsung Galaxy S25 · Chrome</p>
                            <p class="text-xs text-muted-foreground">Agregado el 20/07/2026</p>
                          </div>
                          <button type="button" class="text-xs text-destructive hover:underline">Revocar</button>
                        </div>
                      </div>
                    </div>
                    <div class="rounded-lg border border-border p-4">
                      <p class="mb-1 text-sm font-medium text-card-foreground">Aplicaciones conectadas</p>
                      <p class="text-xs text-muted-foreground">No hay aplicaciones conectadas a tu cuenta.</p>
                    </div>
                  </div>
                </div>
              }

              @case ('sesiones') {
                <div>
                  <div class="mb-5 flex items-center justify-between">
                    <div>
                      <h2 class="text-base font-semibold text-card-foreground">Sesiones Activas</h2>
                      <p class="mt-0.5 text-xs text-muted-foreground">{{ sesiones().length }} sesión(es) activa(s)</p>
                    </div>
                    @if (otherSessionsCount() > 0) {
                      <button
                        appButton
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-1.5"
                        (click)="confirmCerrarTodas.set(true)"
                      >
                        <app-icon name="log-out" [size]="14" />
                        Cerrar otras sesiones
                      </button>
                    }
                  </div>
                  <div class="space-y-2">
                    @for (s of sesiones(); track s.id) {
                      <div class="flex items-center justify-between rounded-lg border p-3" [class]="s.esActual ? 'border-primary/30 bg-primary/5' : 'border-border'">
                        <div class="flex min-w-0 items-center gap-3">
                          <app-icon [name]="sesionIcono(s.icono)" [size]="16" class="shrink-0 text-muted-foreground" />
                          <div class="min-w-0">
                            <div class="flex items-center gap-2">
                              <p class="truncate text-sm font-medium text-card-foreground">{{ s.dispositivo }}</p>
                              @if (s.esActual) {
                                <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Tu sesión</span>
                              }
                            </div>
                            <p class="text-xs text-muted-foreground">{{ s.navegador }} · {{ s.ip }} · {{ s.ubicacion }}</p>
                            <p class="text-xs text-muted-foreground">Inicio: {{ s.inicio }} · Última actividad: {{ s.ultimaActividad }}</p>
                          </div>
                        </div>
                        @if (!s.esActual) {
                          <button
                            appButton
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 shrink-0 px-2.5"
                            [disabled]="cerrandoSesionId() === s.id"
                            [attr.disabled]="cerrandoSesionId() === s.id || null"
                            (click)="cerrarSesion(s.id)"
                          >
                            @if (cerrandoSesionId() === s.id) {
                              <app-icon name="loader-circle" [size]="12" class="animate-spin" />
                            } @else {
                              <app-icon name="x" [size]="12" />
                            }
                            Cerrar
                          </button>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              @case ('actividad') {
                <div>
                  <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-base font-semibold text-card-foreground">Actividad Reciente</h2>
                    <select
                      [ngModel]="filtroActividad()"
                      name="filtroActividad"
                      (ngModelChange)="filtroActividad.set($event)"
                      class="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
                    >
                      @for (t of TIPOS_ACTIVIDAD; track t.value) {
                        <option [value]="t.value">{{ t.label }}</option>
                      }
                    </select>
                  </div>
                  <div class="space-y-0">
                    @if (actividadFiltrada().length === 0) {
                      <p class="py-8 text-center text-sm text-muted-foreground">No hay actividad de este tipo.</p>
                    }
                    @for (a of actividadFiltrada(); track a.id) {
                      <div class="flex gap-3">
                        <div class="flex flex-col items-center">
                          <span class="flex size-8 items-center justify-center rounded-full bg-muted">
                            <app-icon [name]="actividadIcono(a.tipo)" [size]="16" [class]="actividadIconoClass(a.tipo)" />
                          </span>
                          @if (!$last) {
                            <div class="w-px flex-1 bg-border"></div>
                          }
                        </div>
                        <div [class.pb-4]="!$last">
                          <p class="text-sm text-card-foreground">{{ a.descripcion }}</p>
                          <p class="text-xs text-muted-foreground">{{ a.relativo }}</p>
                        </div>
                      </div>
                    }
                  </div>
                  @if (actividadFiltrada().length > 0) {
                    <div class="mt-4 text-center">
                      <button
                        appButton
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1"
                        [disabled]="cargandoMas()"
                        [attr.disabled]="cargandoMas() || null"
                        (click)="cargarMasActividad()"
                      >
                        @if (cargandoMas()) {
                          <app-icon name="loader-circle" [size]="12" class="animate-spin" />
                        } @else {
                          <app-icon name="chevron-right" [size]="12" />
                        }
                        Cargar más
                      </button>
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>

      @if (showTwoFactorModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]" (click)="showTwoFactorModal.set(false)">
          <div class="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg" (click)="$event.stopPropagation()">
            <h3 class="text-base font-semibold text-card-foreground">Activar 2FA</h3>
            @if (twoFactorStep() === 'qr') {
              <p class="mt-2 text-sm text-muted-foreground">Escanea el siguiente código QR con tu app de autenticación (Google Authenticator, Authy, etc.)</p>
              <div class="my-4 flex justify-center">
                <div class="flex size-40 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                  <app-icon name="camera" [size]="40" class="text-muted-foreground/50" />
                </div>
              </div>
              <p class="text-center text-xs text-muted-foreground">Código: <span class="font-mono text-card-foreground">ARERP-2FA-2026</span></p>
              <button appButton type="button" size="lg" className="mt-4 h-9 w-full" (click)="twoFactorStep.set('verify')">Ya escaneé el código</button>
            } @else {
              <p class="mt-2 text-sm text-muted-foreground">Ingresa el código de 6 dígitos generado por tu app de autenticación.</p>
              <input
                type="text"
                [value]="twoFactorCode"
                (input)="onTwoFactorCodeInput($event)"
                placeholder="000000"
                [attr.maxlength]="6"
                class="mt-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-center font-mono text-lg tracking-widest text-foreground placeholder:text-muted-foreground/50"
              />
              <div class="mt-4 flex gap-2">
                <button appButton type="button" variant="outline" size="lg" className="h-9 flex-1" (click)="showTwoFactorModal.set(false)">Cancelar</button>
                <button
                  appButton
                  type="button"
                  size="lg"
                  className="h-9 flex-1"
                  [disabled]="twoFactorCode.length !== 6"
                  [attr.disabled]="twoFactorCode.length !== 6 || null"
                  (click)="confirmTwoFactor()"
                >
                  Verificar
                </button>
              </div>
            }
          </div>
        </div>
      }

      <app-confirm-dialog
        [(open)]="confirmCerrarTodas"
        icon="log-out"
        title="¿Cerrar todas las demás sesiones?"
        description="Se cerrarán todas las sesiones activas excepto la actual. Tendrás que iniciar sesión nuevamente en esos dispositivos."
        confirmLabel="Cerrar todas"
        [loading]="cerrandoTodas()"
        (confirm)="cerrarTodasSesiones()"
      />

      <div class="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
        @for (t of toasts(); track t.id) {
          <div
            class="flex items-start gap-3 rounded-xl border border-l-4 border-border bg-card p-4 shadow-lg animate-in slide-in-from-right"
            [style.border-left-color]="toastBorderColor(t.type)"
          >
            <app-icon [name]="toastIcon(t.type)" [size]="20" class="mt-0.5 shrink-0" [class]="toastIconClass(t.type)" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-card-foreground">{{ t.title }}</p>
              @if (t.description) {
                <p class="mt-0.5 text-xs text-muted-foreground">{{ t.description }}</p>
              }
            </div>
            <button type="button" (click)="removeToast(t.id)" class="shrink-0 text-muted-foreground hover:text-foreground">
              <app-icon name="x" [size]="16" />
            </button>
          </div>
        }
      </div>
    </div>
  `,
})
export class PerfilComponent {
  readonly user = DEMO_USER.user;

  readonly tab = signal<PerfilTab>('datos');
  readonly fotoPreview = signal<string | null>(null);
  readonly toasts = signal<ToastItem[]>([]);

  nombre = this.user.name;
  apellido = this.user.apellido;
  email = this.user.email;
  telefono = this.user.telefono;
  cargo = this.user.cargo;
  departamento = this.user.departamento;
  biografia = this.user.biografia;

  passActual = '';
  passNueva = '';
  passConfirmar = '';
  readonly passLoading = signal(false);

  idioma = this.user.preferencias.idioma;
  tema: 'claro' | 'oscuro' | 'sistema' = this.user.preferencias.tema;
  zonaHoraria = this.user.preferencias.zonaHoraria;
  formatoFecha = this.user.preferencias.formatoFecha;
  formatoNumerico = this.user.preferencias.formatoNumerico;
  notificaciones: Record<string, boolean> = { ...this.user.preferencias.notificaciones };
  canalPreferido = 'ambos';

  readonly sesiones = signal<SesionActiva[]>(SESIONES_MOCK);
  readonly cerrandoSesionId = signal<string | null>(null);
  readonly cerrandoTodas = signal(false);
  readonly confirmCerrarTodas = signal(false);

  readonly filtroActividad = signal('todas');
  readonly actividades = signal<Actividad[]>(ACTIVIDAD_MOCK);
  readonly cargandoMas = signal(false);

  readonly twoFactor = signal<boolean>(this.user.twoFactorEnabled);
  readonly showTwoFactorModal = signal(false);
  readonly twoFactorStep = signal<'qr' | 'verify'>('qr');
  twoFactorCode = '';

  readonly actividadFiltrada = computed(() => getActividadPorTipo(this.actividades(), this.filtroActividad()));
  readonly diasExp = computed(() => getDiasExpiracionPassword(this.user.expiracionPassword));
  readonly estadoPass = computed(() => getEstadoPassword(this.diasExp()));

  readonly TABS = TABS;
  readonly TEMAS = TEMAS;
  readonly TIPOS_ACTIVIDAD = TIPOS_ACTIVIDAD;
  readonly CATEGORIAS_NOTIFICACIONES = CATEGORIAS_NOTIFICACIONES;
  readonly DEPARTAMENTOS = DEPARTAMENTOS;

  tabClass(id: PerfilTab): string {
    if (this.tab() === id) {
      return 'bg-primary/10 text-primary lg:border-l-[3px] lg:rounded-l-none lg:pl-[9px]';
    }
    return 'text-muted-foreground hover:bg-muted hover:text-foreground';
  }

  setTema(tema: 'claro' | 'oscuro' | 'sistema'): void {
    this.tema = tema;
  }

  temaBtnClass(tema: string): string {
    const base = 'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors';
    return tema === this.tema ? `${base} bg-primary text-primary-foreground` : `${base} text-muted-foreground hover:text-foreground`;
  }

  toggleNotificacion(key: string): void {
    this.notificaciones = { ...this.notificaciones, [key]: !(this.notificaciones[key] ?? false) };
  }

  sesionIcono(tipo: SesionActiva['icono']): string {
    return tipo === 'laptop' ? 'laptop' : tipo === 'smartphone' ? 'smartphone' : 'tablet';
  }

  actividadIcono(tipo: Actividad['tipo']): string {
    if (tipo === 'login' || tipo === 'logout') return 'log-out';
    if (tipo === 'password') return 'key-round';
    if (tipo === 'perfil') return 'user';
    if (tipo === 'preferencia') return 'settings';
    return 'monitor';
  }

  actividadIconoClass(tipo: Actividad['tipo']): string {
    if (tipo === 'login') return 'rotate-180 text-success';
    if (tipo === 'logout') return 'text-muted-foreground';
    if (tipo === 'password') return 'text-warning';
    if (tipo === 'perfil') return 'text-primary';
    if (tipo === 'preferencia') return 'text-primary';
    return 'text-success';
  }

  otherSessionsCount(): number {
    return this.sesiones().filter((s) => !s.esActual).length;
  }

  addToast(t: Omit<ToastItem, 'id'>): void {
    const id = Date.now().toString();
    this.toasts.update((prev) => [...prev, { ...t, id }]);
    if (t.type !== 'error') {
      setTimeout(() => {
        this.toasts.update((prev) => prev.filter((x) => x.id !== id));
      }, 3500);
    }
  }

  removeToast(id: string): void {
    this.toasts.update((prev) => prev.filter((x) => x.id !== id));
  }

  toastIcon(type: ToastItem['type']): string {
    return type === 'success' ? 'circle-check-big' : type === 'error' ? 'triangle-alert' : 'info';
  }

  toastIconClass(type: ToastItem['type']): string {
    return type === 'success' ? 'text-success' : type === 'error' ? 'text-destructive' : 'text-primary';
  }

  toastBorderColor(type: ToastItem['type']): string {
    return type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--destructive)' : 'var(--primary)';
  }

  async guardarDatosPersonales(): Promise<void> {
    await delay(600);
    this.addToast({ type: 'success', title: 'Datos guardados', description: 'Tu información personal se actualizó correctamente.' });
  }

  handleFotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.fotoPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  eliminarFoto(input: HTMLInputElement): void {
    this.fotoPreview.set(null);
    input.value = '';
  }

  async handleChangePassword(): Promise<void> {
    if (this.passNueva !== this.passConfirmar) {
      this.addToast({ type: 'error', title: 'Las contraseñas no coinciden' });
      return;
    }
    if (passwordScore(this.passNueva) < 4) {
      this.addToast({ type: 'error', title: 'La contraseña no cumple la política de seguridad' });
      return;
    }
    this.passLoading.set(true);
    await delay(1200);
    this.passLoading.set(false);
    this.passActual = '';
    this.passNueva = '';
    this.passConfirmar = '';
    this.addToast({ type: 'success', title: 'Contraseña cambiada', description: 'Tu contraseña se actualizó correctamente.' });
  }

  async guardarPreferencias(): Promise<void> {
    await delay(500);
    this.addToast({ type: 'success', title: 'Preferencias guardadas' });
  }

  async cerrarSesion(sessionId: string): Promise<void> {
    this.cerrandoSesionId.set(sessionId);
    await delay(500);
    this.sesiones.update((prev) => prev.filter((s) => s.id !== sessionId));
    this.cerrandoSesionId.set(null);
    this.addToast({ type: 'success', title: 'Sesión cerrada' });
  }

  async cerrarTodasSesiones(): Promise<void> {
    this.cerrandoTodas.set(true);
    await delay(800);
    this.sesiones.update((prev) => prev.filter((s) => s.esActual));
    this.cerrandoTodas.set(false);
    this.confirmCerrarTodas.set(false);
    this.addToast({ type: 'success', title: 'Sesiones cerradas', description: 'Se cerraron todas las demás sesiones.' });
  }

  async cargarMasActividad(): Promise<void> {
    this.cargandoMas.set(true);
    await delay(1000);
    const extras = ACTIVIDAD_MOCK.slice(0, 5).map((a) => ({ ...a, id: `extra-${Date.now()}-${a.id}` }));
    this.actividades.update((prev) => [...prev, ...extras]);
    this.cargandoMas.set(false);
  }

  handleTwoFactorActivate(): void {
    this.twoFactorStep.set('qr');
    this.twoFactorCode = '';
    this.showTwoFactorModal.set(true);
  }

  handleTwoFactorDeactivate(): void {
    this.twoFactor.set(false);
    this.addToast({ type: 'info', title: '2FA desactivado' });
  }

  async confirmTwoFactor(): Promise<void> {
    await delay(800);
    this.twoFactor.set(true);
    this.showTwoFactorModal.set(false);
    this.addToast({ type: 'success', title: '2FA activado', description: 'La verificación en dos pasos está activa.' });
  }

  onTwoFactorCodeInput(event: Event): void {
    this.twoFactorCode = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 6);
  }
}
