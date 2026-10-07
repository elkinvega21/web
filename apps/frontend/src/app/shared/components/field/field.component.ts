import { Component, input } from '@angular/core';
import { AppLabel } from '../label/label.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [AppLabel, IconComponent],
  template: `
    <div class="flex flex-col gap-1.5">
      <app-label [htmlFor]="id()">{{ label() }}</app-label>
      <ng-content />
      @if (hint(); as hintText) {
        @if (!error()) {
          <p [id]="id() + '-hint'" class="text-xs text-muted-foreground">{{ hintText }}</p>
        }
      }
      @if (error(); as errorText) {
        <p
          [id]="id() + '-error'"
          class="flex items-center gap-1 text-xs font-medium text-destructive"
        >
          <app-icon name="circle-alert" [size]="14" class="shrink-0" />
          {{ errorText }}
        </p>
      }
    </div>
  `,
})
export class AppField {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
}
