import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppInput, AppTextarea, appInputBaseClass } from '../../../../shared/components/input/input.component';
import { categorias, formatCurrency, getProducto, productos } from '../../../../core/data/productos-data';
import type { Producto } from '../../../../core/data/productos-data';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, IconComponent, AppField, AppInput, AppTextarea],
  template: `
    <form (ngSubmit)="onSubmit()" novalidate class="space-y-6">
      <div class="mb-6 flex items-center gap-4">
        <button type="button" (click)="goBack()" aria-label="Volver"
          class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <app-icon name="arrow-left" [size]="20" />
        </button>
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ titulo }}</h1>
          <p class="text-sm text-muted-foreground">{{ subtitulo }}</p>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Información básica</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <app-field label="Nombre *" id="nombre" [error]="errorFor('nombre')">
            <input appInput id="nombre" name="nombre" required [ngModel]="nombre"
              (ngModelChange)="onChange('nombre', $event)" (blur)="onBlur('nombre')"
              [attr.aria-invalid]="errorFor('nombre') ? 'true' : null"
              [attr.aria-describedby]="errorFor('nombre') ? 'nombre-error' : null" />
          </app-field>
          <app-field label="SKU *" id="sku" [error]="errorFor('sku')">
            <input appInput id="sku" name="sku" required [ngModel]="sku"
              (ngModelChange)="onChange('sku', $event)" (blur)="onBlur('sku')" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('sku') ? 'true' : null"
              [attr.aria-describedby]="errorFor('sku') ? 'sku-error' : null" />
          </app-field>
          <app-field label="Categoría" id="categoriaId">
            <select id="categoriaId" name="categoriaId" [ngModel]="categoriaId"
              (ngModelChange)="categoriaId = $event" [class]="appInputBaseClass">
              @for (c of categorias; track c.id) {
                <option [value]="c.id">{{ c.nombre }}</option>
              }
            </select>
          </app-field>
          <app-field label="Estado" id="estado">
            <select id="estado" name="estado" [ngModel]="estado" (ngModelChange)="estado = $event"
              [class]="appInputBaseClass">
              @for (e of estados; track e) {
                <option [value]="e">{{ e }}</option>
              }
            </select>
          </app-field>
          <app-field label="Descripción" id="descripcion" class="sm:col-span-2">
            <textarea appInput [className]="'resize-none'" id="descripcion" name="descripcion" rows="3"
              [ngModel]="descripcion" (ngModelChange)="descripcion = $event" (blur)="onBlur('descripcion')"></textarea>
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Precios</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <app-field label="Precio de venta *" id="precio" [error]="errorFor('precio')">
            <input appInput id="precio" name="precio" type="number" min="0" required [ngModel]="precio"
              (ngModelChange)="onChange('precio', $event)" (blur)="onBlur('precio')" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('precio') ? 'true' : null"
              [attr.aria-describedby]="errorFor('precio') ? 'precio-error' : null" />
          </app-field>
          <app-field label="Costo *" id="costo" [error]="errorFor('costo')">
            <input appInput id="costo" name="costo" type="number" min="0" required [ngModel]="costo"
              (ngModelChange)="onChange('costo', $event)" (blur)="onBlur('costo')" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('costo') ? 'true' : null"
              [attr.aria-describedby]="errorFor('costo') ? 'costo-error' : null" />
          </app-field>
          <div>
            <label class="block text-xs font-medium text-muted-foreground" for="margen">Margen</label>
            <div [class]="margenBoxClass()" id="margen">{{ margenLabel() }}</div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <h2 class="mb-4 text-sm font-semibold text-card-foreground">Inventario</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <app-field label="Stock actual *" id="stock" [error]="errorFor('stock')">
            <input appInput id="stock" name="stock" type="number" min="0" required [ngModel]="stock"
              (ngModelChange)="onChange('stock', $event)" (blur)="onBlur('stock')" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('stock') ? 'true' : null"
              [attr.aria-describedby]="errorFor('stock') ? 'stock-error' : null" />
          </app-field>
          <app-field label="Stock mínimo" id="stockMinimo" [error]="errorFor('stockMinimo')">
            <input appInput id="stockMinimo" name="stockMinimo" type="number" min="0" [ngModel]="stockMinimo"
              (ngModelChange)="onChange('stockMinimo', $event)" (blur)="onBlur('stockMinimo')" [className]="'font-mono'"
              [attr.aria-invalid]="errorFor('stockMinimo') ? 'true' : null"
              [attr.aria-describedby]="errorFor('stockMinimo') ? 'stockMinimo-error' : null" />
          </app-field>
          <app-field label="Unidad" id="unidad">
            <select id="unidad" name="unidad" [ngModel]="unidad" (ngModelChange)="unidad = $event"
              [class]="appInputBaseClass">
              <option value="unidad">Unidad</option>
              <option value="par">Par</option>
              <option value="kg">Kilogramo</option>
              <option value="litro">Litro</option>
            </select>
          </app-field>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-card-foreground">Promoción</h2>
          <label class="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" [checked]="promoActiva" (change)="onPromoActivaChange($event)" class="rounded border-input" />
            Activar promoción
          </label>
        </div>
        @if (promoActiva) {
          <div class="grid gap-4 sm:grid-cols-3">
            <app-field label="Descuento (%)" id="promoDescuento">
              <input appInput id="promoDescuento" name="promoDescuento" type="number" min="0" max="100"
                [ngModel]="promoDescuento" (ngModelChange)="promoDescuento = $event" [className]="'font-mono'" />
            </app-field>
            <app-field label="Vigencia inicio" id="promoInicio">
              <input appInput id="promoInicio" name="promoInicio" [ngModel]="promoInicio"
                (ngModelChange)="promoInicio = $event" placeholder="DD/MM/AAAA" [className]="'font-mono'" />
            </app-field>
            <app-field label="Vigencia fin" id="promoFin">
              <input appInput id="promoFin" name="promoFin" [ngModel]="promoFin"
                (ngModelChange)="promoFin = $event" placeholder="DD/MM/AAAA" [className]="'font-mono'" />
            </app-field>
            @if (precioConDescuento(); as discounted) {
              <div class="rounded-lg bg-primary/5 p-3 sm:col-span-3">
                <p class="text-sm font-medium text-primary">
                  Precio con descuento: <span class="font-mono">{{ discounted }}</span>
                </p>
              </div>
            }
          </div>
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
          {{ saving() ? 'Guardando…' : (isEdit ? 'Guardar cambios' : 'Crear producto') }}
        </button>
      </div>
    </form>
  `,
})
export class ProductFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categorias = categorias;

  readonly estados = ['Activo', 'Inactivo', 'Descatalogado'];

  readonly productId = this.route.snapshot.paramMap.get('id');
  readonly isEdit = !!this.productId;
  readonly source: Producto | undefined = this.productId ? getProducto(this.productId) : undefined;

  readonly saving = signal(false);
  readonly errors = signal<Record<string, string>>({});
  readonly touched = signal<Set<string>>(new Set());

  nombre = this.source?.nombre ?? '';
  sku = this.source?.sku ?? '';
  categoriaId = this.source?.categoriaId ?? 'ropa';
  descripcion = this.source?.descripcion ?? '';
  precio = this.source ? String(this.source.precio) : '';
  costo = this.source ? String(this.source.costo) : '';
  stock = this.source ? String(this.source.stock) : '';
  stockMinimo = this.source ? String(this.source.stockMinimo) : '';
  unidad = this.source?.unidad ?? 'unidad';
  estado = this.source?.estado ?? 'Activo';
  promoActiva = this.source?.promocion?.activa ?? false;
  promoDescuento = this.source?.promocion ? String(this.source.promocion.descuento) : '';
  promoInicio = this.source?.promocion?.vigenciaInicio ?? '';
  promoFin = this.source?.promocion?.vigenciaFin ?? '';

  get titulo(): string {
    return this.isEdit ? 'Editar producto' : 'Nuevo producto';
  }

  get subtitulo(): string {
    return this.isEdit ? `Editando ${this.source?.nombre ?? ''}` : 'Registra un nuevo producto en el catálogo';
  }

  get appInputBaseClass(): string {
    return appInputBaseClass;
  }

  get precioNum(): number {
    return parseFloat(this.precio) || 0;
  }

  get costoNum(): number {
    return parseFloat(this.costo) || 0;
  }

  get margen(): number {
    return this.precioNum > 0 ? Math.round(((this.precioNum - this.costoNum) / this.precioNum) * 100) : 0;
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
    if (!this.sku.trim()) {
      errs['sku'] = 'El SKU es obligatorio';
    }
    if (!this.precio || this.precioNum <= 0) {
      errs['precio'] = 'Debe ser mayor a 0';
    }
    if (!this.costo || this.costoNum <= 0) {
      errs['costo'] = 'Debe ser mayor a 0';
    }
    if (this.stock === '' || parseInt(this.stock, 10) < 0) {
      errs['stock'] = 'Debe ser 0 o mayor';
    }
    if (this.stockMinimo === '' || parseInt(this.stockMinimo, 10) < 0) {
      errs['stockMinimo'] = 'Debe ser 0 o mayor';
    }
    return errs;
  }

  margenBoxClass(): string {
    return (
      'mt-1 flex h-9 items-center rounded-lg border border-input bg-muted px-3 text-sm font-mono font-medium ' +
      (this.margen >= 40 ? 'text-success' : this.margen >= 20 ? 'text-warning' : 'text-destructive')
    );
  }

  margenLabel(): string {
    return this.precioNum > 0 ? `${this.margen}%` : '—';
  }

  precioConDescuento(): string | null {
    const desc = parseFloat(this.promoDescuento) || 0;
    if (!this.promoActiva || this.precioNum <= 0 || desc <= 0) {
      return null;
    }
    return formatCurrency(this.precioNum * (1 - desc / 100));
  }

  onPromoActivaChange(event: Event): void {
    this.promoActiva = (event.target as HTMLInputElement).checked;
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
      if (this.isEdit && this.productId) {
        this.router.navigate(['/productos', this.productId]);
      } else {
        const nextId = 'PROD-' + String(productos.length + 1).padStart(3, '0');
        this.router.navigate(['/productos', nextId]);
      }
    }, 800);
  }

  goBack(): void {
    this.router.navigate(['/productos']);
  }
}
