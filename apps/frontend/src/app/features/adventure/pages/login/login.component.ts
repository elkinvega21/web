import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DEMO_USER, delay, isValidEmail } from '../../../../core/data/auth-config';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppCheckbox } from '../../../../shared/components/checkbox/checkbox.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppInput } from '../../../../shared/components/input/input.component';
import { AppPasswordInput } from '../../../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-adventure-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AppButton,
    AppCheckbox,
    AppField,
    IconComponent,
    AppInput,
    AppPasswordInput,
  ],
  styles: `
    .adventure-dots {
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }
  `,
  template: `
    <div class="relative min-h-svh overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-#0A1628 via-#1a3a2e to-#1B4332"></div>
      <div class="adventure-dots absolute inset-0"></div>

      <div class="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div class="flex items-center justify-end py-5">
          <a routerLink="/adventure" class="flex items-center gap-1 text-sm text-emerald-100/60 transition-colors hover:text-white">
            Volver al sitio
            <app-icon name="arrow-right" [size]="14" />
          </a>
        </div>

        <div class="flex flex-1 items-center justify-center py-8">
          <div class="w-full max-w-[420px]">
            <div class="mb-8 text-center">
              <span class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <app-icon name="compass" [size]="28" />
              </span>
              <h1 class="mt-5 text-xl font-semibold tracking-tight text-white">Bienvenido a Adventure Retail</h1>
              <p class="mt-1.5 text-sm text-emerald-100/60">Accede a tu plataforma de gestión comercial.</p>
            </div>

            <div class="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
              <div
                class="mb-5 rounded-xl border border-dashed border-white/10 bg-white/5 px-3.5 py-3 text-xs leading-relaxed text-emerald-100/60"
              >
                <span class="font-medium text-emerald-300">Cuenta de prueba:</span>
                {{ demoEmail }}
                <span class="text-emerald-100/30">/</span>
                <span class="font-mono text-emerald-200">{{ demoPassword }}</span>
              </div>

              <form (ngSubmit)="onSubmit()" novalidate class="flex flex-col gap-4">
                <app-field id="email" label="Correo electrónico" [error]="emailError()">
                  <input
                    appInput
                    id="email"
                    name="email"
                    type="email"
                    inputmode="email"
                    autocomplete="username"
                    placeholder="tu@correo.com"
                    [ngModel]="email"
                    [disabled]="loading()"
                    [attr.disabled]="loading() || null"
                    [attr.aria-invalid]="emailError() ? 'true' : null"
                    (ngModelChange)="onEmailChange($event)"
                    className="bg-white/10 border-white/10 text-white placeholder:text-emerald-100/30"
                  />
                </app-field>

                <app-field id="password" label="Contraseña" [error]="passwordError()">
                  <app-password-input
                    name="password"
                    autocomplete="current-password"
                    placeholder="Tu contraseña"
                    [ngModel]="password"
                    [disabled]="loading()"
                    (ngModelChange)="onPasswordChange($event)"
                    className="bg-white/10 border-white/10 text-white placeholder:text-emerald-100/30"
                  />
                </app-field>

                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <app-checkbox
                      [(checked)]="remember"
                      id="remember"
                      [class.pointer-events-none]="loading()"
                      [class.opacity-50]="loading()"
                    />
                    <label for="remember" class="text-xs font-normal text-emerald-100/60">Recordarme</label>
                  </div>
                  <a
                    routerLink="/recuperar-contrasena"
                    class="text-xs font-medium text-emerald-400 underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  appButton
                  type="submit"
                  size="lg"
                  variant="secondary"
                  className="mt-1 h-11 w-full bg-emerald-600 text-white border-0 text-sm shadow-lg shadow-emerald-900/30 hover:bg-emerald-500"
                  [disabled]="loading()"
                >
                  @if (loading()) {
                    <app-icon name="loader-circle" [size]="16" class="animate-spin" />
                    Verificando…
                  } @else {
                    <app-icon name="log-in" [size]="16" />
                    Iniciar sesión
                  }
                </button>
              </form>
            </div>

            <p class="mt-6 text-center text-xs text-emerald-100/50">
              ¿Necesitas ayuda?
              <a
                href="mailto:soporte@adventureretail.com"
                class="font-medium text-emerald-400 underline-offset-4 hover:underline"
              >
                Contactar soporte
              </a>
            </p>
          </div>
        </div>
      </div>

      <svg class="absolute bottom-0 w-full h-auto" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          fill="rgba(255,255,255,0.03)"
          d="M0,60L120,45L240,70L360,40L480,65L600,35L720,55L840,30L960,50L1080,40L1200,60L1320,35L1440,50L1440,120L0,120Z"
        />
      </svg>
    </div>
  `,
})
export class AdventureLoginComponent {
  private readonly router = inject(Router);

  readonly demoEmail = DEMO_USER.email;
  readonly demoPassword = DEMO_USER.password;

  readonly emailError = signal<string | null>(null);
  readonly passwordError = signal<string | null>(null);
  readonly status = signal<'idle' | 'loading'>('idle');

  readonly loading = computed(() => this.status() === 'loading');

  email = '';
  password = '';
  remember = false;

  onEmailChange(value: string): void {
    this.email = value;
    this.emailError.set(null);
  }

  onPasswordChange(value: string): void {
    this.password = value;
    this.passwordError.set(null);
  }

  validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!this.email.trim()) {
      errors.email = 'El correo es obligatorio.';
    } else if (!isValidEmail(this.email)) {
      errors.email = 'Ingresa un correo válido.';
    }
    if (!this.password) {
      errors.password = 'La contraseña es obligatoria.';
    }
    this.emailError.set(errors.email ?? null);
    this.passwordError.set(errors.password ?? null);
    return !errors.email && !errors.password;
  }

  onSubmit(): void {
    if (this.loading()) {
      return;
    }
    if (!this.validate()) {
      return;
    }
    this.status.set('loading');
    void delay(800).then(() => {
      this.status.set('idle');
      this.router.navigate(['/login']);
    });
  }
}
