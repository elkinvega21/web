import { Directive, ElementRef, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 * Altura h-10 (40px) para casar con el botón `lg`, que es el tamaño con el que
 * conviven en formularios y barras de acción. Antes el input medía h-11 (44px)
 * y el botón por defecto h-8 (32px): puestos en la misma fila no alineaban.
 */
export const appInputBaseClass =
  'flex h-10 w-full min-w-0 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20';

@Directive({
  selector: 'input[appInput]',
  standalone: true,
  host: {
    '[class]': 'hostClass',
    '(input)': 'onInput($event)',
    '(blur)': 'onTouched()',
  },
})
export class AppInput implements ControlValueAccessor {
  readonly className = input('');

  private readonly el = inject(ElementRef);
  private readonly _disabled = signal(false);
  private ngControl: NgControl | null = null;

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.ngControl = inject(NgControl, { optional: true, self: true });
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get hostClass(): string {
    return `${appInputBaseClass} ${this.className()}`.trim();
  }

  writeValue(value: string | null): void {
    (this.el.nativeElement as HTMLInputElement).value = value ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    this.onChange((event.target as HTMLInputElement).value);
  }
}

@Directive({
  selector: 'textarea[appInput]',
  standalone: true,
  host: {
    '[class]': 'hostClass',
    '(input)': 'onInput($event)',
    '(blur)': 'onTouched()',
  },
})
export class AppTextarea implements ControlValueAccessor {
  readonly className = input('');

  private readonly el = inject(ElementRef);
  private readonly _disabled = signal(false);

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  get hostClass(): string {
    return `${appInputBaseClass} min-h-20 py-2.5 ${this.className()}`.trim();
  }

  writeValue(value: string | null): void {
    (this.el.nativeElement as HTMLTextAreaElement).value = value ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    this.onChange((event.target as HTMLTextAreaElement).value);
  }
}
