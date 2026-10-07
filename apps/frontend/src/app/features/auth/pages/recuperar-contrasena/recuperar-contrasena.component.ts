import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { delay, isValidEmail } from '../../../../core/data/auth-config';
import { AuthShellComponent } from '../../../../shared/layout/auth-shell/auth-shell.component';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppFormAlert } from '../../../../shared/components/form-alert/form-alert.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppInput } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AuthShellComponent,
    AppButton,
    AppField,
    AppFormAlert,
    IconComponent,
    AppInput,
  ],
  template: `
    <app-auth-shell>
      <div class="flex flex-col gap-7">
        @if (status() === 'sent') {
          <div class="flex flex-col gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="mail-check" [size]="22" />
            </span>
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Revisa tu correo</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Enviamos un código de verificación a
                <span class="font-medium text-foreground">{{ email }}</span>.
                Úsalo para continuar con el restablecimiento.
              </p>
            </div>
          </div>

          <app-form-alert tone="success">
            Si no ves el correo en unos minutos, revisa la carpeta de spam o solicita el reenvío del código.
          </app-form-alert>

          <div class="flex flex-col gap-2.5">
            <button appButton size="lg" className="h-11 w-full text-sm" (click)="goToLogin()">
              Ir a iniciar sesión
            </button>
            <button appButton variant="ghost" size="lg" className="h-11 w-full text-sm" (click)="resetForm()">
              Usar otro correo
            </button>
          </div>
        } @else {
          <div class="flex flex-col gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon name="key-round" [size]="22" />
            </span>
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Recupera tu contraseña</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Ingresa el correo asociado a tu cuenta y te enviaremos un código para restablecerla.
              </p>
            </div>
          </div>

          <form (ngSubmit)="onSubmit()" novalidate class="flex flex-col gap-4">
            <app-field id="email" label="Correo corporativo" [error]="error()">
              <input
                appInput
                id="email"
                name="email"
                type="email"
                inputmode="email"
                autocomplete="username"
                placeholder="tu.nombre@adventureretail.com"
                [ngModel]="email"
                [disabled]="loading()"
                [attr.disabled]="loading() || null"
                [attr.aria-invalid]="error() ? 'true' : null"
                (ngModelChange)="onEmailChange($event)"
              />
            </app-field>

            <button appButton type="submit" size="lg" className="h-11 w-full text-sm" [disabled]="loading()">
              @if (loading()) {
                <app-icon name="loader-circle" [size]="16" class="animate-spin" />
                Enviando código…
              } @else {
                <app-icon name="send" [size]="16" />
                Enviar código
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
export class RecuperarContrasenaComponent {
  private readonly router = inject(Router);

  email = '';

  readonly error = signal<string | null>(null);
  readonly status = signal<'idle' | 'loading' | 'sent'>('idle');
  readonly loading = computed(() => this.status() === 'loading');

  onEmailChange(value: string): void {
    this.email = value;
    this.error.set(null);
  }

  onSubmit(): void {
    if (this.loading()) {
      return;
    }
    if (!this.email.trim()) {
      this.error.set('El correo es obligatorio.');
      return;
    }
    if (!isValidEmail(this.email)) {
      this.error.set('Ingresa un correo válido.');
      return;
    }
    this.error.set(null);
    this.status.set('loading');
    void delay(1100).then(() => this.status.set('sent'));
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resetForm(): void {
    this.status.set('idle');
  }
}
