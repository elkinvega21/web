import { Component, input } from '@angular/core';

export type AppCardSpacing = 'default' | 'sm';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="group/card flex flex-col overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10"
      [class]="className()"
    >
      <ng-content />
    </div>
  `,
})
export class AppCard {
  readonly className = input('');
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `
    <div
      class="flex flex-col items-start gap-1 rounded-t-xl"
      [class.p-4]="spacing() === 'default'"
      [class.p-3]="spacing() === 'sm'"
      [class]="className()"
    >
      <ng-content />
    </div>
  `,
})
export class AppCardHeader {
  readonly className = input('');
  readonly spacing = input<AppCardSpacing>('default');
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `
    <div
      class="text-base font-medium leading-snug"
      [class.text-sm]="spacing() === 'sm'"
      [class]="className()"
    >
      <ng-content />
    </div>
  `,
})
export class AppCardTitle {
  readonly className = input('');
  readonly spacing = input<AppCardSpacing>('default');
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  template: `
    <div class="text-sm text-muted-foreground" [class]="className()">
      <ng-content />
    </div>
  `,
})
export class AppCardDescription {
  readonly className = input('');
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `
    <div
      [class.p-4]="spacing() === 'default'"
      [class.p-3]="spacing() === 'sm'"
      [class]="className()"
    >
      <ng-content />
    </div>
  `,
})
export class AppCardContent {
  readonly className = input('');
  readonly spacing = input<AppCardSpacing>('default');
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: `
    <div
      class="flex items-center rounded-b-xl border-t bg-muted/50"
      [class.p-4]="spacing() === 'default'"
      [class.p-3]="spacing() === 'sm'"
      [class]="className()"
    >
      <ng-content />
    </div>
  `,
})
export class AppCardFooter {
  readonly className = input('');
  readonly spacing = input<AppCardSpacing>('default');
}
