import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { delay } from '../../../../core/data/auth-config';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppInput } from '../../../../shared/components/input/input.component';
import { AppLabel } from '../../../../shared/components/label/label.component';

const CHANNELS = [
  {
    icon: 'mail',
    label: 'Correo electrónico',
    value: 'contacto@adventureretail.com',
    href: 'mailto:contacto@adventureretail.com',
  },
  { icon: 'phone', label: 'Teléfono', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: 'map-pin', label: 'Dirección', value: 'Av. Aventura 1234, Santiago, Chile', href: null },
  { icon: 'clock', label: 'Horario de atención', value: 'Lunes a viernes, 9:00 — 18:00', href: null },
];

@Component({
  selector: 'app-adventure-contacto',
  standalone: true,
  imports: [FormsModule, RouterLink, AppButton, IconComponent, AppInput, AppLabel],
  template: `
    @if (status() === 'success') {
      <div>
        <section class="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
          <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e to-#1B4332"></div>
          <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">Contacto</h1>
          </div>
        </section>
        <section class="bg-white py-16 md:py-24">
          <div class="mx-auto max-w-lg px-4 text-center">
            <span class="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <app-icon name="circle-check-big" [size]="32" />
            </span>
            <h2 class="mt-6 text-2xl font-bold text-[#1B4332]">Mensaje enviado</h2>
            <p class="mt-2 text-[#4A6B5A]">Gracias por contactarnos. Te responderemos a la brevedad.</p>
            <a
              appButton
              routerLink="/adventure"
              variant="secondary"
              className="mt-6 h-11 bg-emerald-600 px-6 text-white border-0 hover:bg-emerald-500"
            >
              Volver al inicio
            </a>
          </div>
        </section>
      </div>
    } @else {
      <div>
        <section class="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
          <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e to-#1B4332"></div>
          <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">Contacto</h1>
            <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-100/70 md:text-lg">
              Estamos aquí para ayudarte. Cuéntanos cómo podemos apoyarte.
            </p>
          </div>
        </section>

        <section class="bg-white py-16 md:py-24">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 class="text-2xl font-bold text-[#1B4332]">Envíanos un mensaje</h2>
                <form (ngSubmit)="onSubmit()" novalidate class="mt-6 space-y-5">
                  <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                      <app-label htmlFor="name" className="text-[#1B4332]">Nombre completo</app-label>
                      <input
                        appInput
                        id="name"
                        required
                        placeholder="Tu nombre"
                        [ngModel]="name"
                        [disabled]="loading()"
                        [attr.disabled]="loading() || null"
                        (ngModelChange)="onNameChange($event)"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <app-label htmlFor="email" className="text-[#1B4332]">Correo electrónico</app-label>
                      <input
                        appInput
                        id="email"
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        [ngModel]="email"
                        [disabled]="loading()"
                        [attr.disabled]="loading() || null"
                        (ngModelChange)="onEmailChange($event)"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div class="grid gap-5 sm:grid-cols-2">
                    <div>
                      <app-label htmlFor="phone" className="text-[#1B4332]">Teléfono (opcional)</app-label>
                      <input
                        appInput
                        id="phone"
                        placeholder="+1 555 123 4567"
                        [ngModel]="phone"
                        [disabled]="loading()"
                        [attr.disabled]="loading() || null"
                        (ngModelChange)="onPhoneChange($event)"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <app-label htmlFor="subject" className="text-[#1B4332]">Asunto (opcional)</app-label>
                      <input
                        appInput
                        id="subject"
                        placeholder="¿Sobre qué nos contactas?"
                        [ngModel]="subject"
                        [disabled]="loading()"
                        [attr.disabled]="loading() || null"
                        (ngModelChange)="onSubjectChange($event)"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <app-label htmlFor="message" className="text-[#1B4332]">Mensaje</app-label>
                    <textarea
                      appInput
                      id="message"
                      rows="5"
                      required
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                      [ngModel]="message"
                      [disabled]="loading()"
                      [attr.disabled]="loading() || null"
                      (ngModelChange)="onMessageChange($event)"
                      className="mt-1.5 h-auto resize-y"
                    ></textarea>
                  </div>
                  <button
                    appButton
                    type="submit"
                    size="lg"
                    variant="secondary"
                    className="h-12 w-full bg-emerald-600 px-8 text-white border-0 hover:bg-emerald-500 sm:w-auto"
                    [disabled]="loading()"
                  >
                    @if (loading()) {
                      <app-icon name="loader-circle" [size]="16" class="mr-2 animate-spin" />
                      Enviando…
                    } @else {
                      <app-icon name="send" [size]="16" class="mr-2" />
                      Enviar mensaje
                    }
                  </button>
                </form>
              </div>

              <div>
                <h2 class="text-2xl font-bold text-[#1B4332]">Información de contacto</h2>
                <p class="mt-2 text-[#4A6B5A]">Estamos disponibles para atenderte a través de los siguientes canales.</p>

                <div class="mt-8 space-y-6">
                  @for (item of channels; track item.label) {
                    <div class="flex gap-4">
                      <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <app-icon [name]="item.icon" [size]="20" />
                      </span>
                      <div>
                        <p class="text-sm font-semibold text-[#1B4332]">{{ item.label }}</p>
                        @if (item.href) {
                          <a
                            [href]="item.href"
                            class="text-sm text-[#4A6B5A] transition-colors hover:text-emerald-600"
                          >
                            {{ item.value }}
                          </a>
                        } @else {
                          <p class="text-sm text-[#4A6B5A]">{{ item.value }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>

                <div class="mt-8 rounded-xl border border-[#E2E8F0] bg-[#F5FAF7] p-5">
                  <div class="flex items-center gap-3">
                    <app-icon name="headphone" [size]="20" class="text-emerald-600" />
                    <span class="text-sm font-semibold text-[#1B4332]">Soporte colaboradores</span>
                  </div>
                  <p class="mt-2 text-sm text-[#6B8A7A]">
                    Si eres colaborador de Adventure Retail, accede a la plataforma o escribe a
                    <a href="mailto:soporte&#64;adventureretail.com" class="text-emerald-600 hover:underline">
                      soporte&#64;adventureretail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    }
  `,
})
export class AdventureContactoComponent {
  readonly channels = CHANNELS;

  readonly status = signal<'idle' | 'loading' | 'success'>('idle');

  readonly loading = computed(() => this.status() === 'loading');

  name = '';
  email = '';
  phone = '';
  subject = '';
  message = '';

  onNameChange(value: string): void {
    this.name = value;
  }

  onEmailChange(value: string): void {
    this.email = value;
  }

  onPhoneChange(value: string): void {
    this.phone = value;
  }

  onSubjectChange(value: string): void {
    this.subject = value;
  }

  onMessageChange(value: string): void {
    this.message = value;
  }

  onSubmit(): void {
    if (this.loading()) {
      return;
    }
    if (!this.name.trim() || !this.email.trim() || !this.message.trim()) {
      return;
    }
    this.status.set('loading');
    void delay(1500).then(() => this.status.set('success'));
  }
}
