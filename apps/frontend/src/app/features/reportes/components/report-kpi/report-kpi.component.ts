import { Component, input } from '@angular/core';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-report-kpi',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
      <p class="flex items-center gap-1 text-[11px] text-muted-foreground">
        <app-icon [name]="icon()" [size]="12" /> {{ label() }}
      </p>
      <p class="mt-1 font-mono text-lg font-semibold" [class]="color() || 'text-card-foreground'">{{ value() }}</p>
    </div>
  `,
})
export class ReportKpiComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input.required<string>();
  readonly color = input('');
}
