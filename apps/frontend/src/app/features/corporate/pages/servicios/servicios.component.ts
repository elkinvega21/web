import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface ServiceDetail {
  icon: string;
  title: string;
  desc: string;
  features: string[];
}

@Component({
  selector: 'app-corporate-servicios',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div>
      <section class="pt-32 pb-20 border-b border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Servicios</span>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Todo lo que necesitas para tu proyecto</h1>
            <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
              Ofrecemos un conjunto completo de servicios de ingeniería de software para acompañar tu proyecto desde la idea hasta la operación.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          @for (service of services; track service.title; let i = $index) {
            <div class="grid gap-8 lg:grid-cols-2 items-center">
              <div [class]="textColClass(i)">
                <span class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <app-icon [name]="service.icon" [size]="24" />
                </span>
                <h2 class="mt-4 text-2xl font-bold tracking-tight text-foreground">{{ service.title }}</h2>
                <p class="mt-3 text-base text-muted-foreground leading-relaxed">{{ service.desc }}</p>
                <ul class="mt-4 space-y-2">
                  @for (feature of service.features; track feature) {
                    <li class="flex items-center gap-2 text-sm text-muted-foreground">
                      <app-icon name="circle-check" [size]="16" class="text-primary shrink-0" /> {{ feature }}
                    </li>
                  }
                </ul>
              </div>
              <div [class]="visualColClass(i)">
                <div class="rounded-xl border border-border bg-card p-8 ring-1 ring-foreground/5">
                  <div class="grid grid-cols-2 gap-4">
                    @for (feature of service.features; track feature) {
                      <div class="rounded-lg bg-muted/50 px-3 py-4 text-center">
                        <p class="text-xs font-medium text-card-foreground">{{ feature }}</p>
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
          <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">¿Listo para empezar?</h2>
          <p class="mt-3 text-base text-muted-foreground max-w-xl mx-auto">Hablemos sobre cómo podemos ayudarte a construir la solución que necesitas.</p>
          <a routerLink="/contacto" class="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Solicitar cotización <app-icon name="arrow-right" [size]="16" />
          </a>
        </div>
      </section>
    </div>
  `,
})
export class CorporateServiciosComponent {
  readonly services: ServiceDetail[] = [
    {
      icon: 'code-xml',
      title: 'Desarrollo de software',
      desc: 'Creamos aplicaciones web y sistemas empresariales personalizados desde cero. Analizamos tus necesidades, diseñamos la arquitectura y construimos soluciones robustas que se integran con tus procesos existentes.',
      features: ['Aplicaciones web a medida', 'Sistemas empresariales', 'Migración de sistemas legacy', 'Integración con APIs externas'],
    },
    {
      icon: 'layers',
      title: 'Desarrollo Full Stack',
      desc: 'Cubrimos tanto el frontend como el backend de tus proyectos utilizando tecnologías modernas. Desde interfaces de usuario intuitivas hasta servidores escalables y bases de datos optimizadas.',
      features: ['Frontend con React, Angular, TypeScript', 'Backend con Java, Spring Boot, Node.js', 'APIs RESTful y GraphQL', 'Arquitecturas serverless'],
    },
    {
      icon: 'palette',
      title: 'UX/UI Design',
      desc: 'Diseñamos experiencias digitales intuitivas y profesionales que tus usuarios amarán. Investigamos, prototipamos y validamos cada interacción para garantizar usabilidad y efectividad.',
      features: ['Investigación de usuarios', 'Wireframes y prototipos', 'Design Systems', 'Pruebas de usabilidad'],
    },
    {
      icon: 'database',
      title: 'Bases de datos',
      desc: 'Diseñamos, optimizamos y administramos bases de datos para garantizar rendimiento, integridad y disponibilidad de tu información crítica.',
      features: ['Modelado de datos', 'Optimización de consultas', 'Migración de bases de datos', 'Alta disponibilidad y replicación'],
    },
    {
      icon: 'cloud',
      title: 'DevOps & Cloud',
      desc: 'Automatizamos la infraestructura y los procesos de despliegue para que tu equipo pueda enfocarse en desarrollar. Implementamos CI/CD, contenedores y despliegues en la nube.',
      features: ['CI/CD pipelines', 'Docker y Kubernetes', 'Infraestructura como código', 'Monitoreo y alertas'],
    },
    {
      icon: 'shield',
      title: 'Quality Assurance',
      desc: 'Garantizamos la calidad de tu software mediante pruebas automatizadas y manuales en cada etapa del desarrollo. Tests funcionales, de integración, rendimiento y seguridad.',
      features: ['Pruebas unitarias y de integración', 'Tests end-to-end', 'Pruebas de rendimiento', 'Análisis de seguridad'],
    },
  ];

  textColClass(index: number): string {
    return index % 2 === 1 ? 'lg:order-2' : '';
  }

  visualColClass(index: number): string {
    return index % 2 === 1 ? 'lg:order-1' : '';
  }
}
