import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { formatCurrency, getVendedor, vendedores } from '../../../../core/data/vendedores-data';
import type { Vendedor, VentaMensual } from '../../../../core/data/vendedores-data';

type Tab = 'Resumen' | 'Ventas' | 'Clientes' | 'Territorio' | 'Metas' | 'Comisiones' | 'Actividad' | 'Comparativos';

function promedio(list: Vendedor[], f: (x: Vendedor) => number): number {
  return list.length > 0 ? Math.round(list.reduce((s, x) => s + f(x), 0) / list.length) : 0;
}

@Component({
  selector: 'app-salesperson-detail',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (v; as vendedor) {
      <div>
        <div class="mb-6 flex items-center gap-4">
          <button type="button" (click)="goBack()"
            class="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Volver">
            <app-icon name="arrow-left" [size]="20" />
          </button>
          <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{{ vendedor.iniciales }}</span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{{ vendedor.nombre }}</h1>
              <span [class]="estadoBadgeClass(vendedor.estado)">{{ vendedor.estado }}</span>
              <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                <app-icon name="award" [size]="12" /> #{{ vendedor.ranking }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground">{{ vendedor.email }} · {{ vendedor.telefono }}</p>
          </div>
        </div>

        <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Ventas totales</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(vendedor.ventasTotales) }}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Ventas del mes</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">
              {{ formatCurrency(vendedor.ventasMes) }}
              @if (vendedor.cumplimientoMeta >= 100) {
                <span class="ml-1 text-[10px] text-success">↑</span>
              } @else {
                <span class="ml-1 text-[10px] text-destructive">↓</span>
              }
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Meta mensual</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(vendedor.metaMensual) }}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Clientes</p>
            <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ vendedor.clientesAsignados }}</p>
            <p class="text-[10px] text-muted-foreground">{{ vendedor.clientesNuevos }} nuevos</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Comisiones</p>
            <p class="mt-0.5 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(vendedor.comisionTotal) }}</p>
            <p class="text-[10px] text-muted-foreground">{{ formatCurrency(vendedor.comisionPendiente) }} pendiente</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Visitas mes</p>
            <p class="mt-0.5 text-lg font-semibold text-card-foreground">{{ vendedor.visitasMes }}</p>
          </div>
          <div class="rounded-xl border border-border bg-card p-3">
            <p class="truncate text-[11px] font-medium text-muted-foreground">Cumplimiento</p>
            <p [class]="cumplimientoKpiClass(vendedor.cumplimientoMeta)">{{ vendedor.cumplimientoMeta }}%</p>
          </div>
        </div>

        <div class="mb-6 flex gap-1 overflow-x-auto border-b border-border">
          @for (tab of tabs; track tab.key) {
            <button type="button" (click)="setTab(tab.key)" [class]="tabClass(tab.key)">
              {{ tab.label }}
            </button>
          }
        </div>

        @switch (activeTab()) {
          @case ('Resumen') {
            <div class="space-y-6">
              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                  <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <app-icon name="trending-up" [size]="16" class="text-primary" /> Rendimiento
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">Ventas vs meta</span>
                        <span class="font-medium text-card-foreground">{{ barRowValue(vendedor.cumplimientoMeta, 120) }}%</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div [class]="cumplimientoBarClass(vendedor.cumplimientoMeta)" [style.width.%]="barRowWidth(vendedor.cumplimientoMeta, 120)"></div>
                      </div>
                    </div>
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">Visitas programadas</span>
                        <span class="font-medium text-card-foreground">{{ visitasProgramadasPct() }}%</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div class="h-full rounded-full bg-primary" [style.width.%]="barRowWidth(visitasProgramadasPct(), 100)"></div>
                      </div>
                    </div>
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">Clientes activos</span>
                        <span class="font-medium text-card-foreground">{{ clientesActivosPct() }}%</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div class="h-full rounded-full bg-accent" [style.width.%]="barRowWidth(clientesActivosPct(), 100)"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                  <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <app-icon name="award" [size]="16" class="text-primary" /> Logros
                  </h3>
                  <div class="space-y-2.5">
                    <div class="flex items-center gap-2">
                      <app-icon name="circle-check" [size]="16" [class]="cumplimientoLogroClass()" />
                      <span class="text-xs text-card-foreground">Meta mensual {{ vendedor.cumplimientoMeta >= 100 ? 'cumplida' : 'no alcanzada' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <app-icon [name]="vendedor.clientesNuevos > 0 ? 'circle-check' : 'circle-x'" [size]="16" [class]="clientesLogroClass()" />
                      <span class="text-xs text-card-foreground">
                        {{ vendedor.clientesNuevos }} cliente{{ vendedor.clientesNuevos !== 1 ? 's' : '' }} nuevo{{ vendedor.clientesNuevos !== 1 ? 's' : '' }} este mes
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <app-icon [name]="vendedor.ranking <= 3 ? 'award' : 'clock'" [size]="16" [class]="rankingLogroClass()" />
                      <span class="text-xs text-card-foreground">#{{ vendedor.ranking }} en el ranking general</span>
                    </div>
                  </div>
                </div>
                <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                  <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                    <app-icon name="bar-chart-3" [size]="16" class="text-primary" /> Comparativo
                  </h3>
                  <div class="space-y-3">
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">Ventas</span>
                        <span [class]="miniCompDiffClass(miniCompDiff(vendedor.ventasMes, avgVentasMes))">{{ miniCompText(vendedor.ventasMes, avgVentasMes, true) }}</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div [class]="miniCompBarClass(miniCompDiff(vendedor.ventasMes, avgVentasMes))" [style.width.%]="miniCompWidth(vendedor.ventasMes, avgVentasMes)"></div>
                      </div>
                    </div>
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">Clientes</span>
                        <span [class]="miniCompDiffClass(miniCompDiff(vendedor.clientesAsignados, avgClientes))">{{ miniCompText(vendedor.clientesAsignados, avgClientes, false) }}</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div [class]="miniCompBarClass(miniCompDiff(vendedor.clientesAsignados, avgClientes))" [style.width.%]="miniCompWidth(vendedor.clientesAsignados, avgClientes)"></div>
                      </div>
                    </div>
                    <div>
                      <div class="mb-1 flex justify-between text-xs">
                        <span class="text-muted-foreground">Visitas</span>
                        <span [class]="miniCompDiffClass(miniCompDiff(vendedor.visitasMes, avgVisitas))">{{ miniCompText(vendedor.visitasMes, avgVisitas, false) }}</span>
                      </div>
                      <div class="h-2 overflow-hidden rounded-full bg-muted">
                        <div [class]="miniCompBarClass(miniCompDiff(vendedor.visitasMes, avgVisitas))" [style.width.%]="miniCompWidth(vendedor.visitasMes, avgVisitas)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-4 text-sm font-semibold text-card-foreground">Información general</h3>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p class="text-xs text-muted-foreground">Email</p>
                    <p class="text-sm font-medium text-card-foreground">{{ vendedor.email }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">Teléfono</p>
                    <p class="text-sm font-medium text-card-foreground">{{ vendedor.telefono }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">Territorio</p>
                    <p class="text-sm font-medium text-card-foreground">{{ vendedor.territorio }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">Ingreso</p>
                    <p class="text-sm font-medium text-card-foreground">{{ vendedor.fechaIngreso }}</p>
                  </div>
                </div>
              </div>
            </div>
          }
          @case ('Ventas') {
            <div class="space-y-6">
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-4 text-sm font-semibold text-card-foreground">Ventas mensuales</h3>
                <div class="flex h-40 items-end gap-2">
                  @for (vm of vendedor.ventasMensuales; track vm.mes) {
                    <div class="flex flex-1 flex-col items-center gap-1">
                      <span class="font-mono text-[10px] text-muted-foreground">{{ formatCurrency(vm.ventas) }}</span>
                      <div class="relative flex w-full flex-col items-center" [style.height.px]="140">
                        <div class="absolute bottom-0 w-5/6 rounded-t-sm bg-primary/30" [style.height.px]="metaBarHeight(vm)" title="Meta: {{ formatCurrency(vm.meta) }}"></div>
                        <div class="absolute bottom-0 w-3/4 rounded-t-sm bg-primary" [style.height.px]="ventaBarHeight(vm)" title="Ventas: {{ formatCurrency(vm.ventas) }}"></div>
                      </div>
                      <span class="text-[11px] text-muted-foreground">{{ vm.mes }}</span>
                    </div>
                  }
                </div>
              </div>
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-4 text-sm font-semibold text-card-foreground">Historial de ventas</h3>
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-border text-xs text-muted-foreground">
                      <th class="px-3 py-2 text-left font-medium">Mes</th>
                      <th class="px-3 py-2 text-right font-medium">Ventas</th>
                      <th class="px-3 py-2 text-right font-medium">Meta</th>
                      <th class="px-3 py-2 text-right font-medium">Cumplimiento</th>
                      <th class="px-3 py-2 text-right font-medium">Comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (vm of vendedor.ventasMensuales; track vm.mes) {
                      <tr class="border-b border-border">
                        <td class="px-3 py-2.5 font-medium text-card-foreground">{{ vm.mes }}</td>
                        <td class="px-3 py-2.5 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(vm.ventas) }}</td>
                        <td class="px-3 py-2.5 text-right font-mono tabular-nums text-muted-foreground">{{ formatCurrency(vm.meta) }}</td>
                        <td class="px-3 py-2.5 text-right">
                          <span [class]="cumplimientoPctClass(metaPct(vm.ventas, vm.meta))">{{ metaPct(vm.ventas, vm.meta) }}%</span>
                        </td>
                        <td class="px-3 py-2.5 text-right font-mono tabular-nums text-muted-foreground">{{ formatCurrency(comisionDe(vm.ventas)) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
          @case ('Clientes') {
            <div class="rounded-xl border border-border bg-card ring-1 ring-foreground/5">
              @if (vendedor.clientes.length === 0) {
                <div class="flex flex-col items-center py-12 text-center">
                  <app-icon name="users" [size]="32" class="text-muted-foreground/40" />
                  <p class="mt-2 text-sm text-muted-foreground">Sin clientes asignados</p>
                </div>
              } @else {
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                      <th class="px-4 py-3 text-left font-medium">Cliente</th>
                      <th class="px-4 py-3 text-left font-medium">Territorio</th>
                      <th class="px-4 py-3 text-right font-medium">Total comprado</th>
                      <th class="px-4 py-3 text-center font-medium">Última compra</th>
                      <th class="px-4 py-3 text-center font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (c of vendedor.clientes; track c.id) {
                      <tr class="border-b border-border">
                        <td class="px-4 py-3 font-medium text-card-foreground">{{ c.nombre }}</td>
                        <td class="px-4 py-3 text-muted-foreground">{{ c.territorio }}</td>
                        <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(c.totalComprado) }}</td>
                        <td class="px-4 py-3 text-center text-muted-foreground">{{ c.ultimaCompra }}</td>
                        <td class="px-4 py-3 text-center">
                          <span [class]="clienteEstadoClass(c.estado)">{{ c.estado }}</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          }
          @case ('Territorio') {
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                  <app-icon name="map-pin" [size]="16" class="text-primary" /> Zona de cobertura
                </h3>
                <p class="text-lg font-medium text-card-foreground">{{ vendedor.territorio }}</p>
                <div class="mt-3 space-y-1">
                  @for (ciudad of vendedor.ciudades; track ciudad) {
                    <div class="flex items-center gap-2 text-sm text-muted-foreground">
                      <span class="size-1.5 rounded-full bg-primary/60"></span>
                      {{ ciudad }}
                    </div>
                  }
                </div>
              </div>
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
                  <app-icon name="users" [size]="16" class="text-primary" /> Cobertura de clientes
                </h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-muted-foreground">Clientes en zona</p>
                    <p class="text-xl font-semibold text-card-foreground">{{ vendedor.clientesAsignados }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">Potencial estimado</p>
                    <p class="text-xl font-semibold text-card-foreground">{{ formatCurrency(vendedor.ventasTotales * 3) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-muted-foreground">Penetración</p>
                    <p class="text-xl font-semibold text-success">{{ penetracion() }}%</p>
                  </div>
                </div>
              </div>
            </div>
          }
          @case ('Metas') {
            <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
              <h3 class="mb-4 text-sm font-semibold text-card-foreground">Metas mensuales vs real</h3>
              <div class="space-y-4">
                @for (vm of vendedor.ventasMensuales; track vm.mes) {
                  <div>
                    <div class="mb-1 flex items-center justify-between">
                      <span class="text-sm font-medium text-card-foreground">{{ vm.mes }}</span>
                      <span [class]="metaPctTextClass(vm)">{{ metaPct(vm.ventas, vm.meta) }}%</span>
                    </div>
                    <div class="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div [class]="metaProgressBarClass(vm)" [style.width.%]="barWidth(metaPct(vm.ventas, vm.meta))"></div>
                    </div>
                    <div class="mt-0.5 flex justify-between text-xs text-muted-foreground">
                      <span>Meta: {{ formatCurrency(vm.meta) }}</span>
                      <span>Real: {{ formatCurrency(vm.ventas) }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
          @case ('Comisiones') {
            <div class="space-y-6">
              <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-xl border border-border bg-card p-4">
                  <p class="text-xs text-muted-foreground">Comisión total</p>
                  <p class="mt-1 font-mono text-xl font-semibold text-card-foreground">{{ formatCurrency(vendedor.comisionTotal) }}</p>
                </div>
                <div class="rounded-xl border border-border bg-card p-4">
                  <p class="text-xs text-muted-foreground">Pendiente de cobro</p>
                  <p class="mt-1 font-mono text-xl font-semibold text-warning">{{ formatCurrency(vendedor.comisionPendiente) }}</p>
                </div>
                <div class="rounded-xl border border-border bg-card p-4">
                  <p class="text-xs text-muted-foreground">Tasa de comisión</p>
                  <p class="mt-1 text-xl font-semibold text-card-foreground">{{ comisionTasaPct() }}%</p>
                </div>
              </div>
              <div class="rounded-xl border border-border bg-card ring-1 ring-foreground/5">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                      <th class="px-4 py-3 text-left font-medium">Periodo</th>
                      <th class="px-4 py-3 text-right font-medium">Ventas</th>
                      <th class="px-4 py-3 text-right font-medium">Tasa</th>
                      <th class="px-4 py-3 text-right font-medium">Comisión</th>
                      <th class="px-4 py-3 text-center font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (c of vendedor.comisiones; track c.periodo) {
                      <tr class="border-b border-border">
                        <td class="px-4 py-3 font-medium text-card-foreground">{{ c.periodo }}</td>
                        <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(c.ventas) }}</td>
                        <td class="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground">{{ c.tasa * 100 }}%</td>
                        <td class="px-4 py-3 text-right font-mono font-medium tabular-nums text-card-foreground">{{ formatCurrency(c.comision) }}</td>
                        <td class="px-4 py-3 text-center">
                          <span [class]="comisionEstadoClass(c.cobrada)">
                            <span class="inline-flex items-center gap-1">{{ c.cobrada ? 'Cobrada' : 'Pendiente' }}</span>
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
          @case ('Actividad') {
            <div class="space-y-3">
              @if (vendedor.actividad.length === 0) {
                <div class="flex flex-col items-center rounded-xl border border-border bg-card py-12 text-center">
                  <app-icon name="activity" [size]="32" class="text-muted-foreground/40" />
                  <p class="mt-2 text-sm text-muted-foreground">Sin actividad registrada</p>
                </div>
              } @else {
                @for (a of vendedor.actividad; track a.id) {
                  <div class="flex items-start gap-3 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
                    <span [class]="actividadTipoClass(a.tipo)">
                      <app-icon [name]="actividadIcon(a.tipo)" [size]="16" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-card-foreground">{{ a.descripcion }}</p>
                      @if (a.cliente) {
                        <p class="mt-0.5 text-xs text-muted-foreground">Cliente: {{ a.cliente }}</p>
                      }
                    </div>
                    <span class="shrink-0 text-xs text-muted-foreground">{{ a.fecha }}</span>
                  </div>
                }
              }
            </div>
          }
          @case ('Comparativos') {
            <div class="space-y-6">
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
                  <p class="text-xs text-muted-foreground">Ventas del mes</p>
                  <p class="mt-1 font-mono text-lg font-semibold text-card-foreground">{{ formatCurrency(vendedor.ventasMes) }}</p>
                  <div class="mt-1 flex items-center gap-1">
                    <span [class]="compDiffClass(compDiff(vendedor.ventasMes, avgVentasMes))">{{ compPrefix(compDiff(vendedor.ventasMes, avgVentasMes)) }}{{ compPct(vendedor.ventasMes, avgVentasMes) }}%</span>
                    <span class="text-xs text-muted-foreground">vs equipo</span>
                  </div>
                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div [class]="compBarClass(compDiff(vendedor.ventasMes, avgVentasMes))" [style.width.%]="compBarWidth(vendedor.ventasMes, avgVentasMes)"></div>
                  </div>
                </div>
                <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
                  <p class="text-xs text-muted-foreground">Clientes asignados</p>
                  <p class="mt-1 text-lg font-semibold text-card-foreground">{{ vendedor.clientesAsignados }}</p>
                  <div class="mt-1 flex items-center gap-1">
                    <span [class]="compDiffClass(compDiff(vendedor.clientesAsignados, avgClientes))">{{ compPrefix(compDiff(vendedor.clientesAsignados, avgClientes)) }}{{ compPct(vendedor.clientesAsignados, avgClientes) }}%</span>
                    <span class="text-xs text-muted-foreground">vs equipo</span>
                  </div>
                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div [class]="compBarClass(compDiff(vendedor.clientesAsignados, avgClientes))" [style.width.%]="compBarWidth(vendedor.clientesAsignados, avgClientes)"></div>
                  </div>
                </div>
                <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
                  <p class="text-xs text-muted-foreground">Cumplimiento de meta</p>
                  <p class="mt-1 text-lg font-semibold text-card-foreground">{{ vendedor.cumplimientoMeta }}%</p>
                  <div class="mt-1 flex items-center gap-1">
                    <span [class]="compDiffClass(compDiff(vendedor.cumplimientoMeta, avgCumplimiento))">{{ compPrefix(compDiff(vendedor.cumplimientoMeta, avgCumplimiento)) }}{{ compPct(vendedor.cumplimientoMeta, avgCumplimiento) }}%</span>
                    <span class="text-xs text-muted-foreground">vs equipo</span>
                  </div>
                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div [class]="compBarClass(compDiff(vendedor.cumplimientoMeta, avgCumplimiento))" [style.width.%]="compBarWidth(vendedor.cumplimientoMeta, avgCumplimiento)"></div>
                  </div>
                </div>
                <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
                  <p class="text-xs text-muted-foreground">Visitas del mes</p>
                  <p class="mt-1 text-lg font-semibold text-card-foreground">{{ vendedor.visitasMes }}</p>
                  <div class="mt-1 flex items-center gap-1">
                    <span [class]="compDiffClass(compDiff(vendedor.visitasMes, avgVisitas))">{{ compPrefix(compDiff(vendedor.visitasMes, avgVisitas)) }}{{ compPct(vendedor.visitasMes, avgVisitas) }}%</span>
                    <span class="text-xs text-muted-foreground">vs equipo</span>
                  </div>
                  <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div [class]="compBarClass(compDiff(vendedor.visitasMes, avgVisitas))" [style.width.%]="compBarWidth(vendedor.visitasMes, avgVisitas)"></div>
                  </div>
                </div>
              </div>
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <h3 class="mb-4 text-sm font-semibold text-card-foreground">Ranking general</h3>
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-border text-xs text-muted-foreground">
                      <th class="px-3 py-2 text-left font-medium">#</th>
                      <th class="px-3 py-2 text-left font-medium">Vendedor</th>
                      <th class="px-3 py-2 text-right font-medium">Ventas mes</th>
                      <th class="px-3 py-2 text-right font-medium">Clientes</th>
                      <th class="px-3 py-2 text-right font-medium">Cumplimiento</th>
                      <th class="px-3 py-2 text-right font-medium">Visitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (x of rankingGeneral; track x.id; let i = $index) {
                      <tr [class]="rankingRowClass(x.id)">
                        <td class="px-3 py-2.5">
                          <span [class]="rankingPosClass(i)">{{ i + 1 }}</span>
                        </td>
                        <td class="px-3 py-2.5">
                          <span [class]="rankingNameClass(x.id)">{{ x.nombre }}</span>
                        </td>
                        <td class="px-3 py-2.5 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(x.ventasMes) }}</td>
                        <td class="px-3 py-2.5 text-right tabular-nums text-card-foreground">{{ x.clientesAsignados }}</td>
                        <td class="px-3 py-2.5 text-right">
                          <span [class]="cumplimientoPctClass(x.cumplimientoMeta)">{{ x.cumplimientoMeta }}%</span>
                        </td>
                        <td class="px-3 py-2.5 text-right tabular-nums text-card-foreground">{{ x.visitasMes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        }
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-16 text-center">
        <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <app-icon name="circle-alert" [size]="24" />
        </span>
        <p class="mt-3 text-sm font-medium text-foreground">Vendedor no encontrado</p>
        <p class="mt-1 text-xs text-muted-foreground">El vendedor que buscas no existe.</p>
        <button type="button" (click)="goBack()"
          class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Volver a vendedores</button>
      </div>
    }
  `,
})
export class SalespersonDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly vendedorId = this.route.snapshot.paramMap.get('id');
  readonly v: Vendedor | undefined = this.vendedorId ? getVendedor(this.vendedorId) : undefined;

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'Resumen', label: 'Resumen' },
    { key: 'Ventas', label: 'Ventas' },
    { key: 'Clientes', label: 'Clientes' },
    { key: 'Territorio', label: 'Territorio' },
    { key: 'Metas', label: 'Metas' },
    { key: 'Comisiones', label: 'Comisiones' },
    { key: 'Actividad', label: 'Actividad' },
    { key: 'Comparativos', label: 'Comparativos' },
  ];

  readonly activeTab = signal<Tab>('Resumen');

  private readonly activos: Vendedor[] = vendedores.filter((x) => x.estado === 'Activo');
  readonly avgVentasMes: number = promedio(this.activos, (x) => x.ventasMes);
  readonly avgClientes: number = promedio(this.activos, (x) => x.clientesAsignados);
  readonly avgCumplimiento: number = promedio(this.activos, (x) => x.cumplimientoMeta);
  readonly avgVisitas: number = promedio(this.activos, (x) => x.visitasMes);

  readonly ventasMax: number = this.v
    ? Math.max(...this.v.ventasMensuales.map((x) => x.ventas))
    : 0;
  readonly rankingGeneral: Vendedor[] = [...this.activos].sort((a, b) => b.ventasMes - a.ventasMes);

  goBack(): void {
    this.router.navigate(['/vendedores']);
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  tabClass(key: Tab): string {
    return (
      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ' +
      (this.activeTab() === key
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground')
    );
  }

  estadoBadgeClass(estado: string): string {
    return (
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ' +
      (estado === 'Activo' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')
    );
  }

  cumplimientoKpiClass(pct: number): string {
    return (
      'mt-0.5 font-mono text-lg font-semibold ' +
      (pct >= 100 ? 'text-success' : pct >= 80 ? 'text-warning' : 'text-destructive')
    );
  }

  cumplimientoBarClass(pct: number): string {
    return 'h-full rounded-full transition-all ' + (pct >= 100 ? 'bg-success' : pct >= 80 ? 'bg-warning' : 'bg-destructive');
  }

  cumplimientoPctClass(pct: number): string {
    return 'font-medium ' + (pct >= 100 ? 'text-success' : pct >= 80 ? 'text-warning' : 'text-destructive');
  }

  barRowWidth(value: number, max: number): number {
    return max > 0 ? Math.min(100, (value / max) * 100) : 0;
  }

  barRowValue(value: number, max: number): number {
    return Math.min(value, max);
  }

  barWidth(pct: number): number {
    return Math.min(100, pct);
  }

  visitasProgramadasPct(): number {
    return Math.round(((this.v?.visitasMes ?? 0) / 25) * 100);
  }

  clientesActivosPct(): number {
    const v = this.v;
    if (!v || v.clientesAsignados === 0) {
      return 0;
    }
    const activos = v.clientes.filter((c) => c.estado === 'Activo').length;
    return Math.round((activos / v.clientesAsignados) * 100);
  }

  penetracion(): number {
    return this.v ? Math.round((this.v.clientesAsignados / 50) * 100) : 0;
  }

  cumplimientoLogroClass(): string {
    return 'shrink-0 ' + (this.v && this.v.cumplimientoMeta >= 100 ? 'text-success' : 'text-muted-foreground');
  }

  clientesLogroClass(): string {
    return 'shrink-0 ' + (this.v && this.v.clientesNuevos > 0 ? 'text-success' : 'text-muted-foreground');
  }

  rankingLogroClass(): string {
    return 'shrink-0 ' + (this.v && this.v.ranking <= 3 ? 'text-primary' : 'text-muted-foreground');
  }

  miniCompDiff(valor: number, promedio: number): number {
    return valor - promedio;
  }

  miniCompText(valor: number, promedio: number, money: boolean): string {
    return money
      ? `${formatCurrency(valor)} vs ${formatCurrency(promedio)}`
      : `${valor} vs ${promedio}`;
  }

  miniCompDiffClass(diff: number): string {
    return 'font-medium ' + (diff >= 0 ? 'text-success' : 'text-destructive');
  }

  miniCompBarClass(diff: number): string {
    return 'h-full rounded-full ' + (diff >= 0 ? 'bg-success' : 'bg-destructive');
  }

  miniCompWidth(valor: number, promedio: number): number {
    return promedio > 0 ? Math.min(100, Math.round((valor / promedio) * 100)) : 0;
  }

  compDiff(valor: number, promedio: number): number {
    return valor - promedio;
  }

  compPrefix(diff: number): string {
    return diff >= 0 ? '+' : '';
  }

  compPct(valor: number, promedio: number): number {
    return promedio > 0 ? Math.round(((valor - promedio) / promedio) * 100) : 0;
  }

  compDiffClass(diff: number): string {
    return 'text-xs font-medium ' + (diff >= 0 ? 'text-success' : 'text-destructive');
  }

  compBarClass(diff: number): string {
    return 'h-full rounded-full ' + (diff >= 0 ? 'bg-success' : 'bg-destructive');
  }

  compBarWidth(valor: number, promedio: number): number {
    return Math.min(100, promedio > 0 ? (valor / promedio) * 50 : 0);
  }

  ventaBarHeight(vm: VentaMensual): number {
    return this.ventasMax > 0 ? Math.max(8, (vm.ventas / this.ventasMax) * 140) : 0;
  }

  metaBarHeight(vm: VentaMensual): number {
    return this.ventasMax > 0 ? Math.max(8, (vm.meta / this.ventasMax) * 140) : 0;
  }

  metaPct(ventas: number, meta: number): number {
    return meta > 0 ? Math.round((ventas / meta) * 100) : 0;
  }

  metaPctTextClass(vm: VentaMensual): string {
    const pct = this.metaPct(vm.ventas, vm.meta);
    return 'font-mono text-sm font-medium ' + (pct >= 100 ? 'text-success' : pct >= 80 ? 'text-warning' : 'text-destructive');
  }

  metaProgressBarClass(vm: VentaMensual): string {
    const pct = this.metaPct(vm.ventas, vm.meta);
    return 'h-full rounded-full transition-all ' + (pct >= 100 ? 'bg-success' : pct >= 80 ? 'bg-warning' : 'bg-destructive');
  }

  comisionTasaPct(): number {
    return Math.round((this.v?.comisionTasa ?? 0) * 100);
  }

  comisionDe(ventas: number): number {
    return Math.round(ventas * (this.v?.comisionTasa ?? 0));
  }

  comisionEstadoClass(cobrada: boolean): string {
    return (
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ' +
      (cobrada ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')
    );
  }

  clienteEstadoClass(estado: string): string {
    return (
      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ' +
      (estado === 'Activo' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')
    );
  }

  actividadIcon(tipo: string): string {
    return tipo === 'visita' ? 'map-pin' : tipo === 'llamada' ? 'phone' : tipo === 'pedido' ? 'shopping-cart' : tipo === 'reunion' ? 'calendar' : 'activity';
  }

  actividadTipoClass(tipo: string): string {
    return (
      'flex size-8 shrink-0 items-center justify-center rounded-lg ' +
      (tipo === 'visita'
        ? 'text-primary bg-primary/10'
        : tipo === 'llamada'
          ? 'text-warning bg-warning/10'
          : tipo === 'pedido'
            ? 'text-success bg-success/10'
            : tipo === 'reunion'
              ? 'text-accent bg-accent/10'
              : 'text-muted-foreground bg-muted')
    );
  }

  rankingPosClass(i: number): string {
    return (
      'inline-flex size-6 items-center justify-center rounded-md text-[11px] font-bold ' +
      (i < 3 ? 'bg-primary/10 text-primary' : 'text-muted-foreground')
    );
  }

  rankingRowClass(id: string): string {
    return 'border-b border-border transition-colors ' + (id === this.v?.id ? 'bg-primary/5' : '');
  }

  rankingNameClass(id: string): string {
    return 'font-medium ' + (id === this.v?.id ? 'text-primary' : 'text-card-foreground');
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}
