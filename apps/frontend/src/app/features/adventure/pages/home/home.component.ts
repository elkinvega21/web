import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const VALUES = [
  { icon: 'star', label: 'Calidad' },
  { icon: 'lightbulb', label: 'Innovación' },
  { icon: 'heart', label: 'Servicio' },
  { icon: 'shield', label: 'Confianza' },
  { icon: 'compass', label: 'Aventura' },
  { icon: 'tree-pine', label: 'Sostenibilidad' },
];

const CATEGORIES = [
  {
    name: 'Outdoor',
    desc: 'Ropa y equipo para actividades al aire libre con la más alta resistencia.',
    icon: 'mountain',
  },
  {
    name: 'Camping',
    desc: 'Carpa, sleeping, cocina y todo lo necesario para acampar con comodidad.',
    icon: 'tent',
  },
  {
    name: 'Senderismo',
    desc: 'Calzado, bastones y mochilas diseñados para rutas y montañas.',
    icon: 'tree-pine',
  },
  {
    name: 'Ciclismo',
    desc: 'Bicicletas, cascos, accesorios y vestimenta para rutas y montaña.',
    icon: 'bike',
  },
  {
    name: 'Accesorios',
    desc: 'GPS, linternas, navajas, hidratación y complementos para toda aventura.',
    icon: 'backpack',
  },
  {
    name: 'Equipamiento deportivo',
    desc: 'Implementos profesionales para disciplinas outdoor y deportes de aventura.',
    icon: 'wind',
  },
];

const OP_STEPS = [
  { icon: 'users', label: 'Clientes', color: 'bg-emerald-50 text-emerald-600' },
  { icon: 'user-round', label: 'Vendedores', color: 'bg-amber-100 text-amber-600' },
  { icon: 'shopping-cart', label: 'Pedidos', color: 'bg-emerald-100 text-emerald-700' },
  { icon: 'package', label: 'Productos', color: 'bg-amber-50 text-amber-700' },
  { icon: 'truck', label: 'Entrega', color: 'bg-white border border-[#E2E8F0] text-[#1B4332]' },
];

const REGIONS = ['Norte', 'Centro', 'Sur'];

const STATS = [
  { label: 'Territorios atendidos', value: '+15', icon: 'map' },
  { label: 'Vendedores', value: '+50', icon: 'user-round' },
  { label: 'Clientes activos', value: '+200', icon: 'users' },
  { label: 'Productos', value: '+1,000', icon: 'package' },
];

const COMMITMENTS = [
  {
    icon: 'heart',
    title: 'Atención personalizada',
    desc: 'Cada cliente recibe asesoría dedicada para encontrar el equipo ideal.',
  },
  {
    icon: 'shield',
    title: 'Productos de calidad',
    desc: 'Trabajamos con las mejores marcas y estándares del mercado outdoor.',
  },
  {
    icon: 'truck',
    title: 'Entrega eficiente',
    desc: 'Logística optimizada para que tu pedido llegue donde lo necesites.',
  },
  {
    icon: 'users',
    title: 'Soporte continuo',
    desc: 'Estamos contigo antes, durante y después de cada compra.',
  },
  {
    icon: 'circle-check',
    title: 'Confianza',
    desc: 'Más de 200 clientes confían en nosotros para sus aventuras.',
  },
];

const TECH_ITEMS = [
  'Gestionar clientes',
  'Administrar pedidos',
  'Gestionar vendedores',
  'Analizar ventas',
  'Administrar productos',
  'Controlar promociones',
  'Generar reportes',
];

