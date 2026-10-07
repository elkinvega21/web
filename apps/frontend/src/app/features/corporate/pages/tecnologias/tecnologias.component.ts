import { Component } from '@angular/core';

interface TechItem {
  name: string;
  desc: string;
}

interface TechGroup {
  category: string;
  items: TechItem[];
}

@Component({
  selector: 'app-corporate-tecnologias',
  standalone: true,
  imports: [],
  template: `
    <div>
      <section class="pt-32 pb-20 border-b border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl">
            <span class="text-xs font-semibold uppercase tracking-widest text-primary">Tecnologías</span>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Nuestro stack tecnológico</h1>
            <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
              Trabajamos con tecnologías modernas y probadas que nos permiten entregar soluciones robustas, escalables y de alto rendimiento.
            </p>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (group of techGroups; track group.category) {
              <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
                <h3 class="text-xs font-semibold uppercase tracking-wider mb-5 text-primary">{{ group.category }}</h3>
                <div class="space-y-3">
                  @for (tech of group.items; track tech.name) {
                    <div class="rounded-lg border border-border bg-background/50 p-3">
                      <p class="text-sm font-medium text-card-foreground">{{ tech.name }}</p>
                      <p class="text-xs text-muted-foreground mt-0.5">{{ tech.desc }}</p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-20 bg-muted/30 border-t border-border">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div class="max-w-2xl mx-auto">
            <h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Siempre actualizados</h2>
            <p class="mt-3 text-base text-muted-foreground">
              Nuestro equipo se mantiene en constante aprendizaje para adoptar las mejores herramientas y frameworks del mercado.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class CorporateTecnologiasComponent {
  readonly techGroups: TechGroup[] = [
    {
      category: 'Frontend',
      items: [
        { name: 'Angular', desc: 'Framework para aplicaciones web dinámicas y modulares.' },
        { name: 'React', desc: 'Biblioteca para interfaces de usuario modernas y reactivas.' },
        { name: 'TypeScript', desc: 'Superset de JavaScript con tipado estático.' },
        { name: 'JavaScript', desc: 'Lenguaje fundamental para el desarrollo web.' },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Java', desc: 'Lenguaje robusto para aplicaciones empresariales.' },
        { name: 'Spring Boot', desc: 'Framework para microservicios y aplicaciones cloud.' },
        { name: 'Node.js', desc: 'Entorno de ejecución para aplicaciones escalables.' },
      ],
    },
    {
      category: 'Bases de datos',
      items: [
        { name: 'PostgreSQL', desc: 'Base de datos relacional de alto rendimiento.' },
        { name: 'MySQL', desc: 'Sistema de gestión de bases de datos confiable.' },
        { name: 'MongoDB', desc: 'Base de datos NoSQL para aplicaciones modernas.' },
      ],
    },
    {
      category: 'DevOps',
      items: [
        { name: 'Docker', desc: 'Contenedores para entornos consistentes.' },
        { name: 'Git', desc: 'Control de versiones distribuido.' },
        { name: 'GitHub', desc: 'Plataforma de colaboración y CI/CD.' },
        { name: 'CI/CD', desc: 'Integración y despliegue continuo automatizado.' },
      ],
    },
    {
      category: 'Cloud',
      items: [
        { name: 'AWS', desc: 'Infraestructura cloud escalable y confiable.' },
        { name: 'Azure', desc: 'Servicios cloud empresariales de Microsoft.' },
        { name: 'Google Cloud', desc: 'Plataforma cloud con IA y analítica.' },
      ],
    },
    {
      category: 'Herramientas',
      items: [
        { name: 'Figma', desc: 'Diseño colaborativo de interfaces.' },
        { name: 'Postman', desc: 'Pruebas y documentación de APIs.' },
        { name: 'Jira', desc: 'Gestión ágil de proyectos.' },
      ],
    },
  ];
}
