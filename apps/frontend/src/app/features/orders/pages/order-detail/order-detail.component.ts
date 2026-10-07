import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { formatCurrency, getHistorialPedido, getPedido, getSeguimiento } from '../../../../core/data/pedidos-data';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div>
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button type="button" (click)="volver()" class="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
            <app-icon name="arrow-left" [size]="20" />
          </button>
          <div>
            <p class="text-xs text-muted-foreground">
              <a routerLink="/pedidos" class="hover:text-foreground">Pedidos</a><span class="mx-1">/</span><span class="text-foreground">{{ pedido.id }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="editar()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            <app-icon name="square-pen" [size]="16" /> Editar
          </button>
          <button
            type="button"
            (click)="seguimientoPage()"
            class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <app-icon name="clock" [size]="16" /> Seguimiento
          </button>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-semibold tracking-tight text-card-foreground">{{ pedido.id }}</h1>
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" [class]="estadoBadgeClass(pedido.estado)">{{ pedido.estado }}</span>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{{ pedido.cliente }} · {{ pedido.clienteNIT }}</p>
            <p class="text-sm text-muted-foreground">Vendedor: {{ pedido.vendedor }} · {{ pedido.fecha }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-semibold tracking-tight text-card-foreground">{{ formatCurrency(pedido.total) }}</p>
            <p class="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <h2 class="mb-4 text-sm font-semibold text-card-foreground">Productos</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border text-xs text-muted-foreground">
                    <th class="pb-2 text-left font-medium">Producto</th>
                    <th class="pb-2 text-center font-medium">Cant</th>
                    <th class="pb-2 text-right font-medium">Precio</th>
                    <th class="pb-2 text-center font-medium">Desc</th>
                    <th class="pb-2 text-right font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  @for (l of pedido.lineas; track l.id) {
                    <tr class="border-b border-border/50">
                      <td class="py-2.5 font-medium text-card-foreground">{{ l.producto }}</td>
                      <td class="py-2.5 text-center text-muted-foreground">{{ l.cantidad }}</td>
                      <td class="py-2.5 text-right font-mono tabular-nums text-muted-foreground">{{ formatCurrency(l.precio) }}</td>
                      <td class="py-2.5 text-center text-muted-foreground">{{ l.descuento > 0 ? l.descuento + '%' : '-' }}</td>
                      <td class="py-2.5 text-right font-mono tabular-nums font-medium text-card-foreground">{{ formatCurrency(l.subtotal) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="mt-4 space-y-1 border-t border-border pt-4 text-sm">
              <div class="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span class="font-mono tabular-nums">{{ formatCurrency(pedido.subtotal) }}</span>
              </div>
              @if (pedido.descuentoGlobal > 0) {
                <div class="flex justify-between text-muted-foreground">
                  <span>Descuento global ({{ pedido.descuentoGlobal }}%)</span>
                  <span class="font-mono tabular-nums">-{{ formatCurrency(round(pedido.subtotal * pedido.descuentoGlobal / 100)) }}</span>
                </div>
              }
              <div class="flex justify-between text-muted-foreground">
                <span>IVA</span>
                <span class="font-mono tabular-nums">{{ formatCurrency(pedido.iva) }}</span>
              </div>
              <div class="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-card-foreground">
                <span>Total</span>
                <span class="font-mono tabular-nums">{{ formatCurrency(pedido.total) }}</span>
              </div>
            </div>
          </section>

          @if (pedido.observaciones) {
            <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h2 class="text-sm font-semibold text-card-foreground">Observaciones</h2>
              <p class="mt-2 text-sm text-muted-foreground">{{ pedido.observaciones }}</p>
            </section>
          }

          <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <h2 class="text-sm font-semibold text-card-foreground">Historial de cambios</h2>
            <div class="mt-4 space-y-0">
              @if (historial.length === 0) {
                <p class="py-4 text-center text-sm text-muted-foreground">Sin cambios registrados</p>
              } @else {
                @for (h of historial; track h.id; let i = $index, last = $last) {
                  <div class="relative flex gap-3" [class.pb-4]="!last">
                    @if (i < historial.length - 1) {
                      <div class="absolute left-[7px] top-5 h-full w-px bg-border" aria-hidden="true"></div>
                    }
                    <span class="mt-0.5 flex size-[14px] shrink-0 items-center justify-center rounded-full bg-accent text-[8px] text-accent-foreground ring-2 ring-background">
                      <app-icon name="file-text" [size]="10" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm text-card-foreground">
                        <span class="font-medium">{{ h.usuario }}</span> <span class="text-muted-foreground">{{ h.accion }}</span>
                      </p>
                      <p class="text-xs text-muted-foreground">{{ h.detalle }}</p>
                      <p class="text-[11px] text-muted-foreground/60">{{ h.fecha }}</p>
                    </div>
                  </div>
                }
              }
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-semibold text-card-foreground">Seguimiento</h2>
              <button type="button" (click)="seguimientoPage()" class="text-xs font-medium text-primary hover:text-primary/80">Ver todo</button>
            </div>
            <div class="mt-4 space-y-0">
              @for (s of seguimientoMini; track s.id; let i = $index, last = $last) {
                <div class="relative flex gap-3" [class.pb-4]="!last">
                  @if (i < seguimientoMini.length - 1) {
                    <div class="absolute left-[11px] top-6 h-full w-px bg-border" aria-hidden="true"></div>
                  }
                  @if (s.completado) {
                    <app-icon name="circle-check-big" [size]="22" class="mt-0.5 shrink-0 text-success" />
                  } @else {
                    <app-icon name="circle" [size]="22" class="mt-0.5 shrink-0 text-muted-foreground/30" />
                  }
                  <div class="min-w-0 flex-1">
                    <p class="text-sm" [class]="stepTextClass(s.completado)">{{ s.estado }}</p>
                    <p class="text-xs text-muted-foreground">{{ s.usuario }}@if (s.fecha) {<span> · {{ s.fecha }} {{ s.hora }}</span>}</p>
                  </div>
                </div>
              }
            </div>
          </section>

          <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <h2 class="text-sm font-semibold text-card-foreground">Facturación</h2>
            <div class="mt-4 space-y-3">
              @if (tieneFactura()) {
                <div class="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
                  <app-icon name="file-text" [size]="32" class="text-primary" />
                  <div>
                    <p class="text-sm font-medium text-card-foreground">#FE-9931</p>
                    <p class="text-xs text-muted-foreground">{{ formatCurrency(pedido.total) }} · {{ pedido.fecha }}</p>
                    <button type="button" class="mt-1 text-xs font-medium text-primary hover:text-primary/80">Ver factura</button>
                  </div>
                </div>
              } @else {
                <p class="text-sm text-muted-foreground">Factura no emitida</p>
              }
            </div>
          </section>

          <section class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
            <h2 class="text-sm font-semibold text-card-foreground">Acciones</h2>
            <div class="mt-3 grid grid-cols-2 gap-2">
              <button type="button" class="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">Imprimir</button>
              <button type="button" class="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">Enviar por email</button>
              <button type="button" class="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">Generar PDF</button>
              @if (pedido.estado === 'Pendiente') {
                <button type="button" class="rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-xs font-medium text-success transition-colors hover:bg-success/10">Facturar</button>
              }
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class OrderDetailComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly pedido = getPedido(this.id)!;
  readonly historial = getHistorialPedido(this.id);
  readonly seguimiento = getSeguimiento(this.id);
  readonly seguimientoMini = this.seguimiento.slice(0, 4);
  readonly formatCurrency = formatCurrency;
  readonly round = Math.round;

  estadoBadgeClass(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: 'bg-warning/10 text-warning',
      Completado: 'bg-success/10 text-success',
      Cancelado: 'bg-destructive/10 text-destructive',
      Facturado: 'bg-primary/10 text-primary',
    };
    return map[estado] ?? '';
  }

  stepTextClass(completado: boolean): string {
    return completado ? 'text-card-foreground' : 'text-muted-foreground';
  }

  tieneFactura(): boolean {
    return this.pedido.estado === 'Facturado' || this.pedido.estado === 'Completado';
  }

  volver(): void {
    this.router.navigate(['/pedidos']);
  }

  editar(): void {
    this.router.navigate(['/pedidos', this.id, 'editar']);
  }

  seguimientoPage(): void {
    this.router.navigate(['/pedidos', this.id, 'seguimiento']);
  }
}
