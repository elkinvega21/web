import { Component, computed, input } from '@angular/core';

export interface ReportDonutItem {
  nombre: string;
  valor: number;
}

import { REPORT_CHART_COLORS } from '../report-bars/report-bars.component';

const donutCircumference = 2 * Math.PI * 68.5;

@Component({
  selector: 'app-report-donut',
  standalone: true,
  template: `
    <div class="flex h-[220px] items-center justify-center">
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
      @for (item of items(); track item.nombre; let i = $index) {
        <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span class="size-2 rounded-sm" [style.background-color]="colorAt(i)"></span>
          {{ labelFormat()(item.nombre, item.valor) }}
        </span>
      }
    </div>
  `,
})
export class ReportDonutComponent {
  readonly items = input<ReportDonutItem[]>([]);
  readonly colors = input<string[]>(REPORT_CHART_COLORS);
  readonly labelFormat = input<(nombre: string, valor: number) => string>(
    (nombre, valor) => `${nombre} (${valor})`,
  );

  donutSegments(): { fill: string; dash: number; gap: number; rotate: number }[] {
    const items = this.items();
    const total = items.reduce((acc, i) => acc + i.valor, 0) || 1;
    const gap = 3;
    let acc = 0;
    return items.map((item, i) => {
      const frac = item.valor / total;
      const dash = Math.max(frac * donutCircumference - gap, 0);
      const rotate = (acc / total) * 360 - 90;
      acc += item.valor;
      return { fill: this.colorAt(i), dash, gap: donutCircumference - dash, rotate };
    });
  }

  colorAt(i: number): string {
    const colors = this.colors();
    return colors[i % colors.length];
  }
}
