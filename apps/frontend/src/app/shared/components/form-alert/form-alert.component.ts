import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type AppFormAlertTone = 'error' | 'success' | 'info' | 'locked';

@Component({
  selector: 'app-form-alert',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div
      [attr.role]="tone() === 'error' || tone() === 'locked' ? 'alert' : 'status'"
      class="flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] leading-relaxed"
      [class]="wrapClass"
    >
      <app-icon [name]="iconName" [size]="16" class="mt-0.5 shrink-0" [class]="iconColor" />
      <div>
        @if (title(); as titleText) {
          <p class="font-semibold">{{ titleText }}</p>
        }
        <ng-content />
      </div>
    </div>
  `,
})
export class AppFormAlert {
  readonly tone = input<AppFormAlertTone>('error');
  readonly title = input<string | null>(null);
  readonly className = input('');

  get wrapClass(): string {
    const map: Record<AppFormAlertTone, string> = {
      error: 'border-destructive/30 bg-destructive/8 text-destructive',
      locked: 'border-warning/40 bg-warning/12 text-warning-foreground',
      success: 'border-success/30 bg-success/10 text-success-foreground',
      info: 'border-border bg-muted text-foreground',
    };
    return `${map[this.tone()]} ${this.className()}`.trim();
  }

  get iconName(): string {
    return this.tone() === 'locked'
      ? 'lock'
      : this.tone() === 'success'
        ? 'circle-check'
        : this.tone() === 'info'
          ? 'info'
          : 'circle-alert';
  }

  get iconColor(): string {
    const map: Record<AppFormAlertTone, string> = {
      error: 'text-destructive',
      locked: 'text-warning',
      success: 'text-success',
      info: 'text-muted-foreground',
    };
    return map[this.tone()];
  }
}
