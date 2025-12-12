import { Component, OnInit, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services/user.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';

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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
      next: (data: any) => {
        this.stats.set(data);
      },
      error: (err: any) => {
        console.error('Error loading stats:', err);
        this.error.set('No se pudieron cargar las estadísticas');
      }
    });

    // Load events
    this.userService.getMyEvents().subscribe({
      next: (data: any[]) => {
        this.myEvents.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
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
