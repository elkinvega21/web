import { Component, input } from '@angular/core';

import type { Kpi } from '../../../../core/data/dashboard-data';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  template: `
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      @for (kpi of data(); track kpi.key) {
        <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">{{ kpi.label }}</span>
            <app-icon [name]="kpi.icon" [size]="16" class="shrink-0 text-muted-foreground" />
          </div>
          <p class="mt-2 text-2xl font-semibold tracking-tight text-card-foreground tabular-nums">{{ kpi.value }}</p>
          <div class="mt-2 flex items-center justify-between">
            <span class="inline-flex items-center gap-1 text-xs" [class.text-success]="kpi.delta >= 0" [class.text-warning]="kpi.delta < 0">
              <app-icon [name]="deltaIcon(kpi.delta)" [size]="12" />
              {{ deltaPrefix(kpi.delta) }}{{ kpi.delta }}%
            </span>
            <span class="text-xs text-muted-foreground">{{ kpi.deltaLabel }}</span>
          </div>
          <div class="mt-3">
            <svg class="h-8 w-full" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient [attr.id]="'spark-' + kpi.key" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.2" />
                  <stop offset="100%" stop-color="var(--primary)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path [attr.d]="sparkPath(kpi.spark)" fill="none" stroke="var(--primary)" stroke-width="2" vector-effect="non-scaling-stroke" />
              <path [attr.d]="sparkPath(kpi.spark) + ' L 100 32 L 0 32 Z'" [attr.fill]="'url(#spark-' + kpi.key + ')'" />
            </svg>
          </div>
        </div>
      }
    </div>
  `,
  imports: [IconComponent],
})
export class KpiCardsComponent {
  readonly data = input<Kpi[]>([]);

  deltaIcon(delta: number): string {
    return delta >= 0 ? 'trending-up' : 'trending-down';
  }

  deltaPrefix(delta: number): string {
    return delta > 0 ? '+' : '';
  }

  sparkPath(values: number[]): string {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * 100;
        const y = 32 - 4 - ((v - min) / range) * 24;
        return (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
      })
      .join(' ');
  }
}
