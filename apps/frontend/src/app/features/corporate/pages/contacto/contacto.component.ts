import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppField } from '../../../../shared/components/field/field.component';
import { AppFormAlert } from '../../../../shared/components/form-alert/form-alert.component';
import { AppInput, AppTextarea } from '../../../../shared/components/input/input.component';

interface ContactInfoItem {
  icon: string;
  label: string;
  value: string;
  href: string | null;
}

@Component({
  selector: 'app-corporate-contacto',
  standalone: true,
  imports: [FormsModule, IconComponent, AppField, AppFormAlert, AppInput, AppTextarea],
  template: `
    <div>
      <section class="pt-32 pb-20 border-b border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Contacto</span>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Hablemos de tu proyecto</h1>
            <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
              Cuéntanos qué necesitas y te responderemos en menos de 24 horas hábiles.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-10 lg:grid-cols-2">
            <div>
              @if (enviado()) {
                <div class="flex flex-col items-center justify-center h-full text-center py-12 w-full max-w-md mx-auto">
                  <app-form-alert tone="success" title="Mensaje enviado">
                    Gracias por contactarnos. Revisaremos tu mensaje y te responderemos a la brevedad.
                  </app-form-alert>
                </div>
              } @else {
                <form (ngSubmit)="onSubmit()" class="space-y-4" novalidate>
                  <app-field id="nombre" label="Nombre completo" [error]="nombreError">
                    <input appInput id="nombre" name="nombre" type="text" [(ngModel)]="nombre" placeholder="Tu nombre" />
                  </app-field>
                  <div class="grid gap-4 sm:grid-cols-2">
                    <app-field id="email" label="Correo electrónico" [error]="emailError">
                      <input appInput id="email" name="email" type="email" [(ngModel)]="email" placeholder="tu@correo.com" />
                    </app-field>
                    <app-field id="empresa" label="Empresa">
                      <input appInput id="empresa" name="empresa" type="text" [(ngModel)]="empresa" placeholder="Nombre de tu empresa" />
                    </app-field>
                  </div>
                  <app-field id="mensaje" label="Mensaje" [error]="mensajeError">
                    <textarea appInput id="mensaje" name="mensaje" rows="4" [(ngModel)]="mensaje" placeholder="Cuéntanos sobre tu proyecto..."></textarea>
                  </app-field>
                  <button type="submit" [disabled]="enviando()" class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
                    @if (enviando()) {
                      <app-icon name="loader-circle" [size]="16" class="animate-spin" /> Enviando…
                    } @else {
                      <app-icon name="send" [size]="16" /> Enviar mensaje
                    }
                  </button>
                </form>
              }
            </div>

            <div class="space-y-6">
              <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
                <h3 class="text-sm font-semibold text-card-foreground mb-4">Información de contacto</h3>
                <div class="space-y-4">
                  @for (item of contactItems; track item.label) {
                    <div class="flex items-center gap-3">
                      <span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <app-icon [name]="item.icon" [size]="18" />
                      </span>
                      <div>
                        <p class="text-xs text-muted-foreground">{{ item.label }}</p>
                        @if (item.href) {
                          <a [attr.href]="item.href" class="text-sm font-medium text-card-foreground hover:text-primary transition-colors">{{ item.value }}</a>
                        } @else {
                          <p class="text-sm font-medium text-card-foreground">{{ item.value }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
                <h3 class="text-sm font-semibold text-card-foreground mb-2">Horarios de atención</h3>
                <p class="text-sm text-muted-foreground">Lunes a viernes de 8:00 a 18:00</p>
                <p class="text-sm text-muted-foreground">Sábados de 9:00 a 13:00</p>
              </div>

              <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
                <h3 class="text-sm font-semibold text-card-foreground mb-2">Soporte técnico</h3>
                <p class="text-sm text-muted-foreground mb-3">¿Ya eres cliente? Escríbenos para soporte técnico.</p>
                <a href="mailto:soporte&#64;creadorsoftware.com" class="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  soporte&#64;creadorsoftware.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CorporateContactoComponent {
  private readonly _nombre = signal('');
  private readonly _email = signal('');
  private readonly _empresa = signal('');
  private readonly _mensaje = signal('');

  readonly enviado = signal(false);
  readonly enviando = signal(false);
  readonly submitted = signal(false);

  readonly contactItems: ContactInfoItem[] = [
    { icon: 'mail', label: 'Email', value: 'contacto@creadorsoftware.com', href: 'mailto:contacto@creadorsoftware.com' },
    { icon: 'phone', label: 'Teléfono', value: '+57 300 123 4567', href: 'tel:+573001234567' },
    { icon: 'map-pin', label: 'Ubicación', value: 'Bogotá, Colombia', href: null },
  ];

  get nombre(): string {
    return this._nombre();
  }

  set nombre(value: string) {
    this._nombre.set(value);
  }

  get email(): string {
    return this._email();
  }

  set email(value: string) {
    this._email.set(value);
  }

  get empresa(): string {
    return this._empresa();
  }

  set empresa(value: string) {
    this._empresa.set(value);
  }

  get mensaje(): string {
    return this._mensaje();
  }

  set mensaje(value: string) {
    this._mensaje.set(value);
  }

  get nombreError(): string | null {
    if (!this.submitted()) return null;
    return this._nombre().trim() ? null : 'El nombre es obligatorio.';
  }

  get emailError(): string | null {
    if (!this.submitted()) return null;
    const value = this._email().trim();
    if (!value) return 'El correo es obligatorio.';
    if (!this.isValidEmail(value)) return 'Ingresa un correo válido.';
    return null;
  }

  get mensajeError(): string | null {
    if (!this.submitted()) return null;
    return this._mensaje().trim() ? null : 'El mensaje es obligatorio.';
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.nombreError || this.emailError || this.mensajeError) return;
    this.enviando.set(true);
    setTimeout(() => {
      this.enviando.set(false);
      this.enviado.set(true);
    }, 1500);
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
