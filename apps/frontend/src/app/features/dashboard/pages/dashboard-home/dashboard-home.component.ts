import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  activity,
  alerts,
  calendarEvents,
  kpis,
  monthlySales,
  notifications,
  quickActions,
  sellers,
  tasks as initialTasks,
  territories,
  topProducts,
} from '../../../../core/data/dashboard-data';
import type { Task } from '../../../../core/data/dashboard-data';
import { DashboardService } from '../../services/dashboard.service';
import { toDashboardView } from '../../services/dashboard.mapper';
import { DemoDataNoticeComponent } from '../../../../shared/components/demo-data-notice/demo-data-notice.component';
import { ActivityFeedComponent, NotificationsPanelComponent } from '../../components/activity-feed/activity-feed.component';
import {
  MonthlySalesChartComponent,
  SellersChartComponent,
  TerritoryChartComponent,
  TopProductsChartComponent,
} from '../../components/charts-section/charts-section.component';
import { KpiCardsComponent } from '../../components/kpi-cards/kpi-cards.component';
import {
  CalendarWidgetComponent,
  QuickActionsComponent,
  TasksWidgetComponent,
} from '../../components/widgets-panel/widgets-panel.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    ActivityFeedComponent,
    DemoDataNoticeComponent,
    NotificationsPanelComponent,
    KpiCardsComponent,
    MonthlySalesChartComponent,
    TerritoryChartComponent,
    TopProductsChartComponent,
    SellersChartComponent,
    QuickActionsComponent,
    CalendarWidgetComponent,
    TasksWidgetComponent,
  ],
  template: `
    @if (pageState() === 'loading') {
      <div class="space-y-6" role="status" aria-label="Cargando dashboard">
        <div class="mb-8">
          <div class="h-4 w-24 animate-pulse rounded bg-muted"></div>
          <div class="mt-2 h-7 w-72 animate-pulse rounded bg-muted"></div>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="rounded-xl border border-border bg-card p-5">
              <div class="size-9 animate-pulse rounded-lg bg-muted"></div>
              <div class="mt-4 h-8 w-28 animate-pulse rounded bg-muted"></div>
              <div class="mt-1.5 h-4 w-20 animate-pulse rounded bg-muted"></div>
              <div class="mt-3 h-3 w-16 animate-pulse rounded bg-muted"></div>
            </div>
          }
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          @for (i of [1, 2]; track i) {
            <div class="rounded-xl border border-border bg-card p-5">
              <div class="mb-4 h-5 w-40 animate-pulse rounded bg-muted"></div>
              <div class="h-[220px] animate-pulse rounded-lg bg-muted"></div>
            </div>
          }
        </div>
        <div class="grid gap-4 lg:grid-cols-2">
          @for (i of [1, 2]; track i) {
            <div class="rounded-xl border border-border bg-card p-5">
              <div class="mb-4 h-5 w-40 animate-pulse rounded bg-muted"></div>
              <div class="h-[220px] animate-pulse rounded-lg bg-muted"></div>
            </div>
          }
        </div>
        <span class="sr-only">Cargando datos del dashboard…</span>
      </div>
    } @else {
      <div class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs capitalize text-muted-foreground">{{ dateStr }}</p>
          <h1 class="mt-0.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Panel principal</h1>
        </div>
        <div class="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
          @if (usingDemoData()) {
            <app-demo-data-notice />
          }
          <span class="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">Dashboard</span>
        </div>
      </div>

      <section class="mt-6" aria-label="Indicadores clave">
        <app-kpi-cards [data]="kpis()" />
      </section>

      <section class="mt-6 grid gap-4 lg:grid-cols-2" aria-label="Gráficas de ventas">
        <app-monthly-sales-chart [data]="monthlySales()" />
        <app-territory-chart [data]="territories()" />
      </section>

      <section class="mt-4 grid gap-4 lg:grid-cols-2" aria-label="Gráficas de productos y vendedores">
        <app-top-products-chart [data]="topProducts()" />
        <app-sellers-chart [data]="sellers()" />
      </section>

      <section class="mt-6 grid gap-4 xl:grid-cols-3" aria-label="Actividad y notificaciones">
        <div class="xl:col-span-2">
          <app-activity-feed [items]="activity()" />
        </div>
        <div>
          <app-notifications-panel [notifications]="notifications" [alerts]="alerts()" />
        </div>
      </section>

      <section class="mt-4 grid gap-4 lg:grid-cols-3" aria-label="Widgets">
        <app-quick-actions [actions]="quickActions" />
        <app-calendar-widget [events]="calendarEvents" />
        <app-tasks-widget [tasks]="tasks()" (taskToggle)="toggleTask($event)" />
      </section>
    }
  `,
})
export class DashboardHomeComponent implements OnDestroy {
  private readonly dashboardService = inject(DashboardService);
  private readonly subscription: Subscription;

  readonly pageState = signal<'loading' | 'ready'>('loading');
  readonly tasks = signal<Task[]>(initialTasks);
  readonly dateStr = this.formatDate(new Date());

  /**
   * Datos servidos por el API. Arrancan con los valores de prueba para que el
   * prototipo siga siendo navegable si el backend no está levantado; en ese caso
   * `usingDemoData` deja constancia visible de que no son cifras reales.
   *
   * Arranca en false y solo se activa si la petición falla: mientras carga
   * todavía no se sabe si habrá API.
   */
  readonly usingDemoData = signal(false);
  readonly kpis = signal(kpis);
  readonly monthlySales = signal(monthlySales);
  readonly territories = signal(territories);
  readonly topProducts = signal(topProducts);
  readonly sellers = signal(sellers);
  readonly activity = signal(activity);
  readonly alerts = signal(alerts);

  /** Sin respaldo en el modelo de datos: siguen siendo de prueba. */
  readonly notifications = notifications;
  readonly quickActions = quickActions;
  readonly calendarEvents = calendarEvents;

  constructor() {
    this.subscription = this.dashboardService.load().subscribe({
      next: (dashboard) => {
        const view = toDashboardView(dashboard);
        this.kpis.set(view.kpis);
        this.monthlySales.set(view.monthlySales);
        this.territories.set(view.territories);
        this.topProducts.set(view.topProducts);
        this.sellers.set(view.sellers);
        this.activity.set(view.activity);
        this.alerts.set(view.alerts);
        this.pageState.set('ready');
      },
      // Se conservan los datos de prueba, pero el aviso queda visible.
      error: () => {
        this.usingDemoData.set(true);
        this.pageState.set('ready');
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleTask(id: string): void {
    this.tasks.update((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
