import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface IconItem {
  icon: string;
  title: string;
  desc: string;
}

interface TechItem {
  name: string;
  icon: string;
}

interface TechGroup {
  category: string;
  items: TechItem[];
}

interface ProcessStep {
  step: number;
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-corporate-landing',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="flex flex-col">
      <section class="relative min-h-[90svh] flex items-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div class="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl"></div>
          <div class="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-primary/3 blur-3xl"></div>
          <svg class="absolute inset-0 size-full opacity-[0.03]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <pattern id="corporate-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5"></path>
              </pattern>
            </defs>
            <rect width="1000" height="1000" fill="url(#corporate-grid)"></rect>
          </svg>
        </div>

        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div class="max-w-3xl">
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
              <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary">
                <app-icon name="sparkles" [size]="12" /> Desarrollo de software profesional
              </span>
            </div>
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" [style.animation-delay]="'150ms'">
              <h1 class="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                Transformamos ideas en <span class="text-primary">soluciones de software</span>
              </h1>
            </div>
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" [style.animation-delay]="'300ms'">
              <p class="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-2xl">
                Desarrollamos soluciones tecnológicas modernas, escalables y seguras para ayudar a las empresas a optimizar sus procesos y crecer.
              </p>
            </div>
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" [style.animation-delay]="'450ms'">
              <div class="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <a routerLink="/servicios" class="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Conoce nuestros servicios <app-icon name="arrow-right" [size]="16" />
                </a>
                <a routerLink="/login" class="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>

