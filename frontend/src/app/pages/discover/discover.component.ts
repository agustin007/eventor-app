import { Component, OnInit, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../components/map/map.component';
import { CarouselComponent } from '../../components/map/carousel/carousel.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, MapComponent, CarouselComponent, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-full">
      <!-- Loading State -->
      <app-loader [show]="isLoading()" [message]="'Cargando eventos...'" />
      
      <!-- Filter Chips -->
      <div class="absolute top-4 left-4 right-4 z-20 flex gap-2 overflow-x-auto hide-scrollbar">
        <button 
          (click)="selectCategory(null)"
          [class.bg-primary-600]="selectedCategory() === null"
          [class.bg-white]="selectedCategory() !== null"
          [class.bg-opacity-10]="selectedCategory() !== null"
          class="px-4 py-2 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium whitespace-nowrap hover:bg-white/20 transition-colors">
          Todos ({{ allEvents().length }})
        </button>
        
        @for (cat of categories; track cat) {
          <button 
            (click)="selectCategory(cat)"
            [class.bg-primary-600]="selectedCategory() === cat"
            [class.bg-white]="selectedCategory() !== cat"
            [class.bg-opacity-10]="selectedCategory() !== cat"
            class="px-4 py-2 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium whitespace-nowrap hover:bg-white/20 transition-colors">
            {{ cat }} ({{ eventCountByCategory()[cat] || 0 }})
          </button>
        }
      </div>

      <!-- Map -->
      <app-map 
        [events]="filteredEvents()" 
        [selectedEvent]="selectedEvent()"
        (markerClicked)="onEventSelected($event)" />
      
      <!-- Carousel -->
      <div class="absolute bottom-0 left-0 w-full z-10 pb-4 pointer-events-none">
        <div class="pointer-events-auto">
          <app-carousel 
            [events]="filteredEvents()" 
            (eventSelected)="onEventSelected($event)" />
        </div>
      </div>

      <!-- Event Count Badge -->
      @if (filteredEvents().length > 0) {
        <div class="absolute top-4 right-4 z-20 px-4 py-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium">
          {{ filteredEvents().length }} evento{{ filteredEvents().length !== 1 ? 's' : '' }}
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      padding-left: 256px;
      padding-top: 64px;
    }
    
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class DiscoverComponent implements OnInit {
  private eventService = inject(EventService);

  // State signals
  allEvents = signal<Event[]>([]);
  selectedCategory = signal<string | null>(null);
  selectedEvent = signal<Event | null>(null);
  isLoading = signal(false);

  // Static data
  categories = ['Music', 'Food', 'Art', 'Tech', 'Party', 'Nature'];

  // Computed signals - derived state
  filteredEvents = computed(() => {
    const category = this.selectedCategory();
    const all = this.allEvents();

    if (!category) return all;
    return all.filter(e => e.category === category);
  });

  // Computed - count events by category
  eventCountByCategory = computed(() => {
    const all = this.allEvents();
    const counts: Record<string, number> = {};

    this.categories.forEach(cat => {
      counts[cat] = all.filter(e => e.category === cat).length;
    });

    return counts;
  });

  constructor() {
    // Effect for logging filtered events (útil para debugging)
    effect(() => {
      console.log('Filtered events count:', this.filteredEvents().length);
      console.log('Selected category:', this.selectedCategory());
    });
  }

  ngOnInit() {
    console.log('DiscoverComponent initialized');
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading.set(true);

    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log('Events loaded:', data.length);
        this.allEvents.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(category: string | null) {
    this.selectedCategory.set(category);
    // No need to reload - computed will auto-update!
  }

  onEventSelected(event: Event) {
    this.selectedEvent.set(event);
    console.log('Selected:', event.title);
  }
}
