import { Component, computed, input } from '@angular/core';

export interface ReportHbarItem {
  nombre: string;
  valor: number;
  label?: string;
}

import { REPORT_CHART_COLORS } from '../report-bars/report-bars.component';

@Component({
  selector: 'app-report-hbars',
  standalone: true,
  template: `
    <div class="space-y-3">
      @for (item of items(); track item.nombre; let i = $index) {
        <div class="flex items-center gap-2">
          <span class="truncate text-right text-[11px] text-muted-foreground" [style.width.px]="nameWidth()">{{ item.nombre }}</span>
          <div class="relative h-5 flex-1">
            <div class="absolute inset-0 rounded bg-muted/30"></div>
            <div class="absolute inset-y-0 left-0" [style.width.%]="barWidth(item.valor)"
              [style.background-color]="barColor(item, i)" [style.border-radius]="'4px'"></div>
          </div>
          <span class="w-16 shrink-0 text-right font-mono text-[11px] text-muted-foreground">{{ formatTick()(item.valor) }}</span>
        </div>
      }
    </div>
  `,
})
export class ReportHbarsComponent {
  readonly items = input<ReportHbarItem[]>([]);
  readonly colors = input<string[]>(REPORT_CHART_COLORS);
  readonly nameWidth = input(110);
  readonly domain = input<number | null>(null);
  readonly colorOf = input<((item: ReportHbarItem) => string | null) | null>(null);
  readonly formatTick = input<(v: number) => string>((v) => String(Math.round(v)));

  readonly max = computed(() => {
    if (this.domain() !== null) {
      return this.domain() as number;
    }
    return Math.max(...this.items().map((i) => i.valor), 1);
  });

  barWidth(v: number): number {
    return Math.min((v / this.max()) * 100, 100);
  }

  colorAt(i: number): string {
    const colors = this.colors();
    return colors[i % colors.length];
  }

  barColor(item: ReportHbarItem, i: number): string {
    const fn = this.colorOf();
    return (fn ? fn(item) : null) || this.colorAt(i);
  }
}
