import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const CYCLE_STEPS = [
  {
    icon: 'users',
    label: 'Cliente',
    desc: 'El cliente se registra o es contactado por un vendedor asignado según su territorio.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: 'user-round',
    label: 'Vendedor',
    desc: 'El vendedor atiende al cliente, conoce sus necesidades y ofrece los productos adecuados.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: 'shopping-cart',
    label: 'Pedido',
    desc: 'Se registra el pedido en la plataforma con los productos seleccionados y las condiciones comerciales.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: 'package',
    label: 'Productos',
    desc: 'El área de operaciones prepara los productos verificando disponibilidad en bodega.',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: 'truck',
    label: 'Entrega',
    desc: 'Se coordina la logística de entrega según la ubicación del cliente y la urgencia del pedido.',
    color: 'bg-white border border-[#E2E8F0] text-[#1B4332]',
  },
];

const PILLARS = [
  {
    icon: 'globe',
    title: 'Cobertura territorial',
    desc: 'Organizamos nuestra operación en territorios y regiones, cada uno con vendedores asignados que conocen las necesidades locales.',
  },
  {
    icon: 'users',
    title: 'Gestión de clientes',
    desc: 'Mantenemos un registro completo de cada cliente: historial de compras, preferencias, territorio asignado y seguimiento comercial.',
  },
  {
    icon: 'package',
    title: 'Control de productos',
    desc: 'Administramos nuestro catálogo de más de 1,000 productos con control de stock, precios y promociones activas.',
  },
  {
    icon: 'shopping-cart',
    title: 'Procesamiento de pedidos',
    desc: 'Desde la toma del pedido hasta la facturación y entrega, cada paso está registrado en nuestra plataforma.',
  },
  {
    icon: 'bar-chart-3',
    title: 'Reportes y análisis',
    desc: 'Generamos reportes de ventas, rendimiento de vendedores, tendencias de productos y análisis por territorio.',
  },
  {
    icon: 'settings',
    title: 'Administración',
    desc: 'Configuración de usuarios, roles, permisos y parámetros del sistema adaptados a nuestra operación.',
  },
];

@Component({
  selector: 'app-adventure-operacion',
  standalone: true,
  imports: [RouterLink, AppButton, IconComponent],
  template: `
    <div>
      <section class="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
        <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e to-#1B4332"></div>
        <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">Nuestra operación</h1>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-100/70 md:text-lg">
            Conoce cómo gestionamos cada aspecto del negocio para ofrecer un servicio eficiente y de calidad.
          </p>
        </div>
      </section>

      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-center text-2xl font-bold text-[#1B4332] md:text-3xl">Ciclo comercial</h2>
          <p class="mx-auto mt-3 max-w-xl text-center text-[#4A6B5A]">
            Desde la atención al cliente hasta la entrega, cada paso está cuidadosamente gestionado.
          </p>

          <div class="mt-12 flex flex-col items-center justify-center gap-0 md:flex-row md:gap-8 lg:gap-12">
            @for (step of cycleSteps; track step.label; let i = $index) {
              <div class="group flex w-full flex-col items-center gap-3 md:w-auto">
                <span
                  class="flex size-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg md:size-20"
                  [class]="step.color"
                >
                  <app-icon [name]="step.icon" [size]="28" />
                </span>
                <span class="text-sm font-bold text-[#1B4332]">{{ step.label }}</span>
                <p class="hidden max-w-[160px] text-center text-xs leading-relaxed text-[#6B8A7A] md:block">
                  {{ step.desc }}
                </p>
              </div>
              @if (i < cycleSteps.length - 1) {
                <div class="hidden flex-shrink-0 items-center md:flex">
                  <div class="relative h-0.5 w-8 bg-emerald-200 lg:w-12">
                    <div class="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              }
              @if (i < cycleSteps.length - 1) {
                <div class="flex flex-col items-center py-1 md:hidden">
                  <div class="relative h-6 w-0.5 bg-emerald-200">
                    <div class="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              }
            }
          </div>

          <div class="mt-8 space-y-4 md:hidden">
            @for (step of cycleSteps; track step.label) {
              <div class="rounded-xl border border-[#E2E8F0] bg-[#F5FAF7] p-4">
                <div class="flex items-center gap-3">
                  <span class="flex size-10 items-center justify-center rounded-xl" [class]="step.color">
                    <app-icon [name]="step.icon" [size]="20" />
                  </span>
                  <span class="text-sm font-bold text-[#1B4332]">{{ step.label }}</span>
                </div>
                <p class="mt-2 text-sm leading-relaxed text-[#6B8A7A]">{{ step.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="bg-[#F5FAF7] py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-center text-2xl font-bold text-[#1B4332] md:text-3xl">Áreas clave</h2>
          <p class="mx-auto mt-3 max-w-xl text-center text-[#4A6B5A]">
            Nuestra operación se sostiene en pilares fundamentales que trabajan de forma integrada.
          </p>
          <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (p of pillars; track p.title) {
              <div
                class="rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg"
              >
                <span class="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <app-icon [name]="p.icon" [size]="20" />
                </span>
                <h3 class="text-base font-bold text-[#1B4332]">{{ p.title }}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-[#6B8A7A]">{{ p.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="bg-white py-16 md:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl rounded-2xl border border-[#E2E8F0] bg-[#F5FAF7] p-6 text-center md:p-10">
            <app-icon name="shield" [size]="40" class="mx-auto text-emerald-600" />
            <h3 class="mt-3 text-lg font-bold text-[#1B4332]">Gestión centralizada</h3>
            <p class="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#6B8A7A]">
              Toda nuestra operación está respaldada por una plataforma digital que integra clientes, vendedores,
              productos, pedidos, territorios y promociones en un solo lugar. Esto nos permite operar con eficiencia,
              tomar decisiones informadas y ofrecer un mejor servicio a cada cliente.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-[#0F1F1A] py-16 text-center">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-white md:text-3xl">¿Eres parte de nuestro equipo?</h2>
          <p class="mx-auto mt-3 max-w-lg text-emerald-100/60">
            Accede a la plataforma de gestión para administrar la operación.
          </p>
          <a
            appButton
            routerLink="/adventure/login"
            variant="secondary"
            className="mt-6 h-12 px-8 bg-emerald-600 text-white border-0 hover:bg-emerald-500"
          >
            Portal de colaboradores
            <app-icon name="arrow-right" [size]="16" class="ml-2" />
          </a>
        </div>
      </section>
    </div>
  `,
})
export class AdventureOperacionComponent {
  readonly cycleSteps = CYCLE_STEPS;
  readonly pillars = PILLARS;
}
