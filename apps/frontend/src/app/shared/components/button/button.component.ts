import { Component, input, booleanAttribute } from '@angular/core';

export type AppButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'destructive-solid'
  | 'link';

export type AppButtonSize =
  | 'default'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-lg';

const base =
  'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none active:scale-[0.98] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<AppButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border-border bg-background hover:bg-muted hover:text-foreground',
  // El hover repetía el color de reposo: el variante más usado no daba
  // ninguna señal de que fuera pulsable.
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
  ghost: 'hover:bg-muted hover:text-foreground',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  'destructive-solid': 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  link: 'text-primary underline-offset-4 hover:underline',
};

/**
 * El relleno horizontal crece con la altura. Antes casi todos los tamaños
 * compartían `px-2.5`, así que el texto quedaba pegado a los bordes en los
 * botones grandes.
 */
const sizes: Record<AppButtonSize, string> = {
  default: 'h-9 gap-1.5 px-3.5',
  xs: 'h-7 gap-1 rounded-md px-2.5 text-xs',
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
  lg: 'h-10 gap-2 px-4',
  icon: 'size-9',
  'icon-xs': 'size-7 rounded-md',
  'icon-sm': 'size-8 rounded-lg',
  'icon-lg': 'size-10',
};

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  host: {
    '[class]': '_class',
    '[attr.disabled]': 'disabled() ? "" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
  },
  template: `<ng-content />`,
})
export class AppButton {
  readonly variant = input<AppButtonVariant>('default');
  readonly size = input<AppButtonSize>('default');
  readonly className = input('');
  /**
   * Este input sombrea la propiedad nativa `disabled`, así que si no se
   * reenvía al host el botón nunca se deshabilita por mucho que la plantilla
   * haga `[disabled]="loading()"`.
   */
  readonly disabled = input(false, { transform: booleanAttribute });

  get _class(): string {
    return [
      base,
      variants[this.variant()],
      sizes[this.size()],
      // `:disabled` no aplica a <a>, que también admite este componente.
      this.disabled() ? 'pointer-events-none opacity-50' : '',
      this.className(),
    ]
      .filter(Boolean)
      .join(' ');
  }
}