          <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" [style.animation-delay]="'600ms'">
            <div class="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl">
              @for (stat of stats; track stat.label) {
                <div class="rounded-xl border border-border bg-card/50 backdrop-blur p-4 text-center">
                  <p class="text-2xl font-bold text-foreground">{{ stat.value }}</p>
                  <p class="text-xs text-muted-foreground mt-1">{{ stat.label }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span class="text-xs font-semibold uppercase tracking-widest text-primary">Quiénes somos</span>
              <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Construimos tecnología que impulsa negocios</h2>
              <p class="mt-4 text-base leading-relaxed text-muted-foreground">
                En CREADOR SOFTWARE diseñamos y desarrollamos soluciones tecnológicas a la medida de cada negocio. Combinamos experiencia técnica, innovación y un enfoque centrado en resultados para crear software que genera impacto real.
              </p>
              <p class="mt-3 text-base leading-relaxed text-muted-foreground">
                Creemos en el código limpio, las arquitecturas escalables y la mejora continua. Cada proyecto es una oportunidad para transformar procesos, optimizar recursos y llevar empresas al siguiente nivel.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              @for (item of aboutItems; track item.title) {
                <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                  <span class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <app-icon [name]="item.icon" [size]="20" />
                  </span>
                  <p class="mt-3 text-sm font-semibold text-card-foreground">{{ item.title }}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{{ item.desc }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Servicios</span>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Todo lo que necesitas para tu proyecto</h2>
            <p class="mt-3 text-base text-muted-foreground">Cubrimos cada etapa del ciclo de vida del software con un equipo multidisciplinario.</p>
          </div>
          <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            @for (service of services; track service.title) {
              <div class="group rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5 hover:ring-primary/20 transition-all">
                <span class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <app-icon [name]="service.icon" [size]="20" />
                </span>
                <h3 class="mt-4 text-base font-semibold text-card-foreground">{{ service.title }}</h3>
                <p class="mt-1.5 text-sm text-muted-foreground leading-relaxed">{{ service.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Tecnologías</span>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Nuestro stack tecnológico</h2>
            <p class="mt-3 text-base text-muted-foreground">Trabajamos con tecnologías modernas y probadas para garantizar calidad y rendimiento.</p>
          </div>
          <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            @for (group of techGroups; track group.category) {
              <div>
                <h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">{{ group.category }}</h3>
                <div class="space-y-2">
                  @for (tech of group.items; track tech.name) {
                    <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5">
                      <app-icon [name]="tech.icon" [size]="16" class="text-primary" />
                      <span class="text-sm font-medium text-card-foreground">{{ tech.name }}</span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Soluciones</span>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Construimos lo que tu negocio necesita</h2>
            <p class="mt-3 text-base text-muted-foreground">Desde plataformas empresariales hasta APIs, diseñamos soluciones que se adaptan a tus objetivos.</p>
          </div>
          <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            @for (solution of solutions; track solution.title) {
              <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
                <span class="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <app-icon [name]="solution.icon" [size]="18" />
                </span>
                <h3 class="mt-3 text-sm font-semibold text-card-foreground">{{ solution.title }}</h3>
                <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{{ solution.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Proceso</span>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Cómo trabajamos</h2>
            <p class="mt-3 text-base text-muted-foreground">Un proceso estructurado en seis fases para garantizar resultados predecibles y de calidad.</p>
          </div>

          <div class="mt-12 hidden lg:block">
            <div class="relative">
              <div class="absolute top-12 left-[10%] right-[10%] h-0.5 bg-border" aria-hidden="true"></div>
              <div class="grid grid-cols-6 gap-6 relative">
                @for (step of processSteps; track step.step) {
                  <div class="flex flex-col items-center text-center">
                    <span class="flex size-24 items-center justify-center rounded-full border-2 border-border bg-card ring-1 ring-foreground/5 relative z-10">
                      <app-icon [name]="step.icon" [size]="32" class="text-primary" />
                    </span>
                    <span class="mt-2 inline-flex items-center justify-center size-6 rounded-full bg-primary text-[11px] font-bold text-primary-foreground">{{ step.step }}</span>
                    <h3 class="mt-2 text-sm font-semibold text-card-foreground">{{ step.title }}</h3>
                    <p class="mt-1 text-xs text-muted-foreground leading-relaxed">{{ step.desc }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="mt-8 lg:hidden space-y-0">
            @for (step of processSteps; track step.step; let last = $last) {
              <div class="flex gap-4 pb-8 relative">
                <div class="flex flex-col items-center">
                  <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary relative z-10">
                    <app-icon [name]="step.icon" [size]="20" />
                  </span>
                  @if (!last) {
                    <div class="w-0.5 flex-1 bg-border mt-1"></div>
                  }
                </div>
                <div>
                  <span class="inline-flex items-center justify-center size-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{{ step.step }}</span>
                  <h3 class="mt-1 text-sm font-semibold text-card-foreground">{{ step.title }}</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">{{ step.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 bg-muted/30 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Calidad</span>
            <h2 class="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Software construido para crecer contigo</h2>
            <p class="mt-3 text-base text-muted-foreground">Cada línea de código sigue estándares estrictos de calidad, seguridad y buenas prácticas.</p>
          </div>
          <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            @for (item of qualityItems; track item.title) {
              <div class="flex gap-3.5 rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5">
                <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <app-icon [name]="item.icon" [size]="16" />
                </span>
                <div>
                  <h3 class="text-sm font-semibold text-card-foreground">{{ item.title }}</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">{{ item.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-20 sm:py-28 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 sm:p-12 lg:p-16">
            <div class="absolute top-0 right-0 size-64 rounded-full bg-primary/10 blur-3xl" aria-hidden="true"></div>
            <div class="relative z-10 text-center max-w-2xl mx-auto">
              <h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">¿Tienes una idea? Hagámosla realidad.</h2>
              <p class="mt-4 text-lg text-muted-foreground">Cuéntanos qué necesitas y construyamos juntos una solución tecnológica que genere resultados.</p>
              <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a routerLink="/contacto" class="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Hablar con nosotros <app-icon name="arrow-right" [size]="16" />
                </a>
                <a routerLink="/login" class="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  Iniciar sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CorporateLandingComponent {
  readonly stats = [
    { label: 'Proyectos entregados', value: '120+' },
    { label: 'Clientes activos', value: '45+' },
    { label: 'Años de experiencia', value: '8+' },
    { label: 'Profesionales', value: '25+' },
  ];

  readonly aboutItems: IconItem[] = [
    { icon: 'code-xml', title: 'Software personalizado', desc: 'Soluciones hechas a la medida' },
    { icon: 'layers', title: 'Arquitecturas escalables', desc: 'Diseñadas para crecer contigo' },
    { icon: 'globe', title: 'Desarrollo Full Stack', desc: 'Frontend + Backend + Cloud' },
    { icon: 'building-2', title: 'Soluciones empresariales', desc: 'Para empresas de todos los tamaños' },
  ];

  readonly services: IconItem[] = [
    { icon: 'code-xml', title: 'Desarrollo de software', desc: 'Aplicaciones web y sistemas empresariales personalizados.' },
    { icon: 'layers', title: 'Desarrollo Full Stack', desc: 'Frontend y backend utilizando tecnologías modernas.' },
    { icon: 'palette', title: 'UX/UI', desc: 'Diseño de experiencias digitales intuitivas y profesionales.' },
    { icon: 'database', title: 'Bases de datos', desc: 'Diseño, optimización y administración de bases de datos.' },
    { icon: 'cloud', title: 'DevOps & Cloud', desc: 'Automatización, CI/CD, Docker y despliegues en la nube.' },
    { icon: 'shield', title: 'Quality Assurance', desc: 'Pruebas funcionales, integración, rendimiento y control de calidad.' },
  ];

  readonly techGroups: TechGroup[] = [
    { category: 'Frontend', items: [
      { name: 'Angular', icon: 'globe' }, { name: 'React', icon: 'globe' }, { name: 'TypeScript', icon: 'file-code' }, { name: 'JavaScript', icon: 'file-code' },
    ] },
    { category: 'Backend', items: [
      { name: 'Java', icon: 'terminal' }, { name: 'Spring Boot', icon: 'terminal' }, { name: 'Node.js', icon: 'terminal' },
    ] },
    { category: 'Bases de datos', items: [
      { name: 'PostgreSQL', icon: 'database' }, { name: 'MySQL', icon: 'database' }, { name: 'MongoDB', icon: 'database' },
    ] },
    { category: 'DevOps', items: [
      { name: 'Docker', icon: 'cpu' }, { name: 'Git', icon: 'git-branch' }, { name: 'GitHub', icon: 'git-branch' }, { name: 'CI/CD', icon: 'refresh-cw' },
    ] },
    { category: 'Cloud', items: [
      { name: 'AWS', icon: 'cloud' }, { name: 'Azure', icon: 'cloud' }, { name: 'Google Cloud', icon: 'cloud' },
    ] },
  ];

  readonly solutions: IconItem[] = [
    { icon: 'building-2', title: 'Plataformas empresariales', desc: 'Sistemas integrales que centralizan la operación de tu negocio en un solo lugar.' },
    { icon: 'users', title: 'CRM', desc: 'Gestión de relaciones con clientes, automatización de ventas y seguimiento comercial.' },
    { icon: 'settings', title: 'ERP', desc: 'Planificación de recursos empresariales para optimizar procesos administrativos.' },
    { icon: 'bar-chart-3', title: 'Dashboards', desc: 'Paneles de control interactivos con métricas en tiempo real para la toma de decisiones.' },
    { icon: 'globe', title: 'APIs', desc: 'Interfaces de programación robustas y documentadas para integrar tus sistemas.' },
    { icon: 'server', title: 'Sistemas de gestión', desc: 'Soluciones administrativas para inventario, facturación, nómina y más.' },
    { icon: 'monitor-smartphone', title: 'Aplicaciones web', desc: 'Plataformas responsivas accesibles desde cualquier dispositivo y navegador.' },
    { icon: 'zap', title: 'Automatización de procesos', desc: 'Optimización de flujos de trabajo mediante automatización inteligente.' },
  ];

  readonly processSteps: ProcessStep[] = [
    { step: 1, title: 'Descubrimiento', desc: 'Entendemos el problema y las necesidades del cliente.', icon: 'lightbulb' },
    { step: 2, title: 'Diseño', desc: 'Diseñamos la experiencia y arquitectura de la solución.', icon: 'palette' },
    { step: 3, title: 'Desarrollo', desc: 'Construimos la solución utilizando metodologías ágiles.', icon: 'code-xml' },
    { step: 4, title: 'Calidad', desc: 'Realizamos pruebas y validaciones.', icon: 'shield' },
    { step: 5, title: 'Despliegue', desc: 'Publicamos la solución en ambientes productivos.', icon: 'cloud' },
    { step: 6, title: 'Evolución', desc: 'Mantenemos y mejoramos continuamente el producto.', icon: 'trending-up' },
  ];

  readonly qualityItems: IconItem[] = [
    { icon: 'lock', title: 'Control de acceso', desc: 'Autenticación segura y gestión de permisos por roles.' },
    { icon: 'users', title: 'Gestión de usuarios', desc: 'Administración centralizada de usuarios y perfiles.' },
    { icon: 'file-code', title: 'Trazabilidad', desc: 'Registro detallado de cambios y auditoría de acciones.' },
    { icon: 'git-branch', title: 'Control de versiones', desc: 'Gestión de código con Git y flujos de trabajo colaborativos.' },
    { icon: 'refresh-cw', title: 'Pruebas automatizadas', desc: 'Tests unitarios, de integración y extremo a extremo.' },
    { icon: 'monitor-smartphone', title: 'Monitoreo', desc: 'Supervisión continua de rendimiento y disponibilidad.' },
    { icon: 'server', title: 'Copias de seguridad', desc: 'Backups automatizados con recuperación ante desastres.' },
    { icon: 'circle-check', title: 'Buenas prácticas', desc: 'Código limpio, revisión de pares y estándares de la industria.' },
  ];
}
