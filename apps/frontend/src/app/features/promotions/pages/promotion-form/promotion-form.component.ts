import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppInput, AppTextarea, appInputBaseClass } from '../../../../shared/components/input/input.component';
import { AppCheckbox } from '../../../../shared/components/checkbox/checkbox.component';
import { getPromocion, promociones, tiposPromo } from '../../../../core/data/promociones-data';
import { formatCurrency, getCategoria, productos } from '../../../../core/data/productos-data';
import type { Promocion } from '../../../../core/data/promociones-data';

interface ProductoOption {
  id: string;
  nombre: string;
  categoria: string;
  selected: ReturnType<typeof signal<boolean>>;
}

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [FormsModule, IconComponent, AppField, AppInput, AppTextarea, AppCheckbox],
  template: `
    <form (ngSubmit)="onSubmit()" novalidate class="mx-auto max-w-4xl space-y-6 pb-10">
      <div class="mb-6 flex items-center gap-4">
        <button type="button" (click)="goBack()" aria-label="Volver a promociones"
          class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <app-icon name="arrow-left" [size]="20" />
        </button>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ titulo }}</h1>
            @if (esDuplicado) {
              <app-icon name="copy" [size]="16" class="text-muted-foreground" />
            }
          </div>
          <p class="text-sm text-muted-foreground">{{ subtitulo }}</p>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Información general</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <app-field label="Nombre *" id="nombre" [error]="errorFor('nombre')" class="sm:col-span-2">
            <input appInput id="nombre" name="nombre" required [ngModel]="nombre"
              (ngModelChange)="onChange('nombre', $event)" (blur)="onBlur('nombre')"
              [attr.aria-invalid]="errorFor('nombre') ? 'true' : null"
              [attr.aria-describedby]="errorFor('nombre') ? 'nombre-error' : null" />
          </app-field>
          <app-field label="Descripción" id="descripcion" class="sm:col-span-2">
            <textarea appInput [className]="'resize-none'" id="descripcion" name="descripcion" rows="3"
              [ngModel]="descripcion" (ngModelChange)="descripcion = $event" (blur)="onBlur('descripcion')"></textarea>
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Descuento</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <app-field label="Tipo" id="tipo">
            <select id="tipo" name="tipo" [ngModel]="tipo" (ngModelChange)="onChange('tipo', $event)"
              [class]="appInputBaseClass">
              @for (t of tipos; track t) {
                <option [value]="t">{{ t }}</option>
              }
            </select>
          </app-field>
          <app-field [label]="valorLabel()" id="valor" [error]="errorFor('valor')">
            <input appInput id="valor" name="valor" type="number" min="0" [ngModel]="valor"
              (ngModelChange)="onChange('valor', $event)" (blur)="onBlur('valor')" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('valor') ? 'true' : null"
              [attr.aria-describedby]="errorFor('valor') ? 'valor-error' : null" />
          </app-field>
          <div class="flex items-end pb-1">
            <div class="w-full rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">{{ valorEjemplo() }}</div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Fechas y condiciones</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <app-field label="Fecha de inicio *" id="fechaInicio" [error]="errorFor('fechaInicio')">
            <input appInput id="fechaInicio" name="fechaInicio" [ngModel]="fechaInicio"
              (ngModelChange)="onChange('fechaInicio', $event)" (blur)="onBlur('fechaInicio')"
              placeholder="DD/MM/AAAA" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('fechaInicio') ? 'true' : null"
              [attr.aria-describedby]="errorFor('fechaInicio') ? 'fechaInicio-error' : null" />
          </app-field>
          <app-field label="Fecha de fin *" id="fechaFin" [error]="errorFor('fechaFin')">
            <input appInput id="fechaFin" name="fechaFin" [ngModel]="fechaFin"
              (ngModelChange)="onChange('fechaFin', $event)" (blur)="onBlur('fechaFin')"
              placeholder="DD/MM/AAAA" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('fechaFin') ? 'true' : null"
              [attr.aria-describedby]="errorFor('fechaFin') ? 'fechaFin-error' : null" />
          </app-field>
          <app-field label="Compra mínima ($)" id="aplicaMinimo">
            <input appInput id="aplicaMinimo" name="aplicaMinimo" type="number" min="0" [ngModel]="aplicaMinimo"
              (ngModelChange)="aplicaMinimo = $event" (blur)="onBlur('aplicaMinimo')" [className]="'font-mono'" />
          </app-field>
          <app-field label="Estado" id="estado">
            <select id="estado" name="estado" [ngModel]="estado" (ngModelChange)="onChange('estado', $event)"
              [class]="appInputBaseClass">
              @for (e of estados; track e) {
                <option [value]="e">{{ e }}</option>
              }
            </select>
          </app-field>
          <app-field label="Condiciones / Restricciones" id="condiciones" class="sm:col-span-2">
            <textarea appInput [className]="'resize-none'" id="condiciones" name="condiciones" rows="2"
              [ngModel]="condiciones" (ngModelChange)="condiciones = $event" (blur)="onBlur('condiciones')"></textarea>
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Productos asociados ({{ selectedCount() }})</h2>
        <div class="max-h-48 space-y-1 overflow-y-auto">
          @for (prod of productoOptions(); track prod.id) {
            <div (click)="toggleProducto(prod)"
              class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
              [class]="prodRowClass(prod)">
              <app-checkbox [(checked)]="prod.selected" (click)="$event.stopPropagation()" />
              <span class="flex-1">{{ prod.nombre }}</span>
              <span class="text-xs text-muted-foreground">{{ prod.categoria }}</span>
            </div>
          }
        </div>
        @if (selectedCount() === 0) {
          <p class="mt-2 text-xs text-muted-foreground">Selecciona los productos que aplican a esta promoción</p>
        }
      </div>

      <div class="flex items-center justify-end gap-3 pb-8">
        <button type="button" (click)="goBack()"
          class="inline-flex h-9 items-center rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">Cancelar</button>
        <button type="submit" [disabled]="saving()"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
          @if (saving()) {
            <app-icon name="loader-circle" [size]="16" class="animate-spin" />
          } @else {
            <app-icon name="save" [size]="16" />
          }
          {{ saving() ? 'Guardando…' : (esEdit ? 'Guardar cambios' : (esDuplicado ? 'Crear copia' : 'Crear promoción')) }}
        </button>
      </div>
    </form>
  `,
})
export class PromotionFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tipos = tiposPromo;
  readonly estados = ['Activa', 'Programada', 'Vencida', 'Desactivada'];

  readonly esDuplicado = !!this.route.snapshot.queryParamMap.get('duplicar');
  readonly promotionId = this.route.snapshot.paramMap.get('id');
  readonly esEdit = !!this.promotionId && !this.esDuplicado;
  readonly source: Promocion | undefined = this.esDuplicado
    ? getPromocion(this.route.snapshot.queryParamMap.get('duplicar') ?? '')
    : this.promotionId
      ? getPromocion(this.promotionId)
      : undefined;

  readonly titulo = this.esDuplicado
    ? 'Duplicar promoción'
    : this.esEdit
      ? 'Editar promoción'
      : 'Nueva promoción';
  readonly subtitulo = this.esDuplicado
    ? 'Creando una copia a partir de una existente'
    : this.esEdit
      ? `Editando ${this.source?.nombre ?? ''}`
      : 'Registra una nueva promoción';

  readonly saving = signal(false);
  readonly errors = signal<Record<string, string>>({});
  readonly touched = signal<Set<string>>(new Set());

  nombre = this.route.snapshot.queryParamMap.get('nombre') ?? this.source?.nombre ?? '';
  descripcion = this.source?.descripcion ?? '';
  tipo = this.source?.tipo ?? 'Porcentaje';
  valor = this.source ? String(this.source.valor) : '';
  fechaInicio = this.source?.fechaInicio ?? '';
  fechaFin = this.source?.fechaFin ?? '';
  condiciones = this.source?.condiciones ?? '';
  aplicaMinimo = this.source ? String(this.source.aplicaMinimo) : '';
  estado = this.source?.estado ?? 'Activa';

  readonly productoOptions = signal<ProductoOption[]>(
    productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: getCategoria(p.categoriaId)?.nombre ?? '',
      selected: signal(this.source?.productos?.includes(p.id) ?? false),
    })),
  );

  readonly selectedCount = computed(() => this.productoOptions().filter((o) => o.selected()).length);

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
    if (!this.nombre.trim()) {
      errs['nombre'] = 'El nombre es obligatorio';
    }
    const v = parseFloat(this.valor);
    if (!this.valor || isNaN(v) || v <= 0) {
      errs['valor'] = 'Debe ser mayor a 0';
    }
    if (!this.fechaInicio.trim()) {
      errs['fechaInicio'] = 'Fecha de inicio requerida';
    }
    if (!this.fechaFin.trim()) {
      errs['fechaFin'] = 'Fecha de fin requerida';
    }
    return errs;
  }

  toggleProducto(prod: ProductoOption): void {
    prod.selected.update((s) => !s);
  }

  prodRowClass(prod: ProductoOption): string {
    return prod.selected() ? 'bg-primary/5 text-primary' : 'text-card-foreground hover:bg-muted';
  }

  valorLabel(): string {
    switch (this.tipo) {
      case 'Porcentaje':
        return 'Porcentaje (%)';
      case 'Monto fijo':
        return 'Monto ($)';
      case '2x1':
        return 'Ahorro (%)';
      default:
        return 'Descuento combo (%)';
    }
  }

  valorEjemplo(): string {
    const v = parseFloat(this.valor) || 0;
    switch (this.tipo) {
      case 'Porcentaje':
        return `Ej: ${this.valor || '0'}% de descuento`;
      case 'Monto fijo':
        return `Ej: ${formatCurrency(v)} off`;
      case '2x1':
        return 'Lleva 2, paga 1';
      default:
        return 'Combo con descuento';
    }
  }

  onSubmit(): void {
    const errs = this.validate();
    this.errors.set(errs);
    this.touched.update((s) => new Set([...s, ...Object.keys(errs)]));
    if (Object.keys(errs).length > 0) {
      return;
    }
    this.saving.set(true);
    window.setTimeout(() => {
      this.saving.set(false);
      if (this.esEdit && this.promotionId) {
        this.router.navigate(['/promociones', this.promotionId]);
      } else {
        const nextId = 'PROMO-' + String(promociones.length + 1).padStart(3, '0');
        this.router.navigate(['/promociones', nextId]);
      }
    }, 900);
  }

  goBack(): void {
    this.router.navigate(['/promociones']);
  }
}
