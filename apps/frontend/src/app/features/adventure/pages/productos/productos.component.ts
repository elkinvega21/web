import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

const CATEGORIES = [
  {
    name: 'Outdoor',
    desc: 'Ropa y equipo para actividades al aire libre. Chaquetas impermeables, pantalones técnicos, capas térmicas y accesorios diseñados con los más altos estándares de resistencia y comodidad.',
    icon: 'mountain',
    features: ['Chaquetas impermeables', 'Ropa técnica térmica', 'Calzado outdoor', 'Accesorios de protección'],
  },
  {
    name: 'Camping',
    desc: 'Todo lo necesario para acampar con comodidad y seguridad. Carpas, sleeping bags, colchonetas, cocinas portátiles y mobiliario para campamento.',
    icon: 'tent',
    features: ['Carpas para 2-8 personas', 'Sacos de dormir', 'Colchonetas aislantes', 'Cocinas y utensilios'],
  },
  {
    name: 'Senderismo',
    desc: 'Calzado, bastones y mochilas diseñados para rutas y montañas. Productos que combinan ligereza, resistencia y ergonomía para largas caminatas.',
    icon: 'tree-pine',
    features: ['Zapatos de trail', 'Bastones ajustables', 'Mochilas técnicas', 'Hidratación portátil'],
  },
  {
    name: 'Ciclismo',
    desc: 'Bicicletas, cascos, accesorios y vestimenta para rutas y montaña. Desde ciclismo recreativo hasta enduro y competición.',
    icon: 'bike',
    features: ['Bicicletas MTB y ruta', 'Cascos y protecciones', 'Vestimenta ciclista', 'Accesorios y repuestos'],
  },
  {
    name: 'Accesorios',
    desc: 'GPS, linternas, navajas multiherramienta, sistemas de hidratación y complementos que marcan la diferencia en cada salida.',
    icon: 'backpack',
    features: ['GPS y navegación', 'Linternas frontales', 'Navajas multiherramienta', 'Sistemas de hidratación'],
  },
  {
    name: 'Equipamiento deportivo',
    desc: 'Implementos profesionales para disciplinas outdoor y deportes de aventura. Escalada, rappel, kayak y más.',
    icon: 'wind',
    features: ['Equipo de escalada', 'Implementos de rappel', 'Kayak y remos', 'Protecciones deportivas'],
  },
];

@Component({
  selector: 'app-adventure-productos',
  standalone: true,
  imports: [RouterLink, AppButton, IconComponent],
  template: `
    <div>
      <section class="relative overflow-hidden pb-16 pt-24 md:pb-20 md:pt-32">
        <div class="absolute inset-0 bg-gradient-to-b from-#0A1628 via-#1a3a2e to-#1B4332"></div>
        <div class="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-5xl">Nuestros productos</h1>
          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-100/70 md:text-lg">
            Descubre nuestra amplia gama de productos diseñados para acompañarte en cada aventura.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-4 text-sm text-emerald-100/50">
            <span class="flex items-center gap-1">
              <app-icon name="compass" [size]="14" />
              +1,000 productos
            </span>
            <span class="flex items-center gap-1">
              <app-icon name="shield" [size]="14" />
              Marcas premium
            </span>
          </div>
        </div>
      </section>

      <section class="bg-white py-16 md:py-24">
        <div class="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
          @for (cat of categories; track cat.name; let i = $index) {
            <div class="grid items-center gap-8 md:gap-12 lg:grid-cols-2">
              <div [class]="imageOrder(i)">
                <div
                  class="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-100 to-amber-50 p-12 md:p-16"
                >
                  <app-icon [name]="cat.icon" [size]="96" class="text-emerald-600/30" />
                </div>
              </div>
              <div [class]="textOrder(i)">
                <h2 class="text-2xl font-bold text-[#1B4332] md:text-3xl">{{ cat.name }}</h2>
                <p class="mt-3 leading-relaxed text-[#4A6B5A]">{{ cat.desc }}</p>
                <ul class="mt-4 space-y-2">
                  @for (f of cat.features; track f) {
                    <li class="flex items-center gap-2 text-sm text-[#6B8A7A]">
                      <span class="size-1.5 rounded-full bg-emerald-500"></span>
                      {{ f }}
                    </li>
                  }
                </ul>
                <a
                  appButton
                  variant="link"
                  routerLink="/adventure/contacto"
                  className="mt-4 h-auto p-0 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Solicitar información
                  <app-icon name="arrow-right" [size]="14" class="ml-1" />
                </a>
              </div>
            </div>
          }
        </div>
      </section>

      <section class="bg-[#F5FAF7] py-16 text-center md:py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl font-bold text-[#1B4332] md:text-3xl">¿Necesitas algo en especial?</h2>
          <p class="mx-auto mt-3 max-w-lg text-[#4A6B5A]">
            Contáctanos y te ayudaremos a encontrar el producto ideal para tu próxima aventura.
          </p>
          <a
            appButton
            routerLink="/adventure/contacto"
            variant="secondary"
            className="mt-6 h-12 px-8 bg-emerald-600 text-white border-0 hover:bg-emerald-500"
          >
            Contactar
            <app-icon name="arrow-right" [size]="16" class="ml-2" />
          </a>
        </div>
      </section>
    </div>
  `,
})
export class AdventureProductosComponent {
  readonly categories = CATEGORIES;

  imageOrder(i: number): string {
    return i % 2 === 0 ? 'lg:order-1' : 'lg:order-2';
  }

  textOrder(i: number): string {
    return i % 2 === 0 ? 'lg:order-2' : 'lg:order-1';
  }
}
