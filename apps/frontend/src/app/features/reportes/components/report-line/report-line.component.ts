import { Component, input } from '@angular/core';

export interface ReportLineItem {
  label: string;
  value: number;
}

const CHART_HEIGHT = 160;
const PLOT_TOP = 10;
const PLOT_BOTTOM = 150;
const VIEW_WIDTH = 300;

let uidCounter = 0;

@Component({
  selector: 'app-report-line',
  standalone: true,
  template: `
    <div class="flex">
      <div class="flex w-10 shrink-0 flex-col justify-between pr-1.5 text-right" [style.height.px]="160">
        @for (t of ticks(); track t) {
          <span class="text-[11px] text-muted-foreground">{{ formatTick()(t) }}</span>
        }
      </div>
      <div class="relative flex-1" [style.height.px]="160">
        <svg class="h-full w-full" [attr.viewBox]="'0 0 ' + VIEW_WIDTH + ' ' + CHART_HEIGHT" preserveAspectRatio="none">
          <defs>
            <linearGradient [attr.id]="gradientId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" [attr.stop-color]="color()" stop-opacity="0.3" />
              <stop offset="95%" [attr.stop-color]="color()" stop-opacity="0" />
            </linearGradient>
          </defs>
          @for (t of ticks(); track t) {
            <line [attr.x1]="0" [attr.x2]="VIEW_WIDTH" [attr.y1]="yOf(t)" [attr.y2]="yOf(t)"
              class="stroke-border" stroke-dasharray="3 3" />
          }
          <polygon [attr.points]="areaPoints()"
            [attr.fill]="gradient() ? 'url(#' + gradientId + ')' : 'transparent'" />
          <polyline [attr.points]="linePoints()" [attr.stroke]="color()" fill="none" stroke-width="2" />
        </svg>
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
  `,
})
export class ReportLineComponent {
  readonly items = input<ReportLineItem[]>([]);
  readonly color = input('#6366f1');
  readonly gradient = input(true);
  readonly formatTick = input<(v: number) => string>((v) => String(v));

  readonly VIEW_WIDTH = VIEW_WIDTH;
  readonly CHART_HEIGHT = CHART_HEIGHT;
  readonly gradientId = 'report-line-grad-' + ++uidCounter;

  private max(): number {
    const values = this.items().map((i) => i.value);
    return Math.max(...values, 1);
  }

  ticks(): number[] {
    const max = this.max();
    return [max, max * 0.75, max * 0.5, max * 0.25, 0];
  }

  yOf(v: number): number {
    return PLOT_BOTTOM - (v / this.max()) * (PLOT_BOTTOM - PLOT_TOP);
  }

  linePoints(): string {
    const items = this.items();
    const n = items.length;
    return items
      .map((item, i) => {
        const x = n > 1 ? (i / (n - 1)) * VIEW_WIDTH : VIEW_WIDTH / 2;
        return `${x},${this.yOf(item.value)}`;
      })
      .join(' ');
  }

  areaPoints(): string {
    return `${this.linePoints()} ${VIEW_WIDTH},${PLOT_BOTTOM} 0,${PLOT_BOTTOM}`;
  }
}
