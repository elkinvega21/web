import { Component, input } from '@angular/core';

import type { Activity, Alert, Notification } from '../../../../core/data/dashboard-data';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  template: `
    <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-card-foreground">Actividad reciente</h3>
        <button type="button" class="rounded text-xs font-medium text-primary hover:text-primary/80">Ver todo</button>
      </div>
      @if (items().length === 0) {
        <p class="py-8 text-center text-sm text-muted-foreground">Sin actividad reciente</p>
      } @else {
        <div class="mt-4 space-y-0">
          @for (item of items(); track item.id) {
            <div class="relative flex gap-3 pl-2" [class.pb-4]="!$last">
              @if (!$last) {
                <div class="absolute left-[19px] top-10 h-full w-px bg-border" aria-hidden="true"></div>
              }
              <span
                class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                [class.bg-accent]="item.tone === 'default'"
                [class.text-accent-foreground]="item.tone === 'default'"
                [class.text-success]="item.tone === 'success'"
                [class.text-warning]="item.tone === 'warning'"
                [class]="item.tone === 'success' ? 'bg-success/10' : item.tone === 'warning' ? 'bg-warning/10' : ''"
                aria-hidden="true"
              >{{ item.initials }}</span>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-card-foreground">
                  <span class="font-medium">{{ item.actor }}</span>
                  <span class="text-muted-foreground"> {{ item.action }} </span>
                  <span class="font-medium text-card-foreground">{{ item.target }}</span>
                </p>
                <p class="mt-0.5 text-xs text-muted-foreground">{{ item.time }}</p>
              </div>
              <span
                class="mt-2 size-1.5 shrink-0 rounded-full"
                [class]="item.tone === 'default' ? 'bg-muted-foreground/30' : ''"
                [class.bg-success]="item.tone === 'success'"
                [class.bg-warning]="item.tone === 'warning'"
                aria-hidden="true"
              ></span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ActivityFeedComponent {
  readonly items = input<Activity[]>([]);
}

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  template: `
    <div class="flex flex-col gap-4">
      <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-card-foreground">Notificaciones</h3>
          @if (hasUnread()) {
            <span class="inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">{{ unreadCount() }} nuevas</span>
          }
        </div>
        @if (notifications().length === 0) {
          <p class="py-4 text-center text-xs text-muted-foreground">Sin notificaciones</p>
        } @else {
          <div class="mt-3 space-y-1">
            @for (n of notifications(); track n.id) {
              <div class="flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted/50" [class]="n.unread ? 'bg-accent/30' : ''">
                <div class="min-w-0 flex-1">
                  <p class="text-sm" [class.font-medium]="n.unread" [class.text-card-foreground]="n.unread" [class.text-muted-foreground]="!n.unread">{{ n.title }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground/60">{{ n.time }}</p>
                </div>
                @if (n.unread) {
                  <span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true"></span>
                }
              </div>
            }
          </div>
        }
      </div>

      <div class="rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5">
        <h3 class="text-sm font-medium text-card-foreground">Alertas</h3>
        @if (alerts().length === 0) {
          <p class="py-4 text-center text-xs text-muted-foreground">Sin alertas activas</p>
        } @else {
          <div class="mt-3 space-y-2">
            @for (alert of alerts(); track alert.id) {
              <div
                class="flex gap-3 rounded-lg border p-3"
                [class]="alert.level === 'critical' ? 'border-destructive/20 bg-destructive/5' : alert.level === 'warning' ? 'border-warning/20 bg-warning/5' : 'border-primary/20 bg-accent/30'"
              >
                <app-icon
                  [name]="alertIcon(alert.level)"
                  [size]="16"
                  class="mt-0.5 shrink-0"
                  [class.text-destructive]="alert.level === 'critical'"
                  [class.text-warning]="alert.level === 'warning'"
                  [class.text-primary]="alert.level === 'info'"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-card-foreground">{{ alert.title }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground">{{ alert.detail }}</p>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  imports: [IconComponent],
})
export class NotificationsPanelComponent {
  readonly notifications = input<Notification[]>([]);
  readonly alerts = input<Alert[]>([]);

  hasUnread(): boolean {
    return this.notifications().some((n) => n.unread);
  }

  unreadCount(): number {
    return this.notifications().filter((n) => n.unread).length;
  }

  alertIcon(level: string): string {
    return level === 'critical' ? 'circle-alert' : level === 'warning' ? 'triangle-alert' : 'info';
  }
}
