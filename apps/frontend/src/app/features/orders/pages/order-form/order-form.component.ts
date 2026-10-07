import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from '../../../../core/data/auth-config';
import { clientes, sellers } from '../../../../core/data/clientes-data';
import type { Pedido } from '../../../../core/data/pedidos-data';
import { formatCurrency, getPedido, productosCatalogo } from '../../../../core/data/pedidos-data';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

type FormLinea = { producto: string; cantidad: number; precio: number; descuento: number };

function calcSubtotal(linea: FormLinea): number {
  return Math.round(linea.cantidad * linea.precio * (1 - linea.descuento / 100));
}

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="mx-auto max-w-5xl">
      <div class="mb-6 flex items-center gap-4">
        <button type="button" (click)="volver()" class="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          <app-icon name="arrow-left" [size]="20" />
        </button>
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-foreground">{{ pedido ? 'Editar ' + pedido.id : 'Nuevo pedido' }}</h1>
          <p class="text-sm text-muted-foreground">{{ pedido ? 'Actualiza los datos del pedido' : 'Registra un nuevo pedido' }}</p>
        </div>
      </div>

      <form (ngSubmit)="guardar()" class="space-y-6" novalidate>
        <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h2 class="text-sm font-semibold text-card-foreground">Cliente</h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="text-sm font-medium text-foreground">Cliente *</label>
              <select
                name="cliente"
                [ngModel]="clienteId()"
                (ngModelChange)="onClienteChange($event)"
                [attr.aria-invalid]="clienteError() ? 'true' : null"
                [class.border-destructive]="!!clienteError()"
                class="mt-1.5 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
              >
                <option value="">Seleccionar cliente…</option>
                @for (c of clientes; track c.id) {
                  <option [value]="c.id">{{ c.nombre }} ({{ c.identificacion }})</option>
                }
              </select>
              @if (clienteError()) {
                <p class="mt-1 flex items-center gap-1 text-xs font-medium text-destructive">
                  <app-icon name="circle-alert" [size]="14" />{{ clienteError() }}
                </p>
              }
              @if (cliente(); as cli) {
                <p class="mt-1.5 text-xs text-muted-foreground">{{ cli.tipoIdentificacion }} {{ cli.identificacion }} · {{ cli.territorio }} · {{ cli.email }}</p>
              }
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Vendedor *</label>
              <select
                name="vendedor"
                [ngModel]="vendedor()"
                (ngModelChange)="onVendedorChange($event)"
                [attr.aria-invalid]="vendedorError() ? 'true' : null"
                [class.border-destructive]="!!vendedorError()"
                class="mt-1.5 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
              >
                <option value="">Seleccionar…</option>
                @for (s of sellers; track s) {
                  <option [value]="s">{{ s }}</option>
                }
              </select>
              @if (vendedorError()) {
                <p class="mt-1 flex items-center gap-1 text-xs font-medium text-destructive">
                  <app-icon name="circle-alert" [size]="14" />{{ vendedorError() }}
                </p>
              }
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-card-foreground">Productos</h2>
            <button
              type="button"
              (click)="addLinea()"
              class="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-xs font-medium text-foreground hover:bg-muted"
            >
              <app-icon name="plus" [size]="14" /> Añadir línea
            </button>
          </div>
          <div class="mt-4 space-y-2">
            @for (linea of lineas(); track $index; let i = $index) {
              <div class="flex flex-wrap items-end gap-2 rounded-lg border border-border p-3 sm:flex-nowrap">
                <div class="min-w-[160px] flex-1">
                  <label class="text-[11px] font-medium text-muted-foreground">Producto</label>
                  <select
                    [name]="'linea-producto-' + i"
                    [ngModel]="linea.producto"
                    (ngModelChange)="updateLinea(i, 'producto', $event)"
                    [class.border-destructive]="!!lineaError(i, 'producto')"
                    class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground"
                  >
                    <option value="">Seleccionar…</option>
                    @for (p of productosCatalogo; track p) {
                      <option [value]="p">{{ p }}</option>
                    }
                  </select>
                </div>
                <div class="w-16">
                  <label class="text-[11px] font-medium text-muted-foreground">Cant</label>
                  <input
                    type="number"
                    min="1"
                    [name]="'linea-cant-' + i"
                    [ngModel]="linea.cantidad"
                    (ngModelChange)="updateLinea(i, 'cantidad', $event)"
                    [class.border-destructive]="!!lineaError(i, 'cant')"
                    class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-center text-xs text-foreground"
                  />
                </div>
                <div class="w-24">
                  <label class="text-[11px] font-medium text-muted-foreground">Precio unit.</label>
                  <input
                    type="number"
                    min="0"
                    [name]="'linea-precio-' + i"
                    [ngModel]="linea.precio"
                    (ngModelChange)="updateLinea(i, 'precio', $event)"
                    [class.border-destructive]="!!lineaError(i, 'precio')"
                    class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-right text-xs text-foreground"
                  />
                </div>
                <div class="w-16">
                  <label class="text-[11px] font-medium text-muted-foreground">Desc %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    [name]="'linea-desc-' + i"
                    [ngModel]="linea.descuento"
                    (ngModelChange)="updateLinea(i, 'descuento', $event)"
                    class="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-center text-xs text-foreground"
                  />
                </div>
                <div class="w-28 text-right">
                  <label class="text-[11px] font-medium text-muted-foreground">Subtotal</label>
                  <p class="mt-1 font-mono text-sm font-semibold tabular-nums text-card-foreground">{{ formatCurrency(lineaSubtotal(linea)) }}</p>
                </div>
                <button
                  type="button"
                  (click)="removeLinea(i)"
                  [disabled]="lineas().length <= 1"
                  class="mb-px self-end rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-20"
                  aria-label="Eliminar línea"
                >
                  <app-icon name="trash-2" [size]="16" />
                </button>
              </div>
            }
          </div>

          <div class="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <div class="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span class="font-mono tabular-nums">{{ formatCurrency(subtotal()) }}</span>
            </div>
            <div class="flex items-center justify-between text-muted-foreground">
              <span>Descuento global</span>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="descuento-global"
                  [ngModel]="descuentoGlobal()"
                  (ngModelChange)="onDescuentoGlobalChange($event)"
                  class="w-16 rounded-lg border border-input bg-background px-2 py-1 text-center text-xs text-foreground"
                /> %
                <span class="w-24 text-right font-mono tabular-nums">-{{ formatCurrency(descGlobal()) }}</span>
              </div>
            </div>
            <div class="flex justify-between text-muted-foreground">
              <span>IVA 19%</span>
              <span class="font-mono tabular-nums">{{ formatCurrency(iva()) }}</span>
            </div>
            <div class="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-card-foreground">
              <span>TOTAL</span>
              <span class="font-mono tabular-nums">{{ formatCurrency(total()) }}</span>
            </div>
          </div>
        </section>

        <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
          <h2 class="text-sm font-semibold text-card-foreground">Información adicional</h2>
          <div class="mt-4 grid gap-4">
            <div>
              <label class="text-sm font-medium text-foreground">Observaciones</label>
              <textarea
                rows="3"
                name="observaciones"
                placeholder="Notas internas, instrucciones de entrega…"
                [ngModel]="observaciones()"
                (ngModelChange)="onObservacionesChange($event)"
                class="mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25"
              ></textarea>
            </div>
          </div>
        </section>

        <div class="flex items-center justify-end gap-3 border-t border-border pt-6">
          <button
            type="button"
            (click)="cancelar()"
            class="inline-flex h-10 items-center rounded-lg border border-border bg-background px-5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="saving()"
            class="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            @if (saving()) {
              <app-icon name="loader-circle" [size]="16" class="animate-spin" />
            }
            <app-icon name="save" [size]="16" /> {{ pedido ? 'Guardar cambios' : 'Crear pedido' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class OrderFormComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly clientes = clientes;
  readonly sellers = sellers;
  readonly productosCatalogo = productosCatalogo;
  readonly formatCurrency = formatCurrency;

  private readonly id = this.route.snapshot.paramMap.get('id');
  readonly pedido: Pedido | undefined = this.id ? getPedido(this.id) : undefined;

  readonly clienteId = signal(this.pedido?.clienteId ?? '');
  readonly vendedor = signal(this.pedido?.vendedor ?? '');
  readonly observaciones = signal(this.pedido?.observaciones ?? '');
  readonly descuentoGlobal = signal(this.pedido?.descuentoGlobal ?? 0);
  readonly lineas = signal<FormLinea[]>(
    this.pedido?.lineas.map((l) => ({ producto: l.producto, cantidad: l.cantidad, precio: l.precio, descuento: l.descuento })) ?? [
      { producto: '', cantidad: 1, precio: 0, descuento: 0 },
    ],
  );
  readonly saving = signal(false);
  readonly errores = signal<Record<string, string>>({});

  readonly cliente = computed(() => this.clientes.find((c) => c.id === this.clienteId()));
  readonly subtotal = computed(() => this.lineas().reduce((sum, l) => sum + calcSubtotal(l), 0));
  readonly iva = computed(() => Math.round(this.subtotal() * 0.19));
  readonly descGlobal = computed(() => Math.round(this.subtotal() * (this.descuentoGlobal() / 100)));
  readonly total = computed(() => this.subtotal() - this.descGlobal() + this.iva());

  onClienteChange(value: string): void {
    this.clienteId.set(value);
  }

  onVendedorChange(value: string): void {
    this.vendedor.set(value);
  }

  onObservacionesChange(value: string): void {
    this.observaciones.set(value);
  }

  onDescuentoGlobalChange(value: string | number): void {
    this.descuentoGlobal.set(Math.min(100, Math.max(0, parseInt(String(value), 10) || 0)));
  }

  addLinea(): void {
    this.lineas.update((prev) => [...prev, { producto: '', cantidad: 1, precio: 0, descuento: 0 }]);
  }

  removeLinea(idx: number): void {
    if (this.lineas().length > 1) {
      this.lineas.update((prev) => prev.filter((_, i) => i !== idx));
    }
  }

  updateLinea(idx: number, field: keyof FormLinea, value: string | number): void {
    this.lineas.update((prev) =>
      prev.map((l, i) => {
        if (i !== idx) {
          return l;
        }
        if (field === 'cantidad') {
          return { ...l, cantidad: Math.max(1, parseInt(String(value), 10) || 1) };
        }
        if (field === 'precio') {
          return { ...l, precio: Math.max(0, parseInt(String(value), 10) || 0) };
        }
        if (field === 'descuento') {
          return { ...l, descuento: Math.min(100, Math.max(0, parseInt(String(value), 10) || 0)) };
        }
        return { ...l, producto: String(value) };
      }),
    );
  }

  lineaSubtotal(linea: FormLinea): number {
    return calcSubtotal(linea);
  }

  clienteError(): string | null {
    return this.errores()['cliente'] ?? null;
  }

  vendedorError(): string | null {
    return this.errores()['vendedor'] ?? null;
  }

  lineaError(idx: number, campo: string): string | null {
    return this.errores()[`linea-${idx}-${campo}`] ?? null;
  }

  validate(): boolean {
    const e: Record<string, string> = {};
    if (!this.clienteId()) {
      e['cliente'] = 'Selecciona un cliente';
    }
    if (!this.vendedor()) {
      e['vendedor'] = 'Selecciona un vendedor';
    }
    this.lineas().forEach((l, i) => {
      if (!l.producto) {
        e[`linea-${i}-producto`] = 'Requerido';
      }
      if (l.cantidad < 1) {
        e[`linea-${i}-cant`] = 'Mínimo 1';
      }
      if (l.precio <= 0) {
        e[`linea-${i}-precio`] = 'Debe ser > 0';
      }
    });
    this.errores.set(e);
    return Object.keys(e).length === 0;
  }

  async guardar(): Promise<void> {
    if (!this.validate()) {
      return;
    }
    this.saving.set(true);
    await delay(1200);
    this.saving.set(false);
    if (this.pedido) {
      this.router.navigate(['/pedidos', this.pedido.id]);
    } else {
      this.router.navigate(['/pedidos']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/pedidos']);
  }

  volver(): void {
    this.router.navigate(['/pedidos']);
  }
}
