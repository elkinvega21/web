import { Component, computed, input, output, signal } from '@angular/core';

import type { CalendarEvent, Task } from '../../../../core/data/dashboard-data';
import { AppButton } from '../../../../shared/components/button/button.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  template: `
    <div class="grid grid-cols-3 gap-2">
      @for (action of actions(); track action.key) {
        <button appButton type="button" variant="outline" className="h-10 flex-col gap-1">
          <app-icon name="sparkles" [size]="16" />
          <span class="text-xs">{{ action.label }}</span>
        </button>
      }
    </div>
  `,
  imports: [AppButton, IconComponent],
})
export class QuickActionsComponent {
  readonly actions = input<{ key: string; label: string }[]>([]);
}

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  template: `
    <div>
      <div class="flex items-center justify-between">
        <button type="button" (click)="prevMonth()" class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-primary">
          <app-icon name="chevron-left" [size]="16" />
        </button>
        <span class="min-w-[72px] text-center text-sm font-medium capitalize">{{ monthName() }} {{ year() }}</span>
        <button type="button" (click)="nextMonth()" class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-primary">
          <app-icon name="chevron-right" [size]="16" />
        </button>
      </div>
      <div class="mt-3 grid grid-cols-7 gap-1 text-center">
        @for (d of weekDays; track d) {
          <span class="text-xs text-muted-foreground">{{ d }}</span>
        }
        @for (b of blanks(); track b) {
          <span></span>
        }
        @for (day of days(); track day) {
          <div class="relative flex items-center justify-center">
            <span
              class="flex size-7 items-center justify-center rounded-full text-sm"
              [class.bg-primary]="isToday(day)"
              [class.font-semibold]="isToday(day)"
              [class.text-primary-foreground]="isToday(day)"
              [class.text-muted-foreground]="!isToday(day)"
            >{{ day }}</span>
            @if (hasEvent(day)) {
              <span class="absolute size-1 rounded-full" [class]="toneClass(day)" [style.bottom.px]="4"></span>
            }
          </div>
        }
      </div>
      <div class="mt-3 border-t border-border pt-3">
        @for (event of upcomingEvents(); track event.label + event.day) {
          <div class="flex items-start gap-2">
            <span class="mt-1.5 size-2 shrink-0 rounded-full" [class]="event.toneClass"></span>
            <div>
              <p class="text-sm text-card-foreground">{{ event.label }}</p>
              <p class="text-xs text-muted-foreground">Día {{ event.day }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  imports: [IconComponent],
})
export class CalendarWidgetComponent {
  readonly events = input<CalendarEvent[]>([]);

  readonly today = new Date();
  readonly month = signal(this.today.getMonth());
  readonly year = signal(this.today.getFullYear());

  readonly weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  readonly monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  readonly daysInMonth = computed(() => new Date(this.year(), this.month() + 1, 0).getDate());
  readonly firstDay = computed(() => new Date(this.year(), this.month(), 1).getDay());
  readonly days = computed(() => Array.from({ length: this.daysInMonth() }, (_, i) => i + 1));
  readonly blanks = computed(() => Array.from({ length: this.firstDay() }, (_, i) => i));

  readonly upcomingEvents = computed(() =>
    this.events().map((e) => ({ label: e.label, day: e.day, toneClass: this.toneClassFor(e.tone) })),
  );

  monthName(): string {
    return this.monthNames[this.month()];
  }

  isToday(day: number): boolean {
    return day === this.today.getDate() && this.month() === this.today.getMonth() && this.year() === this.today.getFullYear();
  }

  hasEvent(day: number): boolean {
    return this.events().some((e) => e.day === day);
  }

  toneClass(day: number): string {
    const ev = this.events().find((e) => e.day === day);
    return ev ? this.toneClassFor(ev.tone) : '';
  }

  toneClassFor(tone: string): string {
    return tone === 'primary' ? 'bg-primary' : tone === 'success' ? 'bg-success' : 'bg-warning';
  }

  prevMonth(): void {
    if (this.month() === 0) {
      this.year.update((y) => y - 1);
      this.month.set(11);
    } else {
      this.month.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.month() === 11) {
      this.year.update((y) => y + 1);
      this.month.set(0);
    } else {
      this.month.update((m) => m + 1);
    }
  }
}

@Component({
  selector: 'app-tasks-widget',
  standalone: true,
  template: `
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium text-card-foreground">Tareas pendientes</h3>
      <span class="text-xs text-muted-foreground">{{ done() }} de {{ tasks().length }} completadas</span>
    </div>
    <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div class="h-full rounded-full bg-primary transition-all" [style.width.%]="progress()"></div>
    </div>
    <div class="mt-4 space-y-1">
      @for (task of tasks(); track task.id) {
        <div class="flex items-center gap-2.5 rounded-lg px-2.5 py-2" [class.opacity-50]="task.done">
          <button
            type="button"
            (click)="taskToggle.emit(task.id)"
            class="flex size-4 shrink-0 items-center justify-center rounded-md border transition-colors"
            [attr.aria-label]="task.done ? 'Marcar como pendiente' : 'Marcar como completada'"
            [class.border-success]="task.done"
            [class.bg-success]="task.done"
            [class.text-success-foreground]="task.done"
            [class.hover:border-primary]="!task.done"
          >
            @if (task.done) {
              <app-icon name="check" [size]="12" />
            }
          </button>
          <span class="min-w-0 flex-1 truncate text-sm text-card-foreground" [class.line-through]="task.done">{{ task.title }}</span>
          <span class="shrink-0 text-xs text-muted-foreground">{{ task.due }}</span>
        </div>
      }
    </div>
  `,
  imports: [IconComponent],
})
export class TasksWidgetComponent {
  readonly tasks = input<Task[]>([]);
  readonly taskToggle = output<string>();

  readonly done = computed(() => this.tasks().filter((t) => t.done).length);

  progress(): number {
    return this.tasks().length === 0 ? 0 : (this.done() / this.tasks().length) * 100;
  }
}
