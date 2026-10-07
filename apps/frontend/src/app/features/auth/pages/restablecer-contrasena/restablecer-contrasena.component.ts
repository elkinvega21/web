import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { delay, passwordScore } from '../../../../core/data/auth-config';
import { AuthShellComponent } from '../../../../shared/layout/auth-shell/auth-shell.component';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppFormAlert } from '../../../../shared/components/form-alert/form-alert.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppPasswordInput } from '../../../../shared/components/password-input/password-input.component';
import { AppPasswordStrength } from '../../../../shared/components/password-strength/password-strength.component';

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AuthShellComponent,
    AppButton,
    AppField,
    AppFormAlert,
    IconComponent,
    AppPasswordInput,
    AppPasswordStrength,
  ],
  template: `
    <app-auth-shell>
      <div class="flex flex-col gap-7">
        @if (status() === 'done') {
          <div class="flex flex-col gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="circle-check" [size]="22" />
            </span>
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Contraseña actualizada</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Tu contraseña se restableció correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
              </p>
            </div>
          </div>

          <app-form-alert tone="success">
            Por seguridad, se cerraron todas las sesiones activas en otros dispositivos.
          </app-form-alert>

          <button appButton size="lg" className="h-11 w-full text-sm" (click)="goToLogin()">
            Ir a iniciar sesión
          </button>
        } @else {
          <div class="flex flex-col gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="lock-keyhole" [size]="22" />
            </span>
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Crea una nueva contraseña</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Elige una contraseña segura que no hayas usado antes en tu cuenta.
              </p>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" novalidate class="flex flex-col gap-4">
            <app-field id="password" label="Nueva contraseña" [error]="passwordError()">
              <app-password-input
                name="new-password"
                autocomplete="new-password"
                placeholder="Ingresa tu nueva contraseña"
                [ngModel]="password"
                [disabled]="loading()"
                (ngModelChange)="onPasswordChange($event)"
              />
            </app-field>

            <app-password-strength [value]="password" />

            <app-field id="confirm" label="Confirmar contraseña" [error]="confirmError()">
              <app-password-input
                name="confirm-password"
                autocomplete="new-password"
                placeholder="Repite tu nueva contraseña"
                [ngModel]="confirm"
                [disabled]="loading()"
                (ngModelChange)="onConfirmChange($event)"
              />
            </app-field>

            <button appButton type="submit" size="lg" className="mt-1 h-11 w-full text-sm" [disabled]="loading()">
              @if (loading()) {
                <app-icon name="loader-circle" [size]="16" class="animate-spin" />
                Guardando…
              } @else {
                Restablecer contraseña
              }
            </button>
          </form>

          <a
            routerLink="/login"
            class="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <app-icon name="arrow-left" [size]="16" />
            Volver a iniciar sesión
          </a>
        }
      </div>
    </app-auth-shell>
  `,
})
export class RestablecerContrasenaComponent {
  private readonly router = inject(Router);

  password = '';
  confirm = '';

  readonly passwordError = signal<string | null>(null);
  readonly confirmError = signal<string | null>(null);
  readonly status = signal<'idle' | 'loading' | 'done'>('idle');
  readonly loading = computed(() => this.status() === 'loading');

  onPasswordChange(value: string): void {
    this.password = value;
    this.passwordError.set(null);
  }

  onConfirmChange(value: string): void {
    this.confirm = value;
    this.confirmError.set(null);
  }

  validate(): boolean {
    const errors: { password?: string; confirm?: string } = {};
    if (!this.password) {
      errors.password = 'Crea una nueva contraseña.';
    } else if (passwordScore(this.password) < 4) {
      errors.password = 'La contraseña no cumple los requisitos de seguridad.';
    }
    if (!this.confirm) {
      errors.confirm = 'Confirma tu contraseña.';
    } else if (this.confirm !== this.password) {
      errors.confirm = 'Las contraseñas no coinciden.';
    }
    this.passwordError.set(errors.password ?? null);
    this.confirmError.set(errors.confirm ?? null);
    return !errors.password && !errors.confirm;
  }

  onSubmit(): void {
    if (this.loading()) {
      return;
    }
    if (!this.validate()) {
      return;
    }
    this.status.set('loading');
    void delay(1200).then(() => this.status.set('done'));
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
