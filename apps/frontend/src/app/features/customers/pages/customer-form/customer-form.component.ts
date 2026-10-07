import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppInput, appInputBaseClass } from '../../../../shared/components/input/input.component';
import { categories, clientes, getCliente, sellers, statuses, territories } from '../../../../core/data/clientes-data';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [FormsModule, IconComponent, AppConfirmDialog, AppField, AppInput],
  template: `
    <form (ngSubmit)="onSubmit()" novalidate class="mx-auto max-w-4xl space-y-6 pb-10">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <button type="button" (click)="goBack()" aria-label="Volver a clientes"
            class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <app-icon name="chevron-left" [size]="20" />
          </button>
          <div>
            <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ isEdit ? 'Editar cliente' : 'Nuevo cliente' }}</h1>
            <p class="mt-1 text-sm text-muted-foreground">{{ isEdit ? 'Actualiza la información del cliente.' : 'Completa la información para registrar un nuevo cliente.' }}</p>
          </div>
        </div>
        @if (isEdit) {
          <button type="button" (click)="goDelete()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
            <app-icon name="trash-2" [size]="16" /> Eliminar cliente
          </button>
        }
      </div>

      @if (existing) {
        <div class="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">{{ existing.initials }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-foreground">{{ existing.nombre }}</p>
            <p class="truncate text-xs text-muted-foreground">{{ existing.identificacion }} · {{ existing.email }}</p>
          </div>
          <span [class]="estadoClass(existing.estado)">{{ existing.estado }}</span>
        </div>
      }

      <div class="rounded-xl border border-border bg-card p-5">
        <h2 class="text-sm font-semibold text-foreground">Información básica</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <app-field label="Tipo de identificación" id="tipoIdentificacion">
            <select id="tipoIdentificacion" name="tipoIdentificacion" required [ngModel]="tipoIdentificacion"
              (ngModelChange)="onChange('tipoIdentificacion', $event)" (blur)="onBlur('tipoIdentificacion')"
              [class]="appInputBaseClass" [attr.aria-invalid]="errorFor('tipoIdentificacion') ? 'true' : null">
              <option value="NIT">NIT</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="CE">Cédula de extranjería</option>
            </select>
          </app-field>
          <app-field label="Número de identificación" id="identificacion" [error]="errorFor('identificacion')">
            <input appInput id="identificacion" name="identificacion" required [ngModel]="identificacion"
              (ngModelChange)="onChange('identificacion', $event)" (blur)="onBlur('identificacion')"
              placeholder="Ej. 900123456" inputmode="numeric"
              [attr.aria-invalid]="errorFor('identificacion') ? 'true' : null"
              [attr.aria-describedby]="errorFor('identificacion') ? 'identificacion-error' : null" />
          </app-field>
          <app-field label="Nombre / Razón social" id="nombre" [error]="errorFor('nombre')" class="sm:col-span-2">
            <input appInput id="nombre" name="nombre" required [ngModel]="nombre"
              (ngModelChange)="onChange('nombre', $event)" (blur)="onBlur('nombre')"
              placeholder="Ej. Distribuidora La Sabana S.A.S."
              [attr.aria-invalid]="errorFor('nombre') ? 'true' : null"
              [attr.aria-describedby]="errorFor('nombre') ? 'nombre-error' : null" />
          </app-field>
          <app-field label="Email" id="email" [error]="errorFor('email')">
            <input appInput id="email" name="email" type="email" required [ngModel]="email"
              (ngModelChange)="onChange('email', $event)" (blur)="onBlur('email')"
              placeholder="contacto@empresa.com"
              [attr.aria-invalid]="errorFor('email') ? 'true' : null"
              [attr.aria-describedby]="errorFor('email') ? 'email-error' : null" />
          </app-field>
          <app-field label="Teléfono" id="telefono" [error]="errorFor('telefono')">
            <input appInput id="telefono" name="telefono" required [ngModel]="telefono"
              (ngModelChange)="onChange('telefono', $event)" (blur)="onBlur('telefono')"
              placeholder="Ej. 601 745 8899" inputmode="tel"
              [attr.aria-invalid]="errorFor('telefono') ? 'true' : null"
              [attr.aria-describedby]="errorFor('telefono') ? 'telefono-error' : null" />
          </app-field>
          <app-field label="Celular" id="celular">
            <input appInput id="celular" name="celular" [ngModel]="celular"
              (ngModelChange)="onChange('celular', $event)" (blur)="onBlur('celular')"
              placeholder="Ej. 310 555 6677" inputmode="tel" />
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-5">
        <h2 class="text-sm font-semibold text-foreground">Ubicación</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <app-field label="Ciudad" id="ciudad" [error]="errorFor('ciudad')">
            <input appInput id="ciudad" name="ciudad" required [ngModel]="ciudad"
              (ngModelChange)="onChange('ciudad', $event)" (blur)="onBlur('ciudad')"
              placeholder="Ej. Bogotá"
              [attr.aria-invalid]="errorFor('ciudad') ? 'true' : null"
              [attr.aria-describedby]="errorFor('ciudad') ? 'ciudad-error' : null" />
          </app-field>
          <app-field label="Departamento" id="departamento">
            <input appInput id="departamento" name="departamento" [ngModel]="departamento"
              (ngModelChange)="onChange('departamento', $event)" (blur)="onBlur('departamento')"
              placeholder="Ej. Cundinamarca" />
          </app-field>
          <app-field label="Territorio" id="territorio" [error]="errorFor('territorio')" class="sm:col-span-2">
            <select id="territorio" name="territorio" required [ngModel]="territorio"
              (ngModelChange)="onChange('territorio', $event)" (blur)="onBlur('territorio')"
              [class]="appInputBaseClass" [attr.aria-invalid]="errorFor('territorio') ? 'true' : null"
              [attr.aria-describedby]="errorFor('territorio') ? 'territorio-error' : null">
              <option value="" disabled>Selecciona un territorio</option>
              @for (t of territories; track t) {
                <option [value]="t">{{ t }}</option>
              }
            </select>
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-5">
        <h2 class="text-sm font-semibold text-foreground">Asignación</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-3">
          <app-field label="Vendedor asignado" id="vendedorAsignado" [error]="errorFor('vendedorAsignado')"
            class="sm:col-span-3">
            <select id="vendedorAsignado" name="vendedorAsignado" required [ngModel]="vendedorAsignado"
              (ngModelChange)="onChange('vendedorAsignado', $event)" (blur)="onBlur('vendedorAsignado')"
              [class]="appInputBaseClass" [attr.aria-invalid]="errorFor('vendedorAsignado') ? 'true' : null"
              [attr.aria-describedby]="errorFor('vendedorAsignado') ? 'vendedorAsignado-error' : null">
              <option value="" disabled>Selecciona un vendedor</option>
              @for (s of sellers; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </app-field>
          <app-field label="Categoría" id="categoria">
            <select id="categoria" name="categoria" required [ngModel]="categoria"
              (ngModelChange)="onChange('categoria', $event)" (blur)="onBlur('categoria')"
              [class]="appInputBaseClass">
              @for (c of categories; track c) {
                <option [value]="c">{{ categoriaLabel(c) }}</option>
              }
            </select>
          </app-field>
          <app-field label="Estado" id="estado">
            <select id="estado" name="estado" required [ngModel]="estado"
              (ngModelChange)="onChange('estado', $event)" (blur)="onBlur('estado')"
              [class]="appInputBaseClass">
              @for (s of statuses; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-5">
        <h2 class="text-sm font-semibold text-foreground">Dirección principal</h2>
        <div class="mt-4 grid gap-4">
          <app-field label="Dirección" id="direccion" [error]="errorFor('direccion')">
            <input appInput id="direccion" name="direccion" required [ngModel]="direccion"
              (ngModelChange)="onChange('direccion', $event)" (blur)="onBlur('direccion')"
              placeholder="Ej. Cra 12 # 34-56, Edificio Torre Norte"
              [attr.aria-invalid]="errorFor('direccion') ? 'true' : null"
              [attr.aria-describedby]="errorFor('direccion') ? 'direccion-error' : null" />
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-5">
        <h2 class="text-sm font-semibold text-foreground">Contacto principal</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <app-field label="Nombre del contacto" id="contactoNombre" [error]="errorFor('contactoNombre')">
            <input appInput id="contactoNombre" name="contactoNombre" required [ngModel]="contactoNombre"
              (ngModelChange)="onChange('contactoNombre', $event)" (blur)="onBlur('contactoNombre')"
              placeholder="Ej. María Fernanda Ruiz"
              [attr.aria-invalid]="errorFor('contactoNombre') ? 'true' : null"
              [attr.aria-describedby]="errorFor('contactoNombre') ? 'contactoNombre-error' : null" />
          </app-field>
          <app-field label="Cargo" id="contactoCargo">
            <input appInput id="contactoCargo" name="contactoCargo" [ngModel]="contactoCargo"
              (ngModelChange)="onChange('contactoCargo', $event)" (blur)="onBlur('contactoCargo')"
              placeholder="Ej. Gerente de compras" />
          </app-field>
          <app-field label="Email del contacto" id="contactoEmail">
            <input appInput id="contactoEmail" name="contactoEmail" type="email" [ngModel]="contactoEmail"
              (ngModelChange)="onChange('contactoEmail', $event)" (blur)="onBlur('contactoEmail')"
              placeholder="mfernanda@empresa.com" />
          </app-field>
          <app-field label="Teléfono del contacto" id="contactoTelefono">
            <input appInput id="contactoTelefono" name="contactoTelefono" [ngModel]="contactoTelefono"
              (ngModelChange)="onChange('contactoTelefono', $event)" (blur)="onBlur('contactoTelefono')"
              placeholder="Ej. 310 222 3344" inputmode="tel" />
          </app-field>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2">
        <button type="button" (click)="goBack()"
          class="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancelar</button>
        <button type="submit" [disabled]="saving()"
          class="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
          @if (saving()) {
            <app-icon name="loader-2" [size]="16" />
          }
          {{ saving() ? 'Guardando…' : (isEdit ? 'Guardar cambios' : 'Crear cliente') }}
        </button>
      </div>
    </form>

    <app-confirm-dialog [(open)]="deleteOpen" icon="circle-alert" title="Eliminar cliente"
      [description]="deleteDescription" confirmLabel="Eliminar cliente" [loading]="deleting()"
      (confirm)="confirmDelete()" />
  `,
})
export class CustomerFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly customerId = this.route.snapshot.paramMap.get('id');
  readonly isEdit = !!this.customerId;
  readonly existing = this.customerId ? getCliente(this.customerId) : undefined;

  readonly saving = signal(false);
  readonly errors = signal<Record<string, string>>({});
  readonly touched = signal<Set<string>>(new Set());
  readonly deleteOpen = signal(false);
  readonly deleting = signal(false);

  readonly territories = territories;
  readonly sellers = sellers;
  readonly categories = categories;
  readonly statuses = statuses;

  tipoIdentificacion: 'NIT' | 'CC' | 'CE' = this.existing?.tipoIdentificacion ?? 'NIT';
  identificacion = this.existing?.identificacion ?? '';
  nombre = this.existing?.nombre ?? '';
  email = this.existing?.email ?? '';
  telefono = this.existing?.telefono ?? '';
  celular = this.existing?.celular ?? '';
  ciudad = this.existing?.ciudad ?? '';
  departamento = this.existing?.departamento ?? '';
  territorio = this.existing?.territorio ?? '';
  vendedorAsignado = this.existing?.vendedorAsignado ?? '';
  categoria: 'A' | 'B' | 'C' = this.existing?.categoria ?? 'B';
  estado: 'Activo' | 'Inactivo' = this.existing?.estado ?? 'Activo';
  direccion = this.existing?.direcciones[0]?.linea ?? '';
  contactoNombre = this.existing?.contactos[0]?.nombre ?? '';
  contactoEmail = this.existing?.contactos[0]?.email ?? '';
  contactoTelefono = this.existing?.contactos[0]?.telefono ?? '';
  contactoCargo = this.existing?.contactos[0]?.cargo ?? '';

  readonly deleteDescription = this.existing
    ? `Esta acción no se puede deshacer. Se eliminará permanentemente el cliente ${this.existing.nombre} (${this.existing.identificacion}) y todos sus datos asociados.`
    : '';

  get appInputBaseClass(): string {
    return appInputBaseClass;
  }

  errorFor(field: string): string | null {
    return this.errors()[field] ?? null;
  }

  onChange(field: string, value: string): void {
    (this as unknown as Record<string, string>)[field] = value;
    if (this.touched().has(field)) {
      this.errors.update((prev) => ({ ...prev, [field]: this.validate()[field] }));
    }
  }

  onBlur(field: string): void {
    this.touched.update((s) => new Set(s).add(field));
    this.errors.update((prev) => ({ ...prev, [field]: this.validate()[field] }));
  }

  private validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!this.identificacion.trim()) {
      errs['identificacion'] = 'Requerido';
    } else if (this.identificacion.trim().length < 5) {
      errs['identificacion'] = 'Mínimo 5 caracteres';
    }
    if (!this.nombre.trim()) {
      errs['nombre'] = 'Requerido';
    }
    if (!this.email.trim()) {
      errs['email'] = 'Requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      errs['email'] = 'Email inválido';
    }
    if (!this.telefono.trim()) {
      errs['telefono'] = 'Requerido';
    }
    if (!this.ciudad.trim()) {
      errs['ciudad'] = 'Requerido';
    }
    if (!this.territorio) {
      errs['territorio'] = 'Selecciona un territorio';
    }
    if (!this.vendedorAsignado) {
      errs['vendedorAsignado'] = 'Selecciona un vendedor';
    }
    if (!this.direccion.trim()) {
      errs['direccion'] = 'Requerido';
    }
    if (!this.contactoNombre.trim()) {
      errs['contactoNombre'] = 'Requerido';
    }
    return errs;
  }

  onSubmit(): void {
    const errs = this.validate();
    this.errors.set(errs);
    if (Object.keys(errs).length > 0) {
      this.touched.update((s) => new Set([...s, ...Object.keys(errs)]));
      return;
    }
    this.saving.set(true);
    window.setTimeout(() => {
      this.saving.set(false);
      if (this.isEdit && this.customerId) {
        this.router.navigate(['/clientes', this.customerId]);
      } else {
        const nextId = String(clientes.length + 1);
        this.router.navigate(['/clientes', nextId]);
      }
    }, 1200);
  }

  goBack(): void {
    this.router.navigate(['/clientes']);
  }

  goDelete(): void {
    this.deleteOpen.set(true);
  }

  confirmDelete(): void {
    if (!this.customerId) {
      return;
    }
    this.deleting.set(true);
    window.setTimeout(() => {
      const index = clientes.findIndex((c) => c.id === this.customerId);
      if (index !== -1) {
        clientes.splice(index, 1);
      }
      this.deleting.set(false);
      this.router.navigate(['/clientes']);
    }, 900);
  }

  categoriaLabel(categoria: 'A' | 'B' | 'C'): string {
    return categoria === 'A' ? 'A — Premium' : categoria === 'B' ? 'B — Estándar' : 'C — Básico';
  }

  estadoClass(estado: string): string {
    return estado === 'Activo'
      ? 'inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600'
      : 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground';
  }
}
