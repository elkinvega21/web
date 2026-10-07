import { Component, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { inject } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      role="checkbox"
      [attr.id]="id()"
      [attr.aria-checked]="checked()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [disabled]="disabled()"
      (click)="toggle()"
      [class]="hostClass"
    >
      @if (checked()) {
        <app-icon name="check" [size]="14" />
      }
    </button>
  `,
})
export class AppCheckbox implements ControlValueAccessor {
  readonly id = input<string | null>(null);
  readonly className = input('');
  readonly ariaDescribedBy = input<string | null>(null);
  readonly disabled = signal(false);
  readonly checked = model(false);

  private onChange?: (value: boolean) => void;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  get hostClass(): string {
    const base =
      'flex size-5 shrink-0 items-center justify-center rounded-[6px] border border-input bg-card transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50';
    const checkedCls = this.checked() ? 'border-primary bg-primary text-primary-foreground' : '';
    return `${base} ${checkedCls} ${this.className()}`.trim();
  }

  toggle(): void {
    this.checked.update((value) => !value);
    this.onChange?.(this.checked());
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
