import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AUTH_CONFIG, DEMO_OTP, delay } from '../../../../core/data/auth-config';
import { AuthShellComponent } from '../../../../shared/layout/auth-shell/auth-shell.component';
import { AppButton } from '../../../../shared/components/button/button.component';
import { AppFormAlert } from '../../../../shared/components/form-alert/form-alert.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppOtpInput } from '../../../../shared/components/otp-input/otp-input.component';

@Component({
  selector: 'app-verificar-correo',
  standalone: true,
  imports: [
    RouterLink,
    AuthShellComponent,
    AppButton,
    AppFormAlert,
    IconComponent,
    AppOtpInput,
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
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Correo verificado</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Tu identidad se confirmó correctamente. Redirigiéndote…
              </p>
            </div>
          </div>

          <app-form-alert tone="success">Verificación completada. Un momento, por favor.</app-form-alert>
        } @else {
          <div class="flex flex-col gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <app-icon [name]="flow === 'reset' ? 'shield-check' : 'mail-check'" [size]="22" />
            </span>
            <div class="flex flex-col gap-1.5">
              <h1 class="text-2xl font-semibold tracking-tight text-foreground text-balance">Verifica tu correo</h1>
              <p class="text-sm leading-relaxed text-muted-foreground text-pretty">
                Escribe el código de 6 dígitos que enviamos a
                <span class="font-medium text-foreground">{{ email }}</span>.
              </p>
            </div>
          </div>

          <div class="rounded-lg border border-dashed border-border bg-muted/50 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
            <span class="font-medium text-foreground">Código de prueba:</span>
            <span class="font-mono tracking-widest">{{ demoOtp }}</span>
          </div>

          @if (error(); as errorText) {
            <app-form-alert tone="error">{{ errorText }}</app-form-alert>
          }

          <div class="flex flex-col gap-5">
            <app-otp-input
              [length]="otpLength"
              [value]="code()"
              [disabled]="loading()"
              [invalid]="error() !== null"
              [autoFocus]="true"
              (valueChange)="onCodeChange($event)"
              (complete)="verify($event)"
            />

            <button appButton size="lg" className="h-11 w-full text-sm" [disabled]="loading()" (click)="verify(code())">
              @if (loading()) {
                <app-icon name="loader-circle" [size]="16" class="animate-spin" />
                Verificando…
              } @else {
                Verificar código
              }
            </button>

            <p class="text-center text-sm text-muted-foreground">
              @if (resendIn() > 0) {
                Puedes reenviar el código en {{ resendIn() }} s
              } @else {
                <button
                  type="button"
                  (click)="resend()"
                  class="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Reenviar código
                </button>
              }
            </p>
          </div>

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
export class VerificarCorreoComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private timer?: number;

  readonly flow = this.route.snapshot.queryParamMap.get('flow') === 'reset' ? 'reset' : 'signup';
  readonly email = this.route.snapshot.queryParamMap.get('email') ?? 'tu correo';
  readonly otpLength = AUTH_CONFIG.otpLength;
  readonly demoOtp = DEMO_OTP;

  readonly code = signal('');
  readonly error = signal<string | null>(null);
  readonly status = signal<'idle' | 'loading' | 'done'>('idle');
  readonly now = signal(Date.now());
  readonly resendUntil = signal(Date.now() + AUTH_CONFIG.otpResendSeconds * 1000);

  readonly loading = computed(() => this.status() === 'loading');
  readonly resendIn = computed(() => {
    const until = this.resendUntil();
    return until > this.now() ? Math.ceil((until - this.now()) / 1000) : 0;
  });

  constructor() {
    this.timer = window.setInterval(() => this.now.set(Date.now()), 500);
  }

  ngOnDestroy(): void {
    if (this.timer !== undefined) {
      window.clearInterval(this.timer);
    }
  }

  onCodeChange(value: string): void {
    this.code.set(value);
    this.error.set(null);
  }

  async verify(value: string): Promise<void> {
    if (this.loading()) {
      return;
    }
    if (value.length < this.otpLength) {
      this.error.set('Ingresa los 6 dígitos del código.');
      return;
    }
    this.error.set(null);
    this.status.set('loading');
    await delay(1000);

    if (value !== DEMO_OTP) {
      this.status.set('idle');
      this.error.set('El código es incorrecto o expiró. Revisa e inténtalo de nuevo.');
      this.code.set('');
      return;
    }

    this.status.set('done');
    await delay(900);
    this.router.navigate(['/login']);
  }

  resend(): void {
    if (this.resendIn() > 0) {
      return;
    }
    this.resendUntil.set(Date.now() + AUTH_CONFIG.otpResendSeconds * 1000);
    this.code.set('');
    this.error.set(null);
  }
}
