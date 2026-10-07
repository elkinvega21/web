import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const SERVICES = [
  {
    icon: 'users',
    title: 'Asesoría especializada',
    desc: 'Nuestro equipo de vendedores capacitados te ayuda a encontrar el producto ideal según tu actividad, nivel de experiencia y presupuesto.',
    features: ['Atención personalizada', 'Recomendaciones técnicas', 'Seguimiento postventa'],
  },
  {
    icon: 'shopping-cart',
    title: 'Ventas corporativas',
    desc: 'Programas especiales para empresas, clubes deportivos e instituciones que necesitan equipar a sus equipos con productos de calidad.',
    features: ['Descuentos por volumen', 'Facturación corporativa', 'Entregas programadas'],
  },
  {
    icon: 'bar-chart-3',
    title: 'Gestión de inventario B2B',
    desc: 'Plataforma para que nuestros clientes empresariales consulten disponibilidad, realicen pedidos y den seguimiento a sus órdenes.',
    features: ['Catálogo digital', 'Pedidos en línea', 'Historial de compras'],
  },
  {
    icon: 'headphone',
    title: 'Soporte y postventa',
    desc: 'Acompañamos a nuestros clientes después de cada compra con soporte técnico, cambios y garantía.',
    features: ['Garantía extendida', 'Soporte técnico', 'Cambios y devoluciones'],
  },
  {
    icon: 'package-open',
    title: 'Logística y distribución',
    desc: 'Red de distribución que cubre múltiples regiones con entregas oportunas y seguimiento en tiempo real.',
    features: ['Cobertura nacional', 'Seguimiento de envíos', 'Entregas express'],
  },
  {
    icon: 'shield-check',
    title: 'Programa de fidelización',
    desc: 'Recompensamos la confianza de nuestros clientes con beneficios exclusivos, promociones y acceso anticipado a nuevos productos.',
    features: ['Puntos por compras', 'Descuentos exclusivos', 'Acceso anticipado'],
  },
];

@Component({
  selector: 'app-adventure-servicios',
  standalone: true,
  imports: [RouterLink, AppButton, IconComponent],
  template: `
    <div>
      <section class="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
        <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e to-#1B4332"></div>
        <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">Nuestros servicios</h1>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-100/70 md:text-lg">
            Más que productos, ofrecemos soluciones integrales para que cada experiencia sea inolvidable.
          </p>
        </div>
      </section>

      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (s of services; track s.title) {
              <div
                class="group rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg md:p-8"
              >
                <span
                  class="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100"
                >
                  <app-icon [name]="s.icon" [size]="24" />
                </span>
                <h3 class="mt-4 text-lg font-bold text-[#1B4332]">{{ s.title }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-[#6B8A7A]">{{ s.desc }}</p>
                <ul class="mt-3 space-y-1.5">
                  @for (f of s.features; track f) {
                    <li class="flex items-center gap-2 text-xs text-[#4A6B5A]">
                      <span class="size-1.5 rounded-full bg-emerald-500"></span>
                      {{ f }}
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="bg-[#F5FAF7] py-16 text-center md:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-[#1B4332] md:text-3xl">¿Necesitas un servicio personalizado?</h2>
          <p class="mx-auto mt-3 max-w-lg text-[#4A6B5A]">
            Contáctanos y diseñaremos una solución a la medida de tu empresa.
          </p>
          <a
            appButton
            routerLink="/adventure/contacto"
            variant="secondary"
            className="mt-6 h-12 px-8 bg-emerald-600 text-white border-0 hover:bg-emerald-500"
          >
            Contáctanos
            <app-icon name="arrow-right" [size]="16" class="ml-2" />
          </a>
        </div>
      </section>
    </div>
  `,
})
export class AdventureServiciosComponent {
  readonly services = SERVICES;
}
