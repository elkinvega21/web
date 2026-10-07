import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { AppConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  actividadTipos,
  clientes,
  formatCurrency,
  getActividad,
  getCliente,
  getHistorial,
  getPedidosCliente,
} from '../../../../core/data/clientes-data';

type Tab = 'general' | 'direcciones' | 'contactos' | 'pedidos' | 'historial' | 'actividad';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [RouterLink, IconComponent, AppConfirmDialog],
  template: `
    @if (cliente; as c) {
      <div>
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button type="button" (click)="goBack()"
              class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Volver a clientes">
              <app-icon name="arrow-left" [size]="20" />
            </button>
            <p class="text-xs text-muted-foreground">
              <a routerLink="/clientes" class="transition-colors hover:text-foreground">Clientes</a>
              <span class="mx-1">/</span>
              <span class="text-foreground">{{ c.nombre }}</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" (click)="goEdit()"
              class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              <app-icon name="square-pen" [size]="16" /> Editar
            </button>
            <button type="button" (click)="goDelete()"
              class="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-2 text-muted-foreground transition-colors hover:bg-muted"
              aria-label="Más opciones">
              <app-icon name="ellipsis-vertical" [size]="16" />
            </button>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-card p-6 ring-1 ring-foreground/5">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-start gap-4">
              <span class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary" aria-hidden="true">{{ c.initials }}</span>
              <div>
                <h1 class="text-xl font-semibold tracking-tight text-card-foreground">{{ c.nombre }}</h1>
                <p class="mt-0.5 text-sm text-muted-foreground">{{ c.tipoIdentificacion }} {{ c.identificacion }} · {{ c.territorio }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span [class]="estadoBadge(c.estado)">{{ c.estado }}</span>
                  <span [class]="categoriaBadge(c.categoria)">Cat. {{ c.categoria }}</span>
                  <span class="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-accent-foreground">
                    <app-icon name="shopping-cart" [size]="12" /> {{ c.totalPedidos }} pedidos
                  </span>
                </div>
              </div>
            </div>
            <div class="text-left sm:text-right">
              <p class="text-2xl font-semibold tracking-tight text-card-foreground">{{ formatCurrency(c.totalGastado) }}</p>
              <p class="text-xs text-muted-foreground">Total gastado</p>
            </div>
          </div>

          <div class="mt-6 grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <app-icon name="mail" [size]="16" class="shrink-0" /> {{ c.email }}
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <app-icon name="phone" [size]="16" class="shrink-0" /> {{ c.telefono }}
            </div>
            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <app-icon name="user" [size]="16" class="shrink-0" /> Vendedor: {{ c.vendedorAsignado }}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <div class="flex gap-1 overflow-x-auto border-b border-border" role="tablist" aria-label="Secciones del cliente">
            @for (tab of tabs; track tab.key) {
              <button type="button" role="tab" [attr.aria-selected]="activeTab() === tab.key ? 'true' : 'false'"
                (click)="setTab(tab.key)" [class]="tabClass(tab.key)">
                {{ tab.label }}
              </button>
            }
          </div>

          <div class="mt-6" role="tabpanel">
            @switch (activeTab()) {
              @case ('general') {
                <div class="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  @for (field of generalFields(); track field[0]) {
                    <div class="flex flex-col gap-0.5">
                      <span class="text-xs text-muted-foreground">{{ field[0] }}</span>
                      <span class="text-sm font-medium text-card-foreground">{{ field[1] }}</span>
                    </div>
                  }
                </div>
              }
              @case ('direcciones') {
                @if (c.direcciones.length === 0) {
                  <div class="flex flex-col items-center justify-center py-12 text-center">
                    <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <app-icon name="map-pin" [size]="24" />
                    </span>
                    <p class="mt-3 text-sm text-muted-foreground">Sin direcciones registradas</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (dir of c.direcciones; track dir.id) {
                      <div class="flex items-start gap-3 rounded-lg border border-border p-4">
                        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                          <app-icon name="map-pin" [size]="18" />
                        </span>
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <p class="text-sm font-medium text-card-foreground">{{ dir.tipo }}</p>
                            @if (dir.esPrincipal) {
                              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Principal</span>
                            }
                          </div>
                          <p class="mt-0.5 text-sm text-muted-foreground">{{ dir.linea }}</p>
                          <p class="text-xs text-muted-foreground">{{ dir.ciudad }}, {{ dir.departamento }}</p>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
              @case ('contactos') {
                @if (c.contactos.length === 0) {
                  <div class="flex flex-col items-center justify-center py-12 text-center">
                    <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <app-icon name="user" [size]="24" />
                    </span>
                    <p class="mt-3 text-sm text-muted-foreground">Sin contactos registrados</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (contacto of c.contactos; track contacto.id) {
                      <div class="flex items-start gap-3 rounded-lg border border-border p-4">
                        <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground" aria-hidden="true">{{ contacto.initials }}</span>
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-2">
                            <p class="text-sm font-medium text-card-foreground">{{ contacto.nombre }}</p>
                            @if (contacto.principal) {
                              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Principal</span>
                            }
                          </div>
                          <p class="text-xs text-muted-foreground">{{ contacto.cargo }}</p>
                          <div class="mt-1.5 flex flex-wrap gap-3">
                            <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <app-icon name="mail" [size]="12" /> {{ contacto.email }}
                            </span>
                            <span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <app-icon name="phone" [size]="12" /> {{ contacto.telefono }}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
              @case ('pedidos') {
                @if (pedidos.length === 0) {
                  <div class="flex flex-col items-center justify-center py-12 text-center">
                    <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <app-icon name="shopping-cart" [size]="24" />
                    </span>
                    <p class="mt-3 text-sm text-muted-foreground">Este cliente aún no tiene pedidos</p>
                  </div>
                } @else {
                  <div class="overflow-x-auto rounded-lg border border-border">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b border-border bg-muted/50">
                          <th scope="col" class="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                          <th scope="col" class="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                          <th scope="col" class="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                          <th scope="col" class="px-4 py-3 text-center font-medium text-muted-foreground">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (p of pedidos; track p.id) {
                          <tr class="border-b border-border transition-colors hover:bg-muted/30">
                            <td class="px-4 py-3 font-medium text-card-foreground">{{ p.id }}</td>
                            <td class="px-4 py-3 text-muted-foreground">{{ p.fecha }}</td>
                            <td class="px-4 py-3 text-right font-mono tabular-nums text-card-foreground">{{ formatCurrency(p.total) }}</td>
                            <td class="px-4 py-3 text-center">
                              <span [class]="pedidoEstadoBadge(p.estado)">{{ p.estado }}</span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                }
              }
              @case ('historial') {
                @if (historial.length === 0) {
                  <div class="flex flex-col items-center justify-center py-12 text-center">
                    <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <app-icon name="history" [size]="24" />
                    </span>
                    <p class="mt-3 text-sm text-muted-foreground">Sin cambios registrados</p>
                  </div>
                } @else {
                  <div class="max-w-lg">
                    @for (entry of historial; track entry.id) {
                      <div class="relative flex gap-3 pb-6">
                        @if (!$last) {
                          <div class="absolute left-3.5 top-8 h-full w-px bg-border" aria-hidden="true"></div>
                        }
                        <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground ring-2 ring-background">
                          <app-icon [name]="historialIcon(entry.tipo)" [size]="14" />
                        </span>
                        <div class="min-w-0 flex-1">
                          <p class="text-sm text-card-foreground">
                            <span class="font-medium">{{ entry.usuario }}</span>
                            <span class="text-muted-foreground"> {{ entry.accion }}</span>
                          </p>
                          <p class="text-xs text-muted-foreground">{{ entry.detalle }}</p>
                          <p class="mt-0.5 text-[11px] text-muted-foreground/60">{{ entry.fecha }}</p>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
              @case ('actividad') {
                @if (actividad.length === 0 && !nuevaOpen()) {
                  <div class="flex flex-col items-center justify-center py-12 text-center">
                    <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <app-icon name="message-square" [size]="24" />
                    </span>
                    <p class="mt-3 text-sm text-muted-foreground">Sin actividad registrada</p>
                    <button type="button" (click)="openNuevaActividad()"
                      class="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                      <app-icon name="plus" [size]="16" /> Registrar actividad
                    </button>
                  </div>
                } @else {
                  <div class="space-y-4">
                    @if (nuevaOpen()) {
                      <form (ngSubmit)="guardarActividad()" class="rounded-xl border border-border bg-card p-5">
                        <div class="mb-4 flex items-center justify-between">
                          <h3 class="text-sm font-medium text-card-foreground">Nueva actividad</h3>
                          <button type="button" (click)="closeNuevaActividad()" class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted" aria-label="Cerrar">
                            <app-icon name="x" [size]="16" />
                          </button>
                        </div>
                        <div class="space-y-3">
                          <div class="flex flex-wrap gap-2">
                            @for (t of actividadTipos; track t.key) {
                              <button type="button" (click)="setNuevaTipo(t.key)" [class]="actividadTipoBtnClass(t.key)">
                                <app-icon [name]="t.icon" [size]="14" /> {{ t.label }}
                              </button>
                            }
                          </div>
                          <textarea [value]="nuevaDescripcion()" (input)="onNuevaDescripcion($event)"
                            placeholder="Describe la actividad…" rows="3"
                            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"></textarea>
                          <div class="flex justify-end gap-2">
                            <button type="button" (click)="closeNuevaActividad()"
                              class="inline-flex h-8 items-center rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted">Cancelar</button>
                            <button type="submit" [disabled]="guardandoActividad() || !nuevaDescripcion().trim()"
                              class="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                              @if (guardandoActividad()) {
                                <app-icon name="loader-2" [size]="12" />
                              }
                              Guardar
                            </button>
                          </div>
                        </div>
                      </form>
                    } @else {
                      <button type="button" (click)="openNuevaActividad()"
                        class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                        <app-icon name="plus" [size]="16" /> Registrar actividad
                      </button>
                    }
                    <div class="space-y-4">
                      @for (entry of actividad; track entry.id) {
                        <div class="flex gap-3">
                          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                            <app-icon [name]="actividadIcon(entry.tipo)" [size]="16" />
                          </span>
                          <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-2">
                              <span class="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{{ actividadTipoLabel(entry.tipo) }}</span>
                              <span class="text-xs text-muted-foreground">{{ entry.fecha }}</span>
                            </div>
                            <p class="mt-1 text-sm text-card-foreground">{{ entry.descripcion }}</p>
                            <p class="text-xs text-muted-foreground">por {{ entry.realizadoPor }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              }
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-4 py-16 text-center">
        <span class="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <app-icon name="circle-alert" [size]="24" />
        </span>
        <p class="mt-3 text-sm font-medium text-foreground">Cliente no encontrado</p>
        <p class="mt-1 text-xs text-muted-foreground">El cliente que buscas no existe o fue eliminado.</p>
        <a routerLink="/clientes"
          class="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Volver a clientes</a>
      </div>
    }

    <app-confirm-dialog [(open)]="deleteOpen" icon="circle-alert" title="Eliminar cliente"
      [description]="deleteDescription" confirmLabel="Eliminar cliente" [loading]="deleting()"
      (confirm)="confirmDelete()" />
  `,
})
export class CustomerDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly tabs: { key: Tab; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'direcciones', label: 'Direcciones' },
    { key: 'contactos', label: 'Contactos' },
    { key: 'pedidos', label: 'Pedidos' },
    { key: 'historial', label: 'Historial' },
    { key: 'actividad', label: 'Actividad' },
  ];

  readonly activeTab = signal<Tab>('general');
  readonly deleteOpen = signal(false);
  readonly deleting = signal(false);
  readonly nuevaOpen = signal(false);
  readonly nuevaTipo = signal<string>('llamada');
  readonly nuevaDescripcion = signal('');
  readonly guardandoActividad = signal(false);

  readonly customerId = this.route.snapshot.paramMap.get('id');
  readonly cliente = this.customerId ? getCliente(this.customerId) : undefined;
  readonly pedidos = this.cliente ? getPedidosCliente(this.cliente.id) : [];
  readonly historial = this.cliente ? getHistorial(this.cliente.id) : [];
  readonly actividad = this.cliente ? getActividad(this.cliente.id) : [];

  readonly actividadTipos = actividadTipos;

  readonly deleteDescription = this.cliente
    ? `Esta acción no se puede deshacer. Se eliminará permanentemente el cliente ${this.cliente.nombre} (${this.cliente.identificacion}) y todos sus datos asociados.`
    : '';

  readonly generalFields = computed(() => {
    const c = this.cliente;
    if (!c) {
      return [];
    }
    return [
      ['Tipo identificación', c.tipoIdentificacion],
      ['Número', c.identificacion],
      ['Razón social', c.nombre],
      ['Email', c.email],
      ['Teléfono', c.telefono],
      ['Celular', c.celular],
      ['Territorio', c.territorio],
      ['Ciudad', c.ciudad],
      ['Departamento', c.departamento],
      ['Vendedor asignado', c.vendedorAsignado],
      ['Categoría', c.categoria],
      ['Estado', c.estado],
      ['Fecha de creación', c.fechaCreacion],
      ['Última compra', c.ultimaCompra],
      ['Total pedidos', String(c.totalPedidos)],
      ['Total gastado', formatCurrency(c.totalGastado)],
    ];
  });

  goBack(): void {
    this.router.navigate(['/clientes']);
  }

  goEdit(): void {
    if (this.customerId) {
      this.router.navigate(['/clientes', this.customerId, 'editar']);
    }
  }

  goDelete(): void {
    this.deleteOpen.set(true);
  }

  confirmDelete(): void {
    if (!this.customerId) {
      return;
    }
    this.deleting.set(true);
    window.setTimeout(() => {
      const index = clientes.findIndex((c) => c.id === this.customerId);
      if (index !== -1) {
        clientes.splice(index, 1);
      }
      this.deleting.set(false);
      this.router.navigate(['/clientes']);
    }, 900);
  }

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  openNuevaActividad(): void {
    this.nuevaOpen.set(true);
  }

  closeNuevaActividad(): void {
    this.nuevaOpen.set(false);
    this.nuevaDescripcion.set('');
  }

  setNuevaTipo(tipo: string): void {
    this.nuevaTipo.set(tipo);
  }

  onNuevaDescripcion(event: Event): void {
    this.nuevaDescripcion.set((event.target as HTMLTextAreaElement).value);
  }

  guardarActividad(): void {
    if (!this.nuevaDescripcion().trim()) {
      return;
    }
    this.guardandoActividad.set(true);
    window.setTimeout(() => {
      this.guardandoActividad.set(false);
      this.closeNuevaActividad();
    }, 800);
  }

  tabClass(key: Tab): string {
    return (
      'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors -mb-px ' +
      (this.activeTab() === key
        ? 'border-primary text-primary'
        : 'border-transparent text-muted-foreground hover:text-foreground')
    );
  }

  estadoBadge(estado: string): string {
    return (
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ' +
      (estado === 'Activo' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground')
    );
  }

  categoriaBadge(categoria: string): string {
    return (
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ' +
      (categoria === 'A' ? 'bg-success/10 text-success' : categoria === 'B' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground')
    );
  }

  pedidoEstadoBadge(estado: string): string {
    return (
      'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ' +
      (estado === 'Completado'
        ? 'bg-success/10 text-success'
        : estado === 'Pendiente'
          ? 'bg-warning/10 text-warning'
          : 'bg-destructive/10 text-destructive')
    );
  }

  historialIcon(tipo: string): string {
    return tipo === 'creacion' ? 'plus' : tipo === 'eliminacion' ? 'x' : 'square-pen';
  }

  actividadIcon(tipo: string): string {
    return tipo === 'llamada' ? 'phone' : tipo === 'correo' ? 'mail' : tipo === 'reunion' ? 'users' : 'message-square';
  }

  actividadTipoLabel(tipo: string): string {
    return actividadTipos.find((t) => t.key === tipo)?.label ?? tipo;
  }

  actividadTipoBtnClass(tipo: string): string {
    return (
      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ' +
      (this.nuevaTipo() === tipo
        ? 'bg-primary text-primary-foreground'
        : 'bg-muted text-muted-foreground hover:bg-accent')
    );
  }

  formatCurrency(value: number): string {
    return formatCurrency(value);
  }
}
