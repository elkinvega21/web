import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  template: `
    <div
      class="flex justify-between gap-2"
      role="group"
      [attr.aria-label]="'Código de ' + length() + ' dígitos'"
    >
      @for (i of boxes(); track i) {
        <input
          #box
          type="text"
          inputmode="numeric"
          [attr.autocomplete]="i === 0 ? 'one-time-code' : 'off'"
          maxlength="1"
          [value]="value()[i]"
          [disabled]="disabled()"
          [attr.aria-invalid]="invalid() ? true : null"
          [attr.aria-label]="'Dígito ' + (i + 1)"
          (input)="onInput($event, i)"
          (keydown)="onKeyDown($event, i)"
          (paste)="onPaste($event)"
          [class]="boxClass"
        />
      }
    </div>
  `,
})
export class AppOtpInput implements AfterViewInit {
  readonly length = input(6);
  readonly value = input('');
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly autoFocus = input(false);

  readonly valueChange = output<string>();
  readonly complete = output<string>();

  @ViewChildren('box') boxEls?: QueryList<ElementRef<HTMLInputElement>>;

  readonly boxes = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  get boxClass(): string {
    const base =
      'h-13 w-full rounded-lg border border-input bg-card text-center text-lg font-semibold text-foreground shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50';
    return this.invalid() ? `${base} border-destructive ring-[3px] ring-destructive/20` : base;
  }

  ngAfterViewInit(): void {
    if (this.autoFocus() && this.boxEls?.first) {
      this.boxEls.first.nativeElement.focus();
    }
  }

  private setDigit(index: number, digit: string): void {
    const chars = this.value().split('');
    chars[index] = digit;
    const next = chars.join('').slice(0, this.length());
    this.valueChange.emit(next);
    if (digit && next.length === this.length()) {
      this.complete.emit(next);
    }
  }

  onInput(event: Event, index: number): void {
    const raw = (event.target as HTMLInputElement).value;
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    this.setDigit(index, digit);
    if (index < this.length() - 1) {
      this.boxEls?.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.value()[index]) {
        this.setDigit(index, '');
      } else if (index > 0) {
        this.boxEls?.toArray()[index - 1]?.nativeElement.focus();
        this.setDigit(index - 1, '');
      }
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      this.boxEls?.toArray()[index - 1]?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this.boxEls?.toArray()[index + 1]?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')
      .replace(/\D/g, '')
      .slice(0, this.length());
    if (!pasted) return;
    this.valueChange.emit(pasted);
    const focusIndex = Math.min(pasted.length, this.length() - 1);
    this.boxEls?.toArray()[focusIndex]?.nativeElement.focus();
    if (pasted.length === this.length()) {
      this.complete.emit(pasted);
    }
  }
}
