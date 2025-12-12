import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Event } from '../../../../../core/services/event.service';
import { EventCardComponent } from '../../../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, EventCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
      @for (event of events(); track event.id) {
        <div 
          (click)="onCardClick(event)"
          class="snap-center shrink-0 w-[280px] h-[160px] bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden relative group cursor-pointer hover:border-primary-500/50 transition-all">
          
          <!-- Image Background -->
          <img 
            [src]="event.imageUrl" 
            [alt]="event.title"
            class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity">

          <!-- Content Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end">
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-bold px-2 py-1 rounded-full bg-primary-500/80 text-white">
                {{ event.category }}
              </span>
              <span class="text-xs font-medium text-gray-300 bg-black/50 px-2 py-1 rounded-lg">
                {{ event.date | date:'MMM d, HH:mm' }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-white leading-tight mb-1">{{ event.title }}</h3>
            <p class="text-sm text-gray-400 truncate">{{ event.location }}</p>
            
            @if (event.price === 0) {
              <p class="text-sm font-semibold text-green-400 mt-1">Gratis</p>
            } @else {
              <p class="text-sm font-semibold text-primary-400 mt-1">{{ event.price | currency }}</p>
            }
          </div>
        </div>
      } @empty {
        <div class="w-full py-12 text-center">
          <p class="text-gray-400 text-lg">No hay eventos disponibles</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    ::-webkit-scrollbar {
      display: none;
    }
    
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class CarouselComponent {
  // Input signals
  events = input.required<Event[]>();

  // Output signal (Angular 18 new API)
  eventSelected = output<Event>();

  constructor(private router: Router) { }

  onCardClick(event: Event) {
    this.eventSelected.emit(event);
    this.router.navigate(['/events', event.id]);
  }
}
