import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const VALUES = [
  {
    icon: 'star',
    label: 'Calidad',
    desc: 'Seleccionamos los mejores productos y marcas para garantizar durabilidad y rendimiento en cada aventura.',
  },
  {
    icon: 'heart',
    label: 'Servicio',
    desc: 'Cada cliente recibe atención personalizada. Nuestro equipo está entrenado para asesorar y acompañar.',
  },
  {
    icon: 'shield',
    label: 'Confianza',
    desc: 'Construimos relaciones basadas en transparencia, cumplimiento y compromiso con cada promesa.',
  },
  {
    icon: 'compass',
    label: 'Aventura',
    desc: 'Vivimos lo que vendemos. La pasión por la naturaleza y el aire libre impulsa todo lo que hacemos.',
  },
  {
    icon: 'tree-pine',
    label: 'Sostenibilidad',
    desc: 'Trabajamos para minimizar nuestro impacto ambiental y promover prácticas responsables.',
  },
];

const TEAM = [
  { name: 'Carlos Mendoza', role: 'Director General' },
  { name: 'Ana Silva', role: 'Gerente de Ventas' },
  { name: 'Pedro Ramírez', role: 'Jefe de Operaciones' },
  { name: 'María Torres', role: 'Gerente de Producto' },
];

const PILLARS = [
  {
    icon: 'target',
    title: 'Misión',
    desc: 'Ofrecer productos y soluciones que inspiren a las personas a explorar, disfrutar y superar nuevos desafíos al aire libre.',
  },
  {
    icon: 'eye',
    title: 'Visión',
    desc: 'Ser la empresa líder en comercialización de productos deportivos y de aventura en la región, reconocida por calidad, servicio e innovación.',
  },
  {
    icon: 'users',
    title: 'Propósito',
    desc: 'Hacer que cada aventura sea posible, equipando a las personas con lo mejor para vivir experiencias inolvidables.',
  },
];

@Component({
  selector: 'app-adventure-nosotros',
  standalone: true,
  imports: [RouterLink, AppButton, IconComponent],
  template: `
    <div>
      <section class="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
        <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e to-#1B4332"></div>
        <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">Sobre Adventure Retail</h1>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-100/70 md:text-lg">
            Conoce nuestra historia, nuestros valores y el equipo que hace posible cada aventura.
          </p>
        </div>
      </section>

      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 class="text-2xl font-bold text-[#1B4332] md:text-3xl">Nuestra historia</h2>
              <p class="mt-4 leading-relaxed text-[#4A6B5A]">
                Adventure Retail nació de la pasión por la naturaleza y el deporte al aire libre. Lo que comenzó como una
                pequeña tienda especializada se ha convertido en una empresa de referencia en la comercialización de
                productos deportivos y de aventura.
              </p>
              <p class="mt-4 leading-relaxed text-[#4A6B5A]">
                Hoy trabajamos con más de 200 clientes activos, un equipo de más de 50 vendedores distribuidos en
                múltiples territorios, y un catálogo que supera los 1,000 productos. Nuestra operación está respaldada
                por una plataforma digital que nos permite gestionar cada aspecto del negocio con eficiencia y calidad.
              </p>
            </div>
            <div class="flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-100 to-amber-50 p-8 md:p-12">
              <div class="text-center">
                <app-icon name="mountain" [size]="80" class="mx-auto text-emerald-600/30" />
                <p class="mt-4 text-lg font-bold text-[#1B4332]">Fundada en 2018</p>
                <p class="text-sm text-[#4A6B5A]">+6 años de experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-[#F5FAF7] py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 md:grid-cols-3">
            @for (p of pillars; track p.title) {
              <div
                class="rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg md:p-8"
              >
                <span class="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <app-icon [name]="p.icon" [size]="24" />
                </span>
                <h3 class="text-lg font-bold text-[#1B4332]">{{ p.title }}</h3>
                <p class="mt-2 text-sm leading-relaxed text-[#6B8A7A]">{{ p.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-center text-2xl font-bold text-[#1B4332] md:text-3xl">Nuestros valores</h2>
          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            @for (v of values; track v.label) {
              <div
                class="group rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <span
                  class="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100"
                >
                  <app-icon [name]="v.icon" [size]="20" />
                </span>
                <h3 class="mt-3 text-base font-bold text-[#1B4332]">{{ v.label }}</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-[#6B8A7A]">{{ v.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="bg-[#F5FAF7] py-16 md:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-center text-2xl font-bold text-[#1B4332] md:text-3xl">Nuestro equipo</h2>
          <p class="mx-auto mt-4 max-w-xl text-center text-[#4A6B5A]">
            Conoce a las personas que lideran Adventure Retail.
          </p>
          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            @for (m of team; track m.name) {
              <div
                class="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center transition-all duration-300 hover:border-emerald-200 hover:shadow-lg"
              >
                <span class="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600">
                  {{ initials(m.name) }}
                </span>
                <h3 class="mt-4 text-base font-bold text-[#1B4332]">{{ m.name }}</h3>
                <p class="text-sm text-[#6B8A7A]">{{ m.role }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="bg-white py-16 md:py-20">
        <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-[#1B4332] md:text-3xl">¿Quieres ser parte de Adventure Retail?</h2>
          <p class="mx-auto mt-3 max-w-lg text-[#4A6B5A]">
            Contáctanos para conocer más sobre nuestros productos y servicios.
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
export class AdventureNosotrosComponent {
  readonly values = VALUES;
  readonly team = TEAM;
  readonly pillars = PILLARS;

  initials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}