@Component({
  selector: 'app-adventure-home',
  standalone: true,
  imports: [RouterLink, AppButton, IconComponent],
  styles: `
    .adventure-dots-light {
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .adventure-dots {
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .adventure-dots-strong {
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 60px 60px;
    }
  `,
  template: `
    <div>
      <section class="relative flex min-h-svh items-center overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e via-#2d5a3e to-#1B4332"></div>
        <div class="adventure-dots absolute inset-0 opacity-50"></div>
        <svg class="absolute bottom-0 w-full h-auto" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path
            fill="rgba(255,255,255,0.04)"
            d="M0,200L80,180L160,220L240,160L320,210L400,170L480,230L560,190L640,240L720,180L800,220L880,150L960,190L1040,170L1120,210L1200,180L1280,220L1360,160L1440,200L1440,400L0,400Z"
          />
          <path
            fill="rgba(255,255,255,0.03)"
            d="M0,280L120,250L240,290L360,240L480,270L600,230L720,260L840,220L960,250L1080,240L1200,280L1320,250L1440,270L1440,400L0,400Z"
          />
          <path
            fill="#1B4332"
            d="M0,320L100,290L200,330L300,280L400,310L500,270L600,300L700,260L800,290L900,250L1000,280L1100,260L1200,290L1300,270L1400,300L1440,290L1440,400L0,400Z"
          />
          <path
            fill="#143A28"
            d="M0,350L160,320L320,350L480,310L640,340L800,300L960,330L1120,310L1280,340L1440,320L1440,400L0,400Z"
          />
        </svg>

        <div class="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
          <div class="max-w-3xl">
            <div
              class="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300"
            >
              <app-icon name="compass" [size]="14" />
              Bienvenido a Adventure Retail
            </div>

            <h1
              class="text-4xl font-extrabold tracking-tight text-white leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Explora más.
              <br />
              <span
                class="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent"
              >
                Vive la aventura.
              </span>
            </h1>

            <p class="mt-6 max-w-xl text-base leading-relaxed text-emerald-100/70 sm:text-lg md:text-xl">
              Productos y soluciones para quienes convierten cada camino en una nueva experiencia.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <a
                appButton
                routerLink="/adventure/productos"
                variant="secondary"
                className="h-12 px-7 bg-emerald-600 text-white border-0 text-sm shadow-xl shadow-emerald-900/30 hover:bg-emerald-500"
              >
                Conoce nuestros productos
                <app-icon name="arrow-right" [size]="16" class="ml-2" />
              </a>
              <a
                appButton
                routerLink="/adventure/login"
                variant="ghost"
                className="h-12 px-7 border-white/20 text-white text-sm hover:bg-white/10 hover:text-white"
              >
                <app-icon name="log-in" [size]="16" class="mr-2" />
                Iniciar sesión
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="relative bg-white py-20 md:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-[#1B4332] md:text-4xl">Somos Adventure Retail</h2>
            <p class="mt-4 text-base leading-relaxed text-[#4A6B5A] md:text-lg">
              Somos una empresa dedicada a ofrecer productos y soluciones para personas que buscan explorar, disfrutar y
              superar nuevos desafíos.
            </p>
          </div>

          <div class="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            @for (v of values; track v.label) {
              <div
                class="group flex flex-col items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
              >
                <span
                  class="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100"
                >
                  <app-icon [name]="v.icon" [size]="20" />
                </span>
                <span class="text-sm font-semibold text-[#1B4332]">{{ v.label }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <section id="productos" class="relative bg-[#F5FAF7] py-20 md:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-[#1B4332] md:text-4xl">Nuestros productos</h2>
            <p class="mt-4 text-base leading-relaxed text-[#4A6B5A] md:text-lg">
              Equípate para cada experiencia con nuestra amplia gama de productos diseñados para la aventura.
            </p>
          </div>

          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (cat of categories; track cat.name) {
              <div
                class="group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/10"
              >
                <div class="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-100 to-amber-50">
                  <app-icon
                    [name]="cat.icon"
                    [size]="64"
                    class="text-emerald-600/50 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-600"
                  />
                </div>
                <div class="p-5">
                  <h3 class="text-lg font-bold text-[#1B4332]">{{ cat.name }}</h3>
                  <p class="mt-1.5 text-sm leading-relaxed text-[#6B8A7A]">{{ cat.desc }}</p>
                  <a
                    appButton
                    variant="link"
                    routerLink="/adventure/productos"
                    className="mt-3 h-auto p-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Explorar
                    <app-icon name="arrow-right" [size]="14" class="ml-1" />
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section id="operacion" class="relative bg-white py-20 md:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-[#1B4332] md:text-4xl">Nuestra operación</h2>
            <p class="mt-4 text-base leading-relaxed text-[#4A6B5A] md:text-lg">
              Desde la relación con el cliente hasta la entrega, cada paso está cuidadosamente gestionado.
            </p>
          </div>

          <div class="mt-12 flex flex-col items-center justify-center gap-0 md:flex-row md:gap-4">
            @for (step of opSteps; track step.label; let i = $index) {
              <div class="group flex flex-col items-center gap-3">
                <span
                  class="flex size-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  [class]="step.color"
                >
                  <app-icon [name]="step.icon" [size]="28" />
                </span>
                <span class="text-sm font-semibold text-[#1B4332]">{{ step.label }}</span>
              </div>
              @if (i < opSteps.length - 1) {
                <div class="hidden items-center md:flex">
                  <div class="relative h-0.5 w-8 bg-emerald-200">
                    <div class="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              }
              @if (i < opSteps.length - 1) {
                <div class="flex flex-col items-center py-2 md:hidden">
                  <div class="relative h-6 w-0.5 bg-emerald-200">
                    <div class="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              }
            }
          </div>

          <div class="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#E2E8F0] bg-[#F5FAF7] p-6 md:p-8">
            <p class="text-center text-sm leading-relaxed text-[#4A6B5A] md:text-base">
              Adventure Retail gestiona cada etapa del ciclo comercial: captamos clientes, asignamos vendedores por
              territorio, procesamos pedidos, administramos inventario y coordinamos la entrega. Todo centralizado en
              una plataforma digital que nos permite ofrecer un servicio rápido, confiable y personalizado.
            </p>
          </div>
        </div>
      </section>

      <section class="relative bg-[#F5FAF7] py-20 md:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-[#1B4332] md:text-4xl">Presencia comercial</h2>
            <p class="mt-4 text-base leading-relaxed text-[#4A6B5A] md:text-lg">
              Nuestra operación abarca múltiples regiones con un equipo de vendedores especializados.
            </p>
          </div>

          <div class="mt-12 grid gap-6 lg:grid-cols-5">
            <div class="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8 lg:col-span-3">
              <div class="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 via-emerald-100 to-amber-50">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <app-icon name="globe" [size]="64" class="mx-auto text-emerald-600/30" />
                    <div class="mx-auto mt-4 grid max-w-xs grid-cols-3 gap-3">
                      @for (r of regions; track r) {
                        <div
                          class="rounded-lg border border-emerald-200/50 bg-white/80 px-2 py-2 text-xs font-semibold text-[#1B4332]"
                        >
                          {{ r }}
                        </div>
                      }
                    </div>
                    <div class="mt-4 flex justify-center gap-2">
                      <app-icon name="map-pin" [size]="16" class="text-emerald-600" />
                      <span class="text-xs text-[#4A6B5A]">+8 regiones activas</span>
                    </div>
                  </div>
                </div>
                <svg class="absolute bottom-0 w-full h-auto" viewBox="0 0 400 60" preserveAspectRatio="none">
                  <path fill="#1B4332" d="M0,40L80,30L160,45L240,25L320,35L400,20L400,60L0,60Z" opacity="0.1" />
                </svg>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 lg:col-span-2">
              @for (stat of stats; track stat.label) {
                <div
                  class="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
                >
                  <span class="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <app-icon [name]="stat.icon" [size]="20" />
                  </span>
                  <span class="text-2xl font-bold text-[#1B4332]">{{ stat.value }}</span>
                  <span class="mt-1 text-xs text-[#6B8A7A]">{{ stat.label }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="relative bg-white py-20 md:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-[#1B4332] md:text-4xl">Nuestro compromiso</h2>
            <p class="mt-4 text-base leading-relaxed text-[#4A6B5A] md:text-lg">
              Cada experiencia comienza con una promesa. Este es nuestro compromiso contigo.
            </p>
          </div>

          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            @for (c of commitments; track c.title) {
              <div
                class="group rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
              >
                <span
                  class="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100"
                >
                  <app-icon [name]="c.icon" [size]="20" />
                </span>
                <h3 class="text-base font-bold text-[#1B4332]">{{ c.title }}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-[#6B8A7A]">{{ c.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="relative overflow-hidden bg-[#0F1F1A] py-20 md:py-28">
        <div class="adventure-dots-light absolute inset-0"></div>
        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Una operación impulsada por tecnología
            </h2>
            <p class="mt-4 text-base leading-relaxed text-emerald-100/60 md:text-lg">
              Utilizamos una plataforma digital que nos permite ofrecer un servicio más rápido y eficiente.
            </p>
          </div>

          <div class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            @for (item of techItems; track item) {
              <div
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10"
              >
                <span class="text-xs font-medium text-emerald-100/80">{{ item }}</span>
              </div>
            }
          </div>

          <div class="mt-10 text-center">
            <p class="mx-auto max-w-xl text-sm text-emerald-100/50">
              Nuestra plataforma de gestión comercial integra cada aspecto de la operación para que nuestros
              colaboradores puedan enfocarse en lo más importante: ofrecer la mejor experiencia a cada cliente.
            </p>
          </div>
        </div>
      </section>

      <section class="relative bg-white py-20 md:py-28">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-#1B4332 via-#2D6A4F to-#1B4332 p-8 md:p-12 lg:p-16">
            <div class="adventure-dots-strong absolute inset-0"></div>
            <div class="relative mx-auto max-w-2xl text-center">
              <h2 class="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
                ¿Eres parte de nuestro equipo?
              </h2>
              <p class="mt-4 text-base leading-relaxed text-emerald-100/70 md:text-lg">
                Accede a nuestra plataforma de gestión comercial para administrar clientes, pedidos, productos y más.
              </p>
              <div class="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  appButton
                  routerLink="/adventure/login"
                  variant="secondary"
                  className="h-12 px-8 bg-white text-[#1B4332] border-0 text-sm shadow-xl hover:bg-emerald-50"
                >
                  <app-icon name="log-in" [size]="16" class="mr-2" />
                  Portal de colaboradores
                </a>
                <a
                  appButton
                  routerLink="/adventure/login"
                  variant="ghost"
                  className="h-12 px-8 border-white/20 text-white text-sm hover:bg-white/10 hover:text-white"
                >
                  Iniciar sesión
                  <app-icon name="arrow-right" [size]="16" class="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AdventureHomeComponent {
  readonly values = VALUES;
  readonly categories = CATEGORIES;
  readonly opSteps = OP_STEPS;
  readonly regions = REGIONS;
  readonly stats = STATS;
  readonly commitments = COMMITMENTS;
  readonly techItems = TECH_ITEMS;
}
