import { Component, computed, input } from '@angular/core';

import {
  monthlySales,
  sellers,
  territories,
  topProducts,
} from '../../../../core/data/dashboard-data';

const donutCircumference = 2 * Math.PI * 68.5;

@Component({
  selector: 'app-monthly-sales-chart',
  standalone: true,
  template: `
    <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      <h3 class="text-sm font-medium text-card-foreground">Ventas mensuales</h3>
      <p class="text-xs text-muted-foreground">Ingresos vs meta mensual</p>
      <div class="mt-4 flex">
        <div class="flex w-10 shrink-0 flex-col justify-between pr-1.5 text-right" [style.height.px]="190">
          @for (t of monthlyTicks; track t) {
            <span class="text-[11px] text-muted-foreground">{{ t }}M</span>
          }
        </div>
        <div class="relative flex-1" [style.height.px]="190">
          @for (t of monthlyTicks; track t) {
            <div class="absolute inset-x-0 border-t border-dashed border-border" [style.top.%]="monthlyTickTop(t)"></div>
          }
          <div class="absolute inset-x-0 top-0 flex items-end" [style.height.px]="190">
            @for (m of data(); track m.month) {
              <div class="flex h-full flex-1 items-end justify-center gap-0.5">
                <div
                  class="w-2.5"
                  [style.height.%]="barHeight(m.ventas)"
                  [style.background-color]="'var(--chart-1)'"
                  [style.border-radius]="'4px 4px 0 0'"
                ></div>
                <div
                  class="w-2.5 opacity-50"
                  [style.height.%]="barHeight(m.meta)"
                  [style.background-color]="'var(--chart-4)'"
                  [style.border-radius]="'4px 4px 0 0'"
                ></div>
              </div>
            }
          </div>
        </div>
      </div>
      <div class="mt-1 flex">
        <div class="w-10 shrink-0"></div>
        <div class="flex flex-1">
          @for (m of data(); track m.month) {
            <span class="flex-1 text-center text-[11px] text-muted-foreground">{{ m.month }}</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class MonthlySalesChartComponent {
  readonly data = input<typeof monthlySales>([]);

  readonly monthlyTicks = [150, 100, 50, 0];

  monthlyTickTop(v: number): number {
    return (1 - v / 150) * 100;
  }

  barHeight(v: number): number {
    return (v / 150) * 100;
  }
}

@Component({
  selector: 'app-territory-chart',
  standalone: true,
  template: `
    <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      <h3 class="text-sm font-medium text-card-foreground">Ventas por territorio</h3>
      <p class="text-xs text-muted-foreground">Distribución geográfica</p>
      <div class="mt-4 flex h-[220px] items-center justify-center">
        <svg viewBox="0 0 200 200" [style.width.px]="164" [style.height.px]="164" aria-hidden="true">
          @for (seg of donutSegments(); track $index) {
            <circle
              cx="100"
              cy="100"
              r="68.5"
              fill="none"
              [attr.stroke]="seg.fill"
              stroke-width="27"
              [attr.stroke-dasharray]="seg.dash + ' ' + seg.gap"
              [attr.transform]="'rotate(' + seg.rotate + ' 100 100)'"
            />
          }
        </svg>
      </div>
      <div class="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        @for (t of data(); track t.name) {
          <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span class="size-2 rounded-sm" [style.background-color]="t.fill"></span>
            {{ t.name }} ({{ t.value }}%)
          </span>
        }
      </div>
    </div>
  `,
})
export class TerritoryChartComponent {
  readonly data = input<typeof territories>([]);

  donutSegments(): { fill: string; dash: number; gap: number; rotate: number }[] {
    const total = this.data().reduce((acc, t) => acc + t.value, 0) || 1;
    const gap = 3;
    let acc = 0;
    return this.data().map((t) => {
      const frac = t.value / total;
      const dash = Math.max(frac * donutCircumference - gap, 0);
      const rotate = (acc / total) * 360 - 90;
      acc += t.value;
      return { fill: t.fill, dash, gap: donutCircumference - dash, rotate };
    });
  }
}

@Component({
  selector: 'app-top-products-chart',
  standalone: true,
  template: `
    <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      <h3 class="text-sm font-medium text-card-foreground">Productos más vendidos</h3>
      <p class="text-xs text-muted-foreground">Unidades en miles</p>
      <div class="relative mt-4 h-[220px]">
        <div class="absolute inset-0 flex flex-col">
          <div class="flex min-h-0 flex-1">
            <div class="flex shrink-0 flex-col justify-between py-1" [style.width.px]="120">
              @for (p of chartData(); track p.product) {
                <span class="truncate pr-2 text-right text-[11px] text-muted-foreground">{{ p.product }}</span>
              }
            </div>
            <div class="relative flex-1">
              @for (t of [1, 2, 3, 4, 5]; track t) {
                <div class="absolute inset-y-0 border-l border-dashed border-border" [style.left.%]="t * 20"></div>
              }
              <div class="absolute inset-x-0 top-0 flex flex-col justify-between py-1" [style.bottom.px]="24">
                @for (p of chartData(); track p.product; let i = $index) {
                  <div class="flex h-5 items-center">
                    <div
                      class="h-full"
                      [style.width.%]="barWidth(p.unidades)"
                      [style.background-color]="'var(' + productColor(i) + ')'"
                      [style.border-radius]="'0 4px 4px 0'"
                    ></div>
                  </div>
                }
              </div>
            </div>
          </div>
          <div class="flex shrink-0" [style.height.px]="24">
            <div class="shrink-0" [style.width.px]="120"></div>
            <div class="relative flex-1">
              @for (t of [0, 1, 2, 3, 4, 5]; track t) {
                <span class="absolute -translate-x-1/2 text-[11px] text-muted-foreground" [style.left.%]="t * 20">{{ t }}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TopProductsChartComponent {
  readonly data = input<typeof topProducts>([]);

  readonly chartData = computed(() => [...this.data()].reverse());

  readonly productColors = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5'];

  barWidth(v: number): number {
    return (v / 5) * 100;
  }

  productColor(i: number): string {
    return this.productColors[i % this.productColors.length];
  }
}

@Component({
  selector: 'app-sellers-chart',
  standalone: true,
  template: `
    <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      <h3 class="text-sm font-medium text-card-foreground">Rendimiento vendedores</h3>
      <p class="text-xs text-muted-foreground">% de cumplimiento de meta</p>
      <div class="mt-4 flex">
        <div class="flex w-10 shrink-0 flex-col justify-between pr-1.5 text-right" [style.height.px]="190">
          @for (t of sellerTicks; track t) {
            <span class="text-[11px] text-muted-foreground">{{ t }}%</span>
          }
        </div>
        <div class="relative flex-1" [style.height.px]="190">
          @for (t of sellerTicks; track t) {
            <div class="absolute inset-x-0 border-t border-dashed border-border" [style.top.%]="sellerTickTop(t)"></div>
          }
          <div
            class="absolute inset-x-0 border-t border-dashed"
            [style.top.%]="sellerTickTop(100)"
            [style.border-color]="'var(--muted-foreground)'"
          ></div>
          <div class="absolute inset-x-0 top-0 flex items-end" [style.height.px]="190">
            @for (s of data(); track s.name) {
              <div class="flex h-full flex-1 flex-col items-center justify-end">
                <div
                  class="w-6"
                  [style.height.%]="sellerBarHeight(s.cumplimiento)"
                  [style.border-radius]="'4px 4px 0 0'"
                  [class.bg-success]="s.cumplimiento >= 100"
                  [class.bg-warning]="s.cumplimiento < 100"
                ></div>
              </div>
            }
          </div>
        </div>
      </div>
      <div class="mt-1 flex">
        <div class="w-10 shrink-0"></div>
        <div class="flex flex-1">
          @for (s of data(); track s.name) {
            <span class="flex-1 text-center text-[11px] text-muted-foreground">{{ s.name }}</span>
          }
        </div>
      </div>
    </div>
  `,
})
export class SellersChartComponent {
  readonly data = input<typeof sellers>([]);

  readonly sellerTicks = [140, 105, 70, 35, 0];

  sellerTickTop(v: number): number {
    return (1 - v / 140) * 100;
  }

  sellerBarHeight(v: number): number {
    return (v / 140) * 100;
  }
}
