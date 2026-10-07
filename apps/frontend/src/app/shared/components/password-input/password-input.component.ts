import { Component, ElementRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { appInputBaseClass } from '../input/input.component';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="relative">
      <input
        [type]="visible() ? 'text' : 'password'"
        [value]="value()"
        [disabled]="disabled()"
        [placeholder]="placeholder()"
        [attr.autocomplete]="autocomplete()"
        [class]="inputClass"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      <button
        type="button"
        (click)="toggle()"
        [attr.aria-label]="visible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        [attr.aria-pressed]="visible()"
        class="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/25"
      >
        @if (visible()) {
          <app-icon name="eye-off" [size]="18" />
        } @else {
          <app-icon name="eye" [size]="18" />
        }
      </button>
    </div>
  `,
})
export class AppPasswordInput implements ControlValueAccessor {
  readonly className = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('');
  readonly disabled = signal(false);

  readonly visible = signal(false);
  readonly value = signal('');

  private onChange?: (value: string) => void;
  onTouched: () => void = () => {};

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  get inputClass(): string {
    return `${appInputBaseClass} pr-10 ${this.className()}`.trim();
  }

  toggle(): void {
    this.visible.update((v) => !v);
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange?.(value);
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
