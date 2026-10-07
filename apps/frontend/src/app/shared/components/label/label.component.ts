import { Component, input } from '@angular/core';

@Component({
  selector: 'app-label',
  standalone: true,
  template: `
    <label
      class="flex items-center gap-1 text-sm font-medium text-foreground select-none"
      [attr.for]="htmlFor()"
      [class]="className()"
    >
      <ng-content />
    </label>
  `,
})
export class AppLabel {
  readonly htmlFor = input<string | null>(null);
  readonly className = input('');
}
