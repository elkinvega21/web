import { Component, effect, input, model, output } from '@angular/core';
import { AppButton } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [AppButton, IconComponent],
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-in fade-in"
          (click)="onBackdropClick()"
          aria-hidden="true"
        ></div>
        <div
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          class="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg animate-in fade-in zoom-in-95"
        >
          @if (icon(); as iconName) {
            <span class="mb-4 flex size-11 items-center justify-center rounded-xl" [class]="iconWrapClass">
              <app-icon [name]="iconName" [size]="22" />
            </span>
          }
          <h2 [id]="titleId" class="text-lg font-semibold tracking-tight text-card-foreground">
            {{ title() }}
          </h2>
          <p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{{ description() }}</p>
          <div class="mt-6 flex justify-end gap-2.5">
            <button appButton variant="outline" size="lg" className="h-10" [disabled]="loading()" (click)="close()">
              {{ cancelLabel() }}
            </button>
            <button
              appButton
              variant="destructive-solid"
              size="lg"
              className="h-10"
              [disabled]="loading()"
              (click)="onConfirm()"
            >
              @if (loading()) {
                <app-icon name="loader-circle" [size]="16" class="animate-spin" />
              }
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AppConfirmDialog {
  readonly open = model(false);
  readonly icon = input<string | null>(null);
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');
  readonly loading = input(false);
  readonly destructive = input(true);

  readonly confirm = output<void>();

  readonly titleId = `confirm-title-${Math.random().toString(36).slice(2, 8)}`;

  constructor() {
    effect(() => {
      if (!this.open()) {
        return () => {};
      }
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !this.loading()) {
          this.close();
        }
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
      };
    });
  }

  get iconWrapClass(): string {
    return this.destructive()
      ? 'bg-destructive/10 text-destructive'
      : 'bg-accent text-accent-foreground';
  }

  close(): void {
    if (!this.loading()) {
      this.open.set(false);
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onBackdropClick(): void {
    this.close();
  }
}
