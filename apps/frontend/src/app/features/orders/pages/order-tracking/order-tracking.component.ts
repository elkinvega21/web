import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getPedido, getSeguimiento } from '../../../../core/data/pedidos-data';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 flex items-center gap-3">
        <button type="button" (click)="volver()" class="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          <app-icon name="arrow-left" [size]="20" />
        </button>
        <div>
          <p class="text-xs text-muted-foreground">
            <a routerLink="/pedidos" class="hover:text-foreground">Pedidos</a>
            <span class="mx-1">/</span>
            <a [routerLink]="['/pedidos', pedido.id]" class="hover:text-foreground">{{ pedido.id }}</a>
            <span class="mx-1">/</span>
            <span class="text-foreground">Seguimiento</span>
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-semibold tracking-tight text-card-foreground">Seguimiento</h1>
            <p class="text-sm text-muted-foreground">{{ pedido.id }} · {{ pedido.cliente }}</p>
          </div>
          <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium" [class]="estadoBadgeClass(pedido.estado)">{{ pedido.estado }}</span>
        </div>

        <div class="mt-6 flex items-center gap-4 rounded-lg bg-muted/50 p-4">
          <div class="flex-1">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-card-foreground">Progreso</span>
              <span class="text-muted-foreground">{{ completados }}/{{ total }} pasos</span>
            </div>
            <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-success transition-all duration-500" [style.width]="progress + '%'"></div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          @for (s of seguimiento; track s.id; let last = $last) {
            <div class="relative flex gap-4" [class.pb-8]="!last">
              <div class="flex flex-col items-center">
                @if (s.completado) {
                  <app-icon name="circle-check-big" [size]="24" class="text-success" />
                } @else {
                  <app-icon name="circle" [size]="24" class="text-muted-foreground/30" />
                }
                @if (!last) {
                  <div class="mt-1 h-full w-px bg-border"></div>
                }
              </div>
              <div class="flex-1 pb-4">
                <p class="text-sm font-medium" [class]="stepTextClass(s.completado)">{{ s.estado }}</p>
                @if (s.usuario) {
                  <p class="mt-0.5 text-xs text-muted-foreground">
                    por {{ s.usuario }}@if (s.fecha) {<span> · {{ s.fecha }} {{ s.hora }}</span>}
                  </p>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class OrderTrackingComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly pedido = getPedido(this.id)!;
  readonly seguimiento = getSeguimiento(this.id);
  readonly completados = this.seguimiento.filter((s) => s.completado).length;
  readonly total = this.seguimiento.length;
  readonly progress = Math.round((this.completados / Math.max(this.total, 1)) * 100);

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

  volver(): void {
    this.router.navigate(['/pedidos', this.id]);
  }
}
