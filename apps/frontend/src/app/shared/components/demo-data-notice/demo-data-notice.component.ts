import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

/**
 * Avisa de que lo que se está viendo son datos de demostración y no cifras
 * traídas del API. Sin este distintivo un fallo del backend pasaría inadvertido:
 * las gráficas seguirían mostrando números convincentes pero falsos.
 */
@Component({
  selector: 'app-demo-data-notice',
  standalone: true,
  imports: [IconComponent],
  template: `
    <span
      role="status"
      class="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/40 bg-warning/12 px-3 py-1 text-[11px] font-medium text-warning-foreground"
      [title]="detail()"
    >
      <app-icon name="triangle-alert" [size]="13" class="shrink-0 text-warning" />
      Datos de demostración · API no disponible
    </span>
  `,
})
export class DemoDataNoticeComponent {
  readonly detail = input(
    'No se pudo contactar el API. Las cifras mostradas provienen de los datos de prueba del prototipo.',
  );
}
