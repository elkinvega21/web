import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AUTH_CONFIG, DEMO_USER, isValidEmail } from '../../../../core/data/auth-config';
import { AuthShellComponent } from '../../../../shared/layout/auth-shell/auth-shell.component';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppCheckbox } from '../../../../shared/components/checkbox/checkbox.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppFormAlert } from '../../../../shared/components/form-alert/form-alert.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppInput } from '../../../../shared/components/input/input.component';
import { AppPasswordInput } from '../../../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AuthShellComponent,
    AppButton,
    AppCheckbox,
    AppField,
    AppFormAlert,
    IconComponent,
    AppInput,
    AppPasswordInput,
  ],
  template: `
    <app-auth-shell>
      <div class="flex flex-col gap-7">
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5">
            <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Inicia sesión</h1>
            <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
              Accede a tu panel de Adventure Retail ERP con tus credenciales corporativas.
            </p>
          </div>
        </div>

        <div class="rounded-lg border border-dashed border-border bg-muted/50 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
          <span class="font-medium text-foreground">Cuenta de prueba:</span>
          {{ demoEmail }}
          <span class="text-muted-foreground/60">/</span>
          <span class="font-mono">{{ demoPassword }}</span>
        </div>

        @if (formError(); as alert) {
          <app-form-alert [tone]="alert.tone">
            @if (isLocked()) {
              Cuenta bloqueada temporalmente. Vuelve a intentar en {{ lockRemaining() }} s.
            } @else {
              {{ alert.message }}
            }
          </app-form-alert>
        }

        <form (ngSubmit)="onSubmit()" novalidate class="flex flex-col gap-4">
          <app-field id="email" label="Correo corporativo" [error]="emailError()">
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
              [attr.aria-invalid]="emailError() ? 'true' : null"
              (ngModelChange)="onEmailChange($event)"
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
              <label for="remember" class="font-normal text-muted-foreground">Recordarme</label>
            </div>
            <a
              routerLink="/recuperar-contrasena"
              class="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            appButton
            type="submit"
            size="lg"
            className="mt-1 h-11 w-full text-sm"
            [disabled]="loading() || isLocked()"
          >
            @if (loading()) {
              <app-icon name="loader-circle" [size]="16" class="animate-spin" />
              Verificando…
            } @else if (isLocked()) {
              Bloqueado — {{ lockRemaining() }} s
            } @else {
              <app-icon name="log-in" [size]="16" />
              Iniciar sesión
            }
          </button>
        </form>

        <p class="text-center text-xs text-muted-foreground">
          Acceso protegido con cifrado. ¿Problemas para entrar?
          <a
            href="mailto:soporte@creadorsoftware.com"
            class="font-medium text-primary underline-offset-4 hover:underline"
          >
            Contacta a soporte
          </a>
        </p>
      </div>
    </app-auth-shell>
  `,
})
export class LoginComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly rememberedEmailKey = 'adventure_remembered_email';
  private timer?: number;

  readonly demoEmail = DEMO_USER.email;
  readonly demoPassword = DEMO_USER.password;

  email = localStorage.getItem(this.rememberedEmailKey) ?? '';
  password = '';
  remember = !!localStorage.getItem(this.rememberedEmailKey);

  readonly emailError = signal<string | null>(null);
  readonly passwordError = signal<string | null>(null);
  readonly formError = signal<{ tone: 'error' | 'locked'; message: string } | null>(null);
  readonly status = signal<'idle' | 'loading'>('idle');
  readonly lockUntil = signal<number | null>(null);
  readonly now = signal(Date.now());

  private failedAttempts = 0;

  readonly loading = computed(() => this.status() === 'loading');
  readonly lockRemaining = computed(() => {
    const until = this.lockUntil();
    return until && until > this.now() ? Math.ceil((until - this.now()) / 1000) : 0;
  });
  readonly isLocked = computed(() => this.lockRemaining() > 0);

  constructor() {
    this.timer = window.setInterval(() => this.now.set(Date.now()), 500);
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      window.clearInterval(this.timer);
    }
  }

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
    this.formError.set(null);
    if (this.isLocked() || this.loading()) {
      return;
    }
    if (!this.validate()) {
      return;
    }
    this.status.set('loading');
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.handleLoginSuccess(),
      error: () => this.handleDemoLogin(),
    });
  }

  private handleLoginSuccess(): void {
    this.status.set('idle');
    this.failedAttempts = 0;
    this.lockUntil.set(null);
    this.persistRememberedEmail();
    this.router.navigate(['/dashboard']);
  }

  private handleDemoLogin(): void {
    const valid =
      this.email.trim().toLowerCase() === DEMO_USER.email &&
      this.password === DEMO_USER.password;

    if (!valid) {
      this.failedAttempts += 1;
      if (this.failedAttempts >= AUTH_CONFIG.maxAttempts) {
        this.lockUntil.set(Date.now() + AUTH_CONFIG.lockSeconds * 1000);
        this.failedAttempts = 0;
        this.status.set('idle');
        this.formError.set({
          tone: 'locked',
          message: `Demasiados intentos fallidos. Cuenta bloqueada por ${AUTH_CONFIG.lockSeconds} segundos por seguridad.`,
        });
        return;
      }
      const left = AUTH_CONFIG.maxAttempts - this.failedAttempts;
      this.status.set('idle');
      this.formError.set({
        tone: 'error',
        message: `Correo o contraseña incorrectos. Te ${
          left === 1 ? 'queda' : 'quedan'
        } ${left} ${left === 1 ? 'intento' : 'intentos'} antes del bloqueo.`,
      });
      return;
    }

    this.failedAttempts = 0;
    this.lockUntil.set(null);
    this.status.set('idle');
    localStorage.setItem('adventure_token', 'demo');
    this.persistRememberedEmail();
    this.router.navigate(['/dashboard']);
  }

  private persistRememberedEmail(): void {
    if (this.remember) {
      localStorage.setItem(this.rememberedEmailKey, this.email.trim());
    } else {
      localStorage.removeItem(this.rememberedEmailKey);
    }
  }
}
