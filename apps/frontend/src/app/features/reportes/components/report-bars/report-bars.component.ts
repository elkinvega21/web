import { Component, computed, input } from '@angular/core';

export interface ReportBarItem {
  label: string;
  value: number;
  secondary?: number;
}

export const REPORT_CHART_COLORS = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ec4899',
  '#06b6d4',
  '#8b5cf6',
  '#14b8a6',
  '#f97316',
];

const CHART_HEIGHT = 190;

@Component({
  selector: 'app-report-bars',
  standalone: true,
  template: `
    <div class="flex">
      <div class="flex w-10 shrink-0 flex-col justify-between pr-1.5 text-right" [style.height.px]="190">
        @for (t of ticks; track t) {
          <span class="text-[11px] text-muted-foreground">{{ formatTick()(t) }}</span>
        }
      </div>
      <div class="relative flex-1" [style.height.px]="190">
        @for (t of ticks; track t) {
          <div class="absolute inset-x-0 border-t border-dashed border-border" [style.top.%]="tickTop(t)"></div>
        }
        <div class="absolute inset-x-0 top-0 flex items-end" [style.height.px]="190">
          @for (item of items(); track item.label; let i = $index) {
            <div class="flex h-full flex-1 items-end justify-center gap-0.5">
              @if (item.secondary !== undefined) {
                <div class="w-2.5" [style.height.%]="barHeight(item.secondary)"
                  [style.background-color]="secondaryColor()" [style.border-radius]="'4px 4px 0 0'"></div>
              }
              <div class="w-2.5" [style.height.%]="barHeight(item.value)"
                [style.background-color]="primaryColor() || colorAt(i)" [style.border-radius]="'4px 4px 0 0'"></div>
            </div>
          }
        </div>
      </div>
    </div>
    <div class="mt-1 flex">
      <div class="w-10 shrink-0"></div>
      <div class="flex flex-1">
        @for (item of items(); track item.label) {
          <span class="flex-1 text-center text-[11px] text-muted-foreground">{{ item.label }}</span>
        }
      </div>
    </div>
    @if (showLegend()) {
      <div class="mt-3 flex items-center justify-center gap-4">
        <span class="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span class="size-2 rounded-sm" [style.background-color]="primaryColor() || colorAt(0)"></span>
          Actual
        </span>
        <span class="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span class="size-2 rounded-sm" [style.background-color]="secondaryColor()"></span>
          Período anterior
        </span>
      </div>
    }
  `,
})
export class ReportBarsComponent {
  readonly items = input<ReportBarItem[]>([]);
  readonly colors = input<string[]>(REPORT_CHART_COLORS);
  readonly primaryColor = input<string | null>(null);
  readonly secondaryColor = input('hsl(var(--muted))');
  readonly showLegend = input(false);
  readonly formatTick = input<(v: number) => string>((v) => String(Math.round(v)));

  readonly max = computed(() => {
    const values = this.items().flatMap((i) => (i.secondary !== undefined ? [i.value, i.secondary] : [i.value]));
    return Math.max(...values, 1) * 1.15;
  });

  get ticks(): number[] {
    return [this.max(), this.max() * 0.75, this.max() * 0.5, this.max() * 0.25, 0];
  }

  tickTop(v: number): number {
    return (1 - v / this.max()) * 100;
  }

  barHeight(v: number): number {
    return (v / this.max()) * 100;
  }

  colorAt(i: number): string {
    const colors = this.colors();
    return colors[i % colors.length];
  }
}
