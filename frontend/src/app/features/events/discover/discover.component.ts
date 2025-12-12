import { Component, OnInit, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../components/map/map.component';
import { CarouselComponent } from '../components/map/carousel/carousel.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EventService, Event } from '../../../core/services/event.service';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, MapComponent, CarouselComponent, LoaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
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
