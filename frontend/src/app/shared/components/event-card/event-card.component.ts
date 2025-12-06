import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../services/event.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      [routerLink]="['/events', event().id]"
      class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/10">
      
      <!-- Image -->
      <div class="relative h-48 overflow-hidden">
        <img 
          [src]="event().imageUrl" 
          [alt]="event().title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
        
        <!-- Category badge -->
        <div class="absolute top-3 right-3">
          @switch (event().category) {
            @case ('Music') { 
              <span class="px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-purple-400/50">
                🎵 Música
              </span>
            }
            @case ('Food') { 
              <span class="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-orange-400/50">
                🍕 Gastronomía
              </span>
            }
            @case ('Art') { 
              <span class="px-3 py-1 bg-pink-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-pink-400/50">
                🎨 Arte
              </span>
            }
            @case ('Tech') { 
              <span class="px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-green-400/50">
                💻 Tech
              </span>
            }
            @case ('Party') { 
              <span class="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-red-400/50">
                🎉 Fiesta
              </span>
            }
            @case ('Nature') { 
              <span class="px-3 py-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-emerald-400/50">
                🌿 Naturaleza
              </span>
            }
            @default { 
              <span class="px-3 py-1 bg-gray-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-gray-400/50">
                📅 Evento
              </span>
            }
          }
        </div>
      </div>

      <!-- Content -->
      <div class="p-5">
        <!-- Title -->
        <h3 class="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {{ event().title }}
        </h3>

        <!-- Date -->
        <p class="text-gray-400 text-sm mb-3 flex items-center gap-2">
          <span class="text-lg">📅</span>
          {{ formattedDate() }}
        </p>

        <!-- Location -->
        <p class="text-gray-300 text-sm mb-4 flex items-center gap-2">
          <span class="text-lg">📍</span>
          {{ event().location }}
        </p>

        <!-- Price -->
        <div class="flex items-center justify-between">
          @if (event().price === 0) {
            <span class="px-4 py-2 bg-green-500/20 text-green-400 font-bold text-sm rounded-full border border-green-500/30">
              ✨ Gratis
            </span>
          } @else {
            <span class="px-4 py-2 bg-primary-500/20 text-primary-400 font-bold text-sm rounded-full border border-primary-500/30">
              {{ formattedPrice() }}
            </span>
          }

          <div class="text-primary-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
            Ver más →
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class EventCardComponent {
  // Input signal (required)
  event = input.required<Event>();

  // Computed signal - derived state
  formattedDate = computed(() => {
    const date = new Date(this.event().date);
    return date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  formattedPrice = computed(() => {
    return '$' + this.event().price.toLocaleString('es-AR');
  });
}
