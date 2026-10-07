import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-mark',
  standalone: true,
  template: `
    <div class="flex items-center gap-2.5" [class]="className()">
      <span [class]="badgeClass" aria-hidden="true">
        <svg viewBox="0 0 24 24" class="size-5 text-primary-foreground" fill="none">
          <path d="M12 3 4 19h16L12 3Z" fill="currentColor" fill-opacity="0.9"></path>
          <path d="m12 10-4 9h8l-4-9Z" fill="currentColor" fill-opacity="0.5"></path>
        </svg>
      </span>
      @if (showText()) {
        <div class="leading-tight">
          <p [class]="titleClass">
            Adventure Retail
          </p>
          <p [class]="subtitleClass">
            ERP
          </p>
        </div>
      }
    </div>
  `,
})
export class BrandMarkComponent {
  readonly className = input('');
  readonly showText = input(true);
  readonly invert = input(false);

  get badgeClass(): string {
    return this.invert()
      ? 'flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15'
      : 'flex size-9 items-center justify-center rounded-lg bg-primary';
  }

  get titleClass(): string {
    return this.invert()
      ? 'text-sm font-semibold tracking-tight text-primary-foreground'
      : 'text-sm font-semibold tracking-tight text-foreground';
  }

  get subtitleClass(): string {
    return this.invert()
      ? 'text-[11px] font-medium text-primary-foreground/70'
      : 'text-[11px] font-medium text-muted-foreground';
  }
}
