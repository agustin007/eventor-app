import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

interface DashboardStats {
  totalViews: number;
  ticketsSold: number;
  revenue: number;
  rating: number;
}

interface MyEvent {
  title: string;
  status: 'Published' | 'Draft';
  views: number;
  sales: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-white">Dashboard B2B</h2>
        <button class="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors">
          Crear Evento
        </button>
      </div>
      
      <!-- Loading -->
      <app-loader [show]="isLoading()" [message]="'Cargando dashboard...'" />

      @if (!isLoading()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-primary-500/50 transition-all">
            <p class="text-gray-400 text-sm">Total Vistas</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats()?.totalViews || 0 }}</p>
            <p class="text-xs text-green-400 mt-2">↑ 12% vs mes anterior</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all">
            <p class="text-gray-400 text-sm">Tickets Vendidos</p>
            <p class="text-3xl font-bold text-accent mt-2">{{ stats()?.ticketsSold || 0 }}</p>
            <p class="text-xs text-green-400 mt-2">↑ 8% vs mes anterior</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all">
            <p class="text-gray-400 text-sm">Ingresos</p>
            <p class="text-3xl font-bold text-green-400 mt-2">\${{ formatNumber(stats()?.revenue || 0) }}</p>
            <p class="text-xs text-green-400 mt-2">↑ 15% vs mes anterior</p>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
            <p class="text-gray-400 text-sm">Rating Promedio</p>
            <p class="text-3xl font-bold text-yellow-400 mt-2">⭐ {{ stats()?.rating || 0 }}</p>
            <p class="text-xs text-gray-400 mt-2">Basado en {{ eventCount() }} eventos</p>
          </div>
        </div>

        <!-- Events List -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">Mis Eventos ({{ eventCount() }})</h3>
          <div class="flex gap-2">
            @for (filterOpt of filterOptions; track filterOpt) {
              <button 
                (click)="selectedFilter.set(filterOpt)"
                [class.bg-primary-600]="selectedFilter() === filterOpt"
                [class.bg-white]="selectedFilter() !== filterOpt"
                [class.bg-opacity-10]="selectedFilter() !== filterOpt"
                class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors">
                {{ filterOpt }}
              </button>
            }
          </div>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          @if (filteredEvents().length === 0) {
            <div class="p-12 text-center text-gray-400">
              No hay eventos {{ selectedFilter() === 'Todos' ? '' : selectedFilter().toLowerCase() }}
            </div>
          } @else {
            <table class="w-full text-left">
              <thead class="bg-white/5 text-gray-400 text-sm uppercase">
                <tr>
                  <th class="p-4">Evento</th>
                  <th class="p-4">Estado</th>
                  <th class="p-4">Vistas</th>
                  <th class="p-4">Ventas</th>
                  <th class="p-4">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-gray-300">
                @for (event of filteredEvents(); track event.title) {
                  <tr class="hover:bg-white/5 transition-colors">
                    <td class="p-4 font-medium text-white">{{ event.title }}</td>
                    <td class="p-4">
                      @if (event.status === 'Published') {
                        <span class="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                          Publicado
                        </span>
                      } @else {
                        <span class="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">
                          Borrador
                        </span>
                      }
                    </td>
                    <td class="p-4">{{ event.views }}</td>
                    <td class="p-4 font-semibold text-primary-400">{{ event.sales }}</td>
                    <td class="p-4">
                      <button class="text-accent hover:text-white mr-3 transition-colors">Editar</button>
                      <button class="text-red-400 hover:text-white transition-colors">Borrar</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);

  // State signals
  stats = signal<DashboardStats | null>(null);
  myEvents = signal<MyEvent[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedFilter = signal<string>('Todos');

  filterOptions = ['Todos', 'Publicados', 'Borradores'];

  // Computed signals
  eventCount = computed(() => this.myEvents().length);

  filteredEvents = computed(() => {
    const filter = this.selectedFilter();
    const events = this.myEvents();

    switch (filter) {
      case 'Publicados':
        return events.filter(e => e.status === 'Published');
      case 'Borradores':
        return events.filter(e => e.status === 'Draft');
      default:
        return events;
    }
  });

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading.set(true);
    this.error.set(null);

    // Load stats
    this.userService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: (err) => {
        console.error('Error loading stats:', err);
        this.error.set('No se pudieron cargar las estadísticas');
      }
    });

    // Load events
    this.userService.getMyEvents().subscribe({
      next: (data) => {
        this.myEvents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error.set('No se pudieron cargar los eventos');
        this.isLoading.set(false);
      }
    });
  }

  formatNumber(num: number): string {
    return num.toLocaleString('es-AR');
  }
}
