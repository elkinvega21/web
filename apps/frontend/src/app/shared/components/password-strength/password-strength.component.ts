import { Component, input } from '@angular/core';
import { checkPassword, passwordScore, passwordStrengthLabel } from '../../../core/data/auth-config';
import { IconComponent } from '../icon/icon.component';

interface Requirement {
  key: 'length' | 'upper' | 'lower' | 'number' | 'symbol';
  label: string;
}

const requirements: Requirement[] = [
  { key: 'length', label: 'Mínimo 8 caracteres' },
  { key: 'upper', label: 'Una letra mayúscula' },
  { key: 'lower', label: 'Una letra minúscula' },
  { key: 'number', label: 'Un número' },
  { key: 'symbol', label: 'Un símbolo (!@#$…)' },
];

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="flex flex-col gap-2.5">
      <div class="flex items-center gap-2">
        <div class="flex h-1.5 flex-1 gap-1" aria-hidden="true">
          @for (i of [0, 1, 2, 3, 4]; track i) {
            <span class="flex-1 rounded-full transition-colors" [class]="i < score() ? toneColor() : 'bg-border'"></span>
          }
        </div>
        @if (value().length > 0) {
          <span class="text-xs font-medium" [class]="toneTextClass()">{{ label() }}</span>
        }
      </div>

      <ul class="grid grid-cols-1 gap-1 sm:grid-cols-2">
        @for (item of requirements; track item.key) {
          <li
            class="flex items-center gap-1.5 text-xs"
            [class.text-success-foreground]="checks()[item.key]"
            [class.text-muted-foreground]="!checks()[item.key]"
          >
            @if (checks()[item.key]) {
              <app-icon name="check" [size]="14" class="shrink-0 text-success" />
            } @else {
              <app-icon name="x" [size]="14" class="shrink-0 text-muted-foreground/60" />
            }
            {{ item.label }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class AppPasswordStrength {
  readonly requirements = requirements;
  readonly value = input('');

  checks() {
    return checkPassword(this.value());
  }

  score(): number {
    return passwordScore(this.value());
  }

  label(): string {
    return passwordStrengthLabel(this.score()).label;
  }

  toneColor(): string {
    const tone = passwordStrengthLabel(this.score()).tone;
    return tone === 'weak'
      ? 'bg-destructive'
      : tone === 'medium'
        ? 'bg-warning'
        : 'bg-success';
  }

  toneTextClass(): string {
    const tone = passwordStrengthLabel(this.score()).tone;
    return tone === 'weak'
      ? 'text-destructive'
      : tone === 'medium'
        ? 'text-warning-foreground'
        : 'text-success-foreground';
  }
}
