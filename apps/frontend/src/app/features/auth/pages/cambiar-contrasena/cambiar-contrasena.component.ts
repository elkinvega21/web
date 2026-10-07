import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DEMO_USER, delay, passwordScore } from '../../../../core/data/auth-config';
import { AuthShellComponent } from '../../../../shared/layout/auth-shell/auth-shell.component';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppFormAlert } from '../../../../shared/components/form-alert/form-alert.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppPasswordInput } from '../../../../shared/components/password-input/password-input.component';
import { AppPasswordStrength } from '../../../../shared/components/password-strength/password-strength.component';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [
    FormsModule,
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
                Tu contraseña se cambió correctamente. Úsala la próxima vez que inicies sesión.
              </p>
            </div>
          </div>

          <app-form-alert tone="success">
            Por seguridad, cerramos tus otras sesiones activas en otros dispositivos.
          </app-form-alert>

          <button appButton size="lg" className="h-11 w-full text-sm" (click)="goToDashboard()">
            Volver al panel
          </button>
        } @else {
          <div class="flex flex-col gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="key-round" [size]="22" />
            </span>
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Cambiar contraseña</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Confirma tu contraseña actual y define una nueva para mantener tu cuenta segura.
              </p>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" novalidate class="flex flex-col gap-4">
            <app-field id="current" label="Contraseña actual" [error]="currentError()">
              <app-password-input
                name="current-password"
                autocomplete="current-password"
                placeholder="Tu contraseña actual"
                [ngModel]="current"
                [disabled]="loading()"
                (ngModelChange)="onCurrentChange($event)"
              />
            </app-field>

            <div class="my-1 h-px bg-border"></div>

            <app-field id="next" label="Nueva contraseña" [error]="nextError()">
              <app-password-input
                name="new-password"
                autocomplete="new-password"
                placeholder="Ingresa tu nueva contraseña"
                [ngModel]="next"
                [disabled]="loading()"
                (ngModelChange)="onNextChange($event)"
              />
            </app-field>

            <app-password-strength [value]="next" />

            <app-field id="confirm" label="Confirmar nueva contraseña" [error]="confirmError()">
              <app-password-input
                name="confirm-password"
                autocomplete="new-password"
                placeholder="Repite tu nueva contraseña"
                [ngModel]="confirm"
                [disabled]="loading()"
                (ngModelChange)="onConfirmChange($event)"
              />
            </app-field>

            <div class="mt-2 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                appButton
                type="button"
                variant="outline"
                size="lg"
                className="h-11"
                [disabled]="loading()"
                (click)="goToDashboard()"
              >
                Cancelar
              </button>
              <button appButton type="submit" size="lg" className="h-11" [disabled]="loading()">
                @if (loading()) {
                  <app-icon name="loader-circle" [size]="16" class="animate-spin" />
                  Guardando…
                } @else {
                  Guardar cambios
                }
              </button>
            </div>
          </form>
        }
      </div>
    </app-auth-shell>
  `,
})
export class CambiarContrasenaComponent {
  private readonly router = inject(Router);

  current = '';
  next = '';
  confirm = '';

  readonly currentError = signal<string | null>(null);
  readonly nextError = signal<string | null>(null);
  readonly confirmError = signal<string | null>(null);
  readonly status = signal<'idle' | 'loading' | 'done'>('idle');
  readonly loading = computed(() => this.status() === 'loading');

  onCurrentChange(value: string): void {
    this.current = value;
    this.currentError.set(null);
  }

  onNextChange(value: string): void {
    this.next = value;
    this.nextError.set(null);
  }

  onConfirmChange(value: string): void {
    this.confirm = value;
    this.confirmError.set(null);
  }

  validate(): boolean {
    const errors: { current?: string; next?: string; confirm?: string } = {};
    if (!this.current) {
      errors.current = 'Ingresa tu contraseña actual.';
    }
    if (!this.next) {
      errors.next = 'Crea una nueva contraseña.';
    } else if (passwordScore(this.next) < 4) {
      errors.next = 'La contraseña no cumple los requisitos de seguridad.';
    } else if (this.next === this.current) {
      errors.next = 'La nueva contraseña debe ser diferente a la actual.';
    }
    if (!this.confirm) {
      errors.confirm = 'Confirma tu nueva contraseña.';
    } else if (this.confirm !== this.next) {
      errors.confirm = 'Las contraseñas no coinciden.';
    }
    this.currentError.set(errors.current ?? null);
    this.nextError.set(errors.next ?? null);
    this.confirmError.set(errors.confirm ?? null);
    return !errors.current && !errors.next && !errors.confirm;
  }

  async onSubmit(): Promise<void> {
    if (this.loading()) {
      return;
    }
    if (!this.validate()) {
      return;
    }
    this.status.set('loading');
    await delay(1200);

    if (this.current !== DEMO_USER.password) {
      this.status.set('idle');
      this.currentError.set('La contraseña actual es incorrecta.');
      return;
    }

    this.status.set('done');
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
