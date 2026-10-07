import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface ValueItem {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-corporate-nosotros',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div>
      <section class="pt-32 pb-20 border-b border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Nosotros</span>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Construimos tecnología que impulsa negocios</h1>
            <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
              CREADOR SOFTWARE es una empresa colombiana de desarrollo de software fundada por profesionales apasionados por la tecnología. Nos especializamos en crear soluciones digitales que transforman la manera en que las empresas operan y crecen.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-foreground">Nuestra historia</h2>
              <p class="mt-4 text-base text-muted-foreground leading-relaxed">
                Nacimos de la convicción de que el software bien diseñado puede transformar empresas. Desde nuestros inicios, hemos trabajado con organizaciones de todos los tamaños, ayudándolas a digitalizar procesos, optimizar operaciones y conectar con sus clientes de formas innovadoras.
              </p>
              <p class="mt-3 text-base text-muted-foreground leading-relaxed">
                Hoy somos un equipo multidisciplinario de 25+ profesionales que combinan experiencia en desarrollo, diseño, arquitectura y operaciones para entregar soluciones de clase mundial.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              @for (stat of teamStats; track stat.label) {
                <div class="rounded-xl border border-border bg-card p-5 text-center ring-1 ring-foreground/5">
                  <p class="text-3xl font-bold text-primary">{{ stat.value }}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{{ stat.label }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20 bg-muted/30 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Nuestros valores</h2>
            <p class="mt-3 text-base text-muted-foreground">Los principios que guían cada decisión y cada línea de código.</p>
          </div>
          <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            @for (value of values; track value.title) {
              <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5 text-center">
                <span class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <app-icon [name]="value.icon" [size]="24" />
                </span>
                <h3 class="mt-4 text-base font-semibold text-card-foreground">{{ value.title }}</h3>
                <p class="mt-1.5 text-sm text-muted-foreground">{{ value.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Trabajamos juntos?</h2>
            <p class="mt-3 text-base text-muted-foreground">Cuéntanos sobre tu proyecto y hablemos.</p>
            <a routerLink="/contacto" class="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Contactar ahora <app-icon name="arrow-right" [size]="16" />
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CorporateNosotrosComponent {
  readonly values: ValueItem[] = [
    { icon: 'lightbulb', title: 'Innovación', desc: 'Buscamos constantemente nuevas formas de resolver problemas.' },
    { icon: 'shield', title: 'Calidad', desc: 'Cada línea de código pasa por estándares rigurosos.' },
    { icon: 'users', title: 'Colaboración', desc: 'Trabajamos codo a codo con nuestros clientes.' },
    { icon: 'target', title: 'Resultados', desc: 'Medimos nuestro éxito por el impacto que generamos.' },
  ];

  readonly teamStats = [
    { label: 'Ingenieros de software', value: '15' },
    { label: 'Diseñadores UX/UI', value: '4' },
    { label: 'Arquitectos de software', value: '3' },
    { label: 'DevOps', value: '3' },
  ];
}
