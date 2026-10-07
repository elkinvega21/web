import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface SolucionItem {
  icon: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-corporate-soluciones',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div>
      <section class="pt-32 pb-20 border-b border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Soluciones</span>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Construimos lo que tu negocio necesita</h1>
            <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
              Desde plataformas empresariales integrales hasta APIs especializadas, diseñamos y desarrollamos soluciones que se adaptan a los objetivos de tu organización.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          @for (solucion of soluciones; track solucion.title; let i = $index) {
            <div class="grid gap-8 lg:grid-cols-2 items-center">
              <div [class]="textColClass(i)">
                <span class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <app-icon [name]="solucion.icon" [size]="24" />
                </span>
                <h2 class="mt-4 text-2xl font-bold tracking-tight text-foreground">{{ solucion.title }}</h2>
                <p class="mt-3 text-base text-muted-foreground leading-relaxed">{{ solucion.desc }}</p>
              </div>
              <div [class]="visualColClass(i)">
                <div class="rounded-xl border border-border bg-card p-8 ring-1 ring-foreground/5">
                  <div class="grid grid-cols-2 gap-3">
                    @for (n of featureNumbers; track n) {
                      <div class="rounded-lg bg-muted/30 p-3 text-center">
                        <app-icon name="circle-check" [size]="20" class="mx-auto text-primary" />
                        <p class="mt-1.5 text-xs font-medium text-card-foreground">Característica {{ n }}</p>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="py-16 sm:py-20 bg-muted/30 border-t border-border text-center">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Necesitas una solución personalizada?</h2>
          <p class="mt-3 text-base text-muted-foreground max-w-xl mx-auto">Cada negocio es único. Construyamos juntos la solución que realmente necesitas.</p>
          <a routerLink="/contacto" class="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Contáctanos <app-icon name="arrow-right" [size]="16" />
          </a>
        </div>
      </section>
    </div>
  `,
})
export class CorporateSolucionesComponent {
  readonly featureNumbers = [1, 2, 3, 4];

  readonly soluciones: SolucionItem[] = [
    {
      icon: 'building-2',
      title: 'Plataformas empresariales',
      desc: 'Sistemas integrales que centralizan la operación de tu negocio en un solo lugar. Desde la gestión de inventarios hasta la facturación electrónica, todo en una plataforma unificada.',
    },
    {
      icon: 'users',
      title: 'CRM',
      desc: 'Gestión de relaciones con clientes que te permite automatizar ventas, hacer seguimiento comercial, gestionar leads y mejorar la experiencia de tus clientes.',
    },
    {
      icon: 'settings',
      title: 'ERP',
      desc: 'Planificación de recursos empresariales para integrar y optimizar procesos administrativos, financieros, comerciales y de producción.',
    },
    {
      icon: 'bar-chart-3',
      title: 'Dashboards',
      desc: 'Paneles de control interactivos con métricas en tiempo real. Visualiza indicadores clave, genera reportes y toma decisiones basadas en datos.',
    },
    {
      icon: 'globe',
      title: 'APIs',
      desc: 'Interfaces de programación robustas y documentadas que permiten integrar tus sistemas con plataformas externas, apps móviles y servicios cloud.',
    },
    {
      icon: 'server',
      title: 'Sistemas de gestión',
      desc: 'Soluciones administrativas para inventario, facturación electrónica, nómina, activos fijos y más. Adaptadas a la normativa colombiana.',
    },
    {
      icon: 'monitor-smartphone',
      title: 'Aplicaciones web',
      desc: 'Plataformas responsivas accesibles desde cualquier dispositivo y navegador. Diseñadas para funcionar tanto en desktop como en móvil.',
    },
    {
      icon: 'zap',
      title: 'Automatización de procesos',
      desc: 'Optimización de flujos de trabajo mediante automatización inteligente. Reduce tiempos, minimiza errores y aumenta la productividad.',
    },
  ];

  textColClass(index: number): string {
    return index % 2 === 1 ? 'lg:order-2' : '';
  }

  visualColClass(index: number): string {
    return index % 2 === 1 ? 'lg:order-1' : '';
  }
}
